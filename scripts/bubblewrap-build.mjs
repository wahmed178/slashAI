#!/usr/bin/env node
import {
  AndroidSdkTools,
  Config,
  ConsoleLog,
  GradleWrapper,
  JarSigner,
  JdkHelper,
  TwaGenerator,
  TwaManifest,
} from '@bubblewrap/core';
import {copyFile, mkdir, readFile, rm} from 'fs/promises';
import {dirname, join, resolve} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = resolve(dirname(__filename), '..');

const log = new ConsoleLog('bubblewrap');

async function main() {
  const manifestPath = process.argv[2] || 'android/twa-manifest.json';
  const projectDir = process.argv[3] || 'android/project';
  const fullManifestPath = resolve(rootDir, manifestPath);
  const fullProjectDir = resolve(rootDir, projectDir);

  const raw = JSON.parse(await readFile(fullManifestPath, 'utf-8'));

  // Ensure the keystore path is absolute before we change directories.
  const keystorePath = process.env.TWA_KEYSTORE_PATH || raw.signingKey?.path;
  if (!keystorePath) {
    throw new Error(
      'No signing keystore configured. Set TWA_KEYSTORE_PATH or signingKey.path in the manifest.',
    );
  }
  const absoluteKeystorePath = resolve(
    keystorePath.startsWith('/') ? rootDir : rootDir,
    keystorePath,
  );

  const manifestData = {
    ...raw,
    webManifestUrl: raw.webManifestUrl || `https://${raw.host}/manifest.webmanifest`,
    // The project uses a foreground icon, not a true monochrome icon. Leaving
    // monochromeIconUrl set would cause Bubblewrap to tint it incorrectly.
    monochromeIconUrl: undefined,
    shortcuts: (raw.shortcuts || []).map((s) => ({
      name: s.name,
      shortName: s.short_name || s.name,
      url: s.url,
      chosenIconUrl: s.icon,
      chosenMaskableIconUrl: s.maskableIcon,
      chosenMonochromeIconUrl: s.monochromeIcon,
    })),
    signingKey: {
      path: absoluteKeystorePath,
      alias: raw.signingKey?.alias || 'slashai',
    },
  };

  const manifest = new TwaManifest(manifestData);
  const validationError = manifest.validate();
  if (validationError !== null) {
    throw new Error(`Invalid TWA manifest: ${validationError}`);
  }

  // Remove any existing project so we always start from a clean template.
  await rm(fullProjectDir, {recursive: true, force: true});
  await mkdir(fullProjectDir, {recursive: true});

  const generator = new TwaGenerator();
  await generator.createTwaProject(
    fullProjectDir,
    manifest,
    log,
    (current, total) => {
      log.info(`Generating project: ${Math.round((current / total) * 100)}%`);
    },
  );

  const config = new Config(process.env.JAVA_HOME, process.env.ANDROID_HOME);
  const jdkHelper = new JdkHelper(process, config);
  const androidSdkTools = new AndroidSdkTools(process, config, jdkHelper);
  const gradleWrapper = new GradleWrapper(process, androidSdkTools, fullProjectDir);
  const jarSigner = new JarSigner(jdkHelper);

  const keystorePassword = process.env.BUBBLEWRAP_KEYSTORE_PASSWORD;
  const keyPassword = process.env.BUBBLEWRAP_KEY_PASSWORD;
  if (!keystorePassword || !keyPassword) {
    throw new Error(
      'BUBBLEWRAP_KEYSTORE_PASSWORD and BUBBLEWRAP_KEY_PASSWORD must be set.',
    );
  }

  log.info('Building release APK...');
  await gradleWrapper.assembleRelease();

  const unsignedApk = join(fullProjectDir, 'app/build/outputs/apk/release/app-release-unsigned.apk');
  const alignedApk = join(fullProjectDir, 'app-release-unsigned-aligned.apk');
  const signedApk = join(fullProjectDir, 'app-release-signed.apk');

  await androidSdkTools.zipalignOnlyVerification(unsignedApk);
  await copyFile(unsignedApk, alignedApk);
  await androidSdkTools.apksigner(
    manifest.signingKey.path,
    keystorePassword,
    manifest.signingKey.alias,
    keyPassword,
    alignedApk,
    signedApk,
  );

  log.info('Building release AAB...');
  await gradleWrapper.bundleRelease();

  const unsignedAab = join(fullProjectDir, 'app/build/outputs/bundle/release/app-release.aab');
  const signedAab = join(fullProjectDir, 'app-release-bundle.aab');
  await jarSigner.sign(manifest.signingKey, keystorePassword, keyPassword, unsignedAab, signedAab);

  // Copy final signed artifacts to the same directories the CLI workflow uploads.
  const finalApkDir = join(fullProjectDir, 'app/build/outputs/apk/release');
  const finalAabDir = join(fullProjectDir, 'app/build/outputs/bundle/release');
  await mkdir(finalApkDir, {recursive: true});
  await mkdir(finalAabDir, {recursive: true});
  await copyFile(signedApk, join(finalApkDir, 'app-release-signed.apk'));
  await copyFile(signedAab, join(finalAabDir, 'app-release-signed.aab'));

  log.info('Android release build complete.');
  log.info(`  APK: ${join(finalApkDir, 'app-release-signed.apk')}`);
  log.info(`  AAB: ${join(finalAabDir, 'app-release-signed.aab')}`);
}

main().catch((err) => {
  log.error(err.message || String(err));
  console.error(err);
  process.exit(1);
});
