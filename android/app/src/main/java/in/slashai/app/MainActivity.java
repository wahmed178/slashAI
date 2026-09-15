package in.slashai.app;

import android.Manifest;
import android.app.DownloadManager;
import android.content.ContentValues;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * MainActivity with full WebView download support.
 *
 * The stock WebView ignores anchor downloads, so tools (QR PNG, invoices,
 * compressed images…) silently did nothing inside the app while working fine
 * in Chrome. This activity wires three paths:
 *
 *  - http(s) URLs  → Android DownloadManager (progress + notification, saves
 *                    to the public Downloads folder, no permission needed)
 *  - data: URLs    → base64-decoded and written via MediaStore (API 29+, no
 *                    permission) or the public Downloads dir (older APIs,
 *                    with a runtime permission request)
 *  - blob: URLs    → fetched inside the page via an injected script and
 *                    handed back through a small JS bridge, then saved the
 *                    same way as data: URLs
 */
public class MainActivity extends BridgeActivity {

    private static final int REQ_WRITE_STORAGE = 4711;

    /** download waiting on the legacy storage permission (API < 29 only) */
    private Runnable pendingPermissionAction;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();
        if (webView == null) return;

        // lets the injected fetcher hand blob bytes back to native code
        webView.addJavascriptInterface(new BlobBridge(), "AndroidBlobDownloader");

