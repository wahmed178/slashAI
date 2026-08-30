import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SlashAI" },
      {
        name: "description",
        content:
          "SlashAI's privacy policy — what we collect, how we use it, and your rights.",
      },
    ],
  }),
  component: PrivacyPage,
});

const YEAR = new Date().getFullYear();

function PrivacyPage() {
  return (
    <AppShell hideHeaderSearch title="Privacy Policy">
      <article className="mx-auto max-w-xl space-y-8 pt-2 pb-12">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated: January {YEAR} · Applies to all SlashAI products and
            services.
          </p>
        </header>

        <Section title="1. Introduction">
          SlashAI ("we", "us", "our") is committed to protecting your privacy.
          This Privacy Policy explains what information we collect, how we use
          it, and the choices you have. By using SlashAI (including our website,
          mobile apps, and browser tools), you agree to this policy.
        </Section>

        <Section title="2. Information We Collect">
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            a) Information you provide directly
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Email address</strong> — only
              if you join the Glass waitlist or contact us. Stored in your
              browser's localStorage. We never send it to a server.
            </li>
            <li>
              <strong className="text-foreground">Journal entries</strong> — your
              build journal text and mood selections. Stored entirely on your
              device in localStorage. Never uploaded anywhere.
            </li>
            <li>
              <strong className="text-foreground">Favourites &amp; settings</strong> — saved commands, theme
              preferences, layout choices. All localStorage, all yours.
            </li>
          </ul>

          <h3 className="mt-4 text-sm font-semibold text-foreground">
            b) Information collected automatically
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Usage analytics</strong> — we
              do <em>not</em> use Google Analytics, Mixpanel, or any third-party
              analytics service. No tracking cookies. No fingerprinting.
            </li>
            <li>
              <strong className="text-foreground">Error reports</strong> — if
              the app crashes, your browser may send a standard error report to
              our hosting provider (Vercel). This contains no personal data —
              only technical details like browser version and the page URL.
            </li>
          </ul>

          <h3 className="mt-4 text-sm font-semibold text-foreground">
            c) Third-party API calls
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            SlashAI fetches data from free public APIs (weather, markets, news,
            trivia, etc.) directly from your browser. These requests come from
            <em> your </em> device — we never proxy or store the responses on a
            server. The API providers may receive your IP address as part of
            standard HTTP requests, the same as visiting any website.
          </p>
        </Section>

        <Section title="3. How We Use Your Data">
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              To provide the app's features (search, favourites, journal,
              streaks, quiz, live dashboard).
            </li>
            <li>
              To remember your preferences (theme, layout, city, accent colour).
            </li>
            <li>
              To display your Glass membership status locally.
            </li>
            <li>
              We <strong className="text-foreground">never</strong> sell, share,
              or monetise your personal data.
            </li>
            <li>
              We <strong className="text-foreground">never</strong> run
              advertising or behavioural tracking.
            </li>
          </ul>
        </Section>

        <Section title="4. Data Storage &amp; Security">
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">All data is local.</strong>{" "}
              Your favourites, journal, settings, streaks, and waitlist email
              are stored in your browser's localStorage. They never leave your
              device.
            </li>
            <li>
              There is <strong className="text-foreground">no backend database</strong>. We do not operate
              servers that store user data.
            </li>
            <li>
              If you clear your browser data, all SlashAI data is deleted. We
              cannot recover it because we never had a copy.
            </li>
            <li>
              Data in transit is protected by HTTPS (TLS 1.3) via our hosting
              provider.
            </li>
          </ul>
        </Section>

        <Section title="5. Cookies">
          <p className="mt-2 text-sm text-muted-foreground">
            SlashAI does <strong className="text-foreground">not use cookies</strong>. We use
            localStorage and sessionStorage only, which are stored locally in
            your browser and are not sent to any server.
          </p>
        </Section>

        <Section title="6. Third-Party Services">
          <p className="mt-2 text-sm text-muted-foreground">
            SlashAI integrates with the following <em>free, public</em> APIs.
            We do not share your data with them — your browser fetches data
            directly:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              Open-Meteo (weather), CoinGecko (crypto), Frankfurter (forex)
            </li>
            <li>
              Aladhan (prayer times), NASA APOD, HackerNews
            </li>
            <li>
              Open Trivia DB, The Trivia API (quiz questions)
            </li>
            <li>
              Yahoo Finance (Indian markets, unofficial), USGS (earthquakes)
            </li>
            <li>
              AlQuran.cloud (Quran text), Affirmations.dev, Quotable
            </li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            None of these services receive any personal information from us.
            Your IP address is visible to them as it would be with any website
            visit.
          </p>
        </Section>

        <Section title="7. Children's Privacy">
          <p className="mt-2 text-sm text-muted-foreground">
            SlashAI is not directed at children under 13. We do not knowingly
            collect information from children. Since we collect no personal data
            at all, there is nothing to collect from any age group.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Right to delete</strong> —
              clear your browser data, and all SlashAI data is gone. Or use the
              "Reset all data" option in Settings.
            </li>
            <li>
              <strong className="text-foreground">Right to export</strong> —
              Settings → Export Backup downloads a JSON file with all your data.
            </li>
            <li>
              <strong className="text-foreground">Right to know</strong> — this
              policy tells you everything we have (which is: nothing, beyond
              what's in your own browser).
            </li>
          </ul>
        </Section>

        <Section title="9. Changes to This Policy">
          <p className="mt-2 text-sm text-muted-foreground">
            We may update this policy from time to time. The "Last updated" date
            at the top reflects the most recent revision. Continued use of
            SlashAI after changes constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p className="mt-2 text-sm text-muted-foreground">
            Questions about this policy? Reach us through the{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact page
            </a>{" "}
            or email{" "}
            <a
              href="mailto:hello@slashai.app"
              className="text-primary hover:underline"
            >
              hello@slashai.app
            </a>
            .
          </p>
        </Section>
      </article>
    </AppShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