        webView.setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
            try {
                if (url.startsWith("blob:")) {
                    downloadBlob(webView, url, contentDisposition, mimetype);
                } else if (url.startsWith("data:")) {
                    downloadDataUrl(url, contentDisposition, mimetype);
                } else {
                    downloadViaManager(url, userAgent, contentDisposition, mimetype);
                }
            } catch (Exception e) {
                toast("Download failed: " + e.getMessage());
            }
        });
    }

    /* ────────────────────────── http(s) downloads ────────────────────────── */

    private void downloadViaManager(String url, String userAgent, String contentDisposition, String mimetype) {
        try {
            DownloadManager.Request req = new DownloadManager.Request(Uri.parse(url));
            String cookie = CookieManager.getInstance().getCookie(url);
            if (cookie != null && !cookie.isEmpty()) req.addRequestHeader("Cookie", cookie);
            if (userAgent != null) req.addRequestHeader("User-Agent", userAgent);
            req.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            req.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS,
                    URLUtil.guessFileName(url, contentDisposition, mimetype));
            DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
            if (dm != null) {
                dm.enqueue(req);
                toast("Downloading…");
            }
        } catch (Exception e) {
            toast("Download failed");
        }
    }

    /* ─────────────────────────── data: downloads ─────────────────────────── */

    private void downloadDataUrl(String url, String contentDisposition, String fallbackMime) {
        int comma = url.indexOf(',');
        if (comma < 0) {
            toast("Download failed");
            return;
        }
        String header = url.substring(5, comma); // between "data:" and the payload
        String payload = url.substring(comma + 1);
        boolean base64 = header.contains(";base64");
        String mime = header.split(";", 2)[0];
        if (mime == null || mime.isEmpty()) {
            mime = (fallbackMime != null && !fallbackMime.isEmpty()) ? fallbackMime : "application/octet-stream";
        }
        byte[] bytes = base64
                ? Base64.decode(payload, Base64.DEFAULT)
                : payload.getBytes(StandardCharsets.UTF_8);
        String name = URLUtil.guessFileName(url, contentDisposition, mime);
        saveBytes(name, mime, bytes);
    }

    /* ─────────────────────────── blob: downloads ─────────────────────────── */

    private void downloadBlob(WebView webView, String blobUrl, String contentDisposition, String mimetype) {
        // run inside the page so the fetch is same-origin with the blob
        String name = sanitizeName(URLUtil.guessFileName(blobUrl, contentDisposition, mimetype));
        String js = "(function(){try{fetch('" + blobUrl + "').then(function(r){return r.blob()})" +
                ".then(function(b){var fr=new FileReader();fr.onload=function(){" +
                "window.AndroidBlobDownloader&&window.AndroidBlobDownloader.save('" + name +
                "',String(fr.result).split(',')[1]);};fr.readAsDataURL(b);})" +
                ".catch(function(e){console.error('download failed',e);});}catch(e){console.error('download failed',e);}})()";
        webView.evaluateJavascript(js, null);
    }

    private class BlobBridge {
        @JavascriptInterface
        public void save(String fileName, String base64) {
            try {
                byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                String name = sanitizeName(fileName);
                String mime = mimeForName(name);
                runOnUiThread(() -> saveBytes(name, mime, bytes));
            } catch (Exception e) {
                runOnUiThread(() -> toast("Download failed"));
            }
        }
    }

    /* ─────────────────────────── file writing ─────────────────────────── */

    /** API 29+: MediaStore.Downloads (no permission). Older: public Downloads
     *  with WRITE_EXTERNAL_STORAGE, falling back to the app's private dir. */
    private void saveBytes(String name, String mime, byte[] bytes) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            try {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Downloads.DISPLAY_NAME, name);
                values.put(MediaStore.Downloads.MIME_TYPE, mime);
                values.put(MediaStore.Downloads.IS_PENDING, 1);
                Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                if (uri == null) {
                    toast("Download failed");
                    return;
                }
                try (OutputStream os = getContentResolver().openOutputStream(uri)) {
                    if (os == null) throw new IllegalStateException("no output stream");
                    os.write(bytes);
                    os.flush();
                }
                ContentValues done = new ContentValues();
                done.put(MediaStore.Downloads.IS_PENDING, 0);
                getContentResolver().update(uri, done, null, null);
                toast("Saved to Downloads ✓");
            } catch (Exception e) {
                toast("Download failed");
            }
            return;
        }

        Runnable write = () -> {
            try {
                File dir = isStorageGranted()
                        ? Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                        : getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                if (dir == null) dir = getFilesDir();
                if (!dir.exists() && !dir.mkdirs()) {
                    toast("Download failed");
                    return;
                }
                File out = new File(dir, name);
                try (FileOutputStream fos = new FileOutputStream(out)) {
                    fos.write(bytes);
                    fos.flush();
                }
                toast(isStorageGranted() ? "Saved to Downloads ✓" : "Saved in app folder ✓");
            } catch (Exception e) {
                toast("Download failed");
            }
        };

        if (isStorageGranted()) {
            write.run();
        } else {
            pendingPermissionAction = write;
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQ_WRITE_STORAGE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_WRITE_STORAGE && pendingPermissionAction != null) {
            Runnable action = pendingPermissionAction;
            pendingPermissionAction = null;
            action.run(); // the runnable degrades gracefully when denied
        }
    }

    /* ─────────────────────────── helpers ─────────────────────────── */

    private boolean isStorageGranted() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                == PackageManager.PERMISSION_GRANTED;
    }

    private static String sanitizeName(String name) {
        String safe = (name == null || name.isEmpty()) ? "download" : name;
        safe = safe.replaceAll("[^A-Za-z0-9 ._()-]", "");
        return safe.isEmpty() ? "download" : safe;
    }

    private static String mimeForName(String name) {
        String n = name.toLowerCase();
        if (n.endsWith(".png")) return "image/png";
        if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
        if (n.endsWith(".webp")) return "image/webp";
        if (n.endsWith(".gif")) return "image/gif";
        if (n.endsWith(".pdf")) return "application/pdf";
        if (n.endsWith(".csv")) return "text/csv";
        if (n.endsWith(".json")) return "application/json";
        if (n.endsWith(".txt") || n.endsWith(".md")) return "text/plain";
        if (n.endsWith(".html")) return "text/html";
        if (n.endsWith(".zip")) return "application/zip";
        return "application/octet-stream";
    }

    private void toast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    /* ─────────────── hardware back = webview history ─────────────── */

    @Override
    public void onBackPressed() {
        // Try to go back in the WebView history instead of closing the app
        WebView webView = getBridge().getWebView();
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            // If no history, move task to back (minimize) instead of finishing
            moveTaskToBack(true);
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            onBackPressed();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
