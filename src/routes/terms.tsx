import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SlashAI" },
      {
        name: "description",
        content:
          "SlashAI's terms of service — rules for using the app, disclaimers, and your responsibilities.",
      },
    ],
  }),
  component: TermsPage,
});

const YEAR = new Date().getFullYear();

function TermsPage() {
  return (
    <AppShell hideHeaderSearch title="Terms of Service">
      <article className="mx-auto max-w-xl space-y-8 pt-2 pb-12">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated: January {YEAR} · These terms govern your use of
            SlashAI.
          </p>
        </header>

        <Section title="1. Acceptance of Terms">
          <p className="mt-2 text-sm text-muted-foreground">
            By accessing or using SlashAI (the "Service"), including our website
            at slashai-nu.vercel.app, mobile apps, and browser tools, you agree
            to be bound by these Terms of Service. If you do not agree, please
            do not use the Service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p className="mt-2 text-sm text-muted-foreground">
            SlashAI is a free, offline-first library of AI slash commands,
            curated resources, generators, roadmaps, glossary terms, and
            browser-based tools. The Service runs entirely in your browser —
            there is no account system, no backend database, and no server-side
            processing of your data.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>5,635+ AI slash commands with copy-ready prompt templates</li>
            <li>317+ curated free resources across 12 categories</li>
            <li>25 AI generators (founder tools)</li>
            <li>20 founder roadmaps with step tracking</li>
            <li>560+ glossary terms across 8 categories</li>
            <li>22 browser-based utility tools (calculators, converters, screensavers)</li>
            <li>Daily quiz with streaks, live dashboard, build journal</li>
            <li>Local AI assistant (WebLLM — runs in your browser)</li>
          </ul>
        </Section>

        <Section title="3. Free Usage">
          <p className="mt-2 text-sm text-muted-foreground">
            SlashAI is free to use. No account is required. No credit card is
            required. Every feature is free — no paid tier, no paywalls, no
            trials.
          </p>
        </Section>

        <Section title="4. Your Data">
          <p className="mt-2 text-sm text-muted-foreground">
            All your data — favourites, journal entries, settings, streaks, and
            preferences — is stored in your browser's localStorage. It never
            leaves your device. We have no access to it. If you clear your
            browser data, your SlashAI data is permanently deleted and cannot be
            recovered.
          </p>
        </Section>

        <Section title="5. AI-Generated Content">
          <p className="mt-2 text-sm text-muted-foreground">
            SlashAI provides AI slash commands and prompts that generate
            responses when used with AI services (OpenAI, Anthropic, Google,
            etc.). We do not generate or control the output of these AI models.
            AI-generated content may be inaccurate, incomplete, or outdated.
            Always verify critical information independently.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The generators on SlashAI (business plans, content briefs, legal
            templates, etc.) use AI to produce drafts. These are starting points
            — not professional advice. Consult qualified professionals for
            legal, financial, or medical decisions.
          </p>
        </Section>

        <Section title="6. Third-Party Links &amp; Resources">
          <p className="mt-2 text-sm text-muted-foreground">
            SlashAI curates and links to free tools, APIs, and resources from
            third parties. We do not operate, control, or endorse these external
            services. Your use of third-party services is subject to their own
            terms and privacy policies. We are not responsible for the
            availability, accuracy, or practices of external sites.
          </p>
        </Section>

        <Section title="7. Acceptable Use">
          <p className="mt-2 text-sm text-muted-foreground">
            You agree to use SlashAI responsibly and lawfully. You must not:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              Use the Service for any illegal purpose or in violation of any
              applicable law
            </li>
            <li>
              Attempt to reverse-engineer, decompile, or extract the full
              command database for competitive purposes
            </li>
            <li>
              Use automated tools (scrapers, bots) to mass-download content
              without permission
            </li>
            <li>
              Interfere with or disrupt the Service or its hosting infrastructure
            </li>
            <li>
              Imply false endorsement or affiliation with SlashAI
            </li>
          </ul>
        </Section>

        <Section title="8. Intellectual Property">
          <p className="mt-2 text-sm text-muted-foreground">
            The SlashAI application, design, code, and original content are
            owned by Waseem Ahmed. AI slash commands are curated prompts —
            individual prompts are not copyrightable, but the compilation,
            organisation, and presentation are our original work.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            You are free to use, copy, and share individual slash commands for
            personal and commercial purposes. Attribution is appreciated but not
            required.
          </p>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <p className="mt-2 text-sm text-muted-foreground">
            SlashAI is provided "as is" and "as available" without warranties of
            any kind, express or implied. We do not warrant that the Service
            will be uninterrupted, error-free, or free of harmful components.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We make no guarantees about the accuracy, completeness, or
            reliability of any content, including AI commands, resources, market
            data, weather data, trivia questions, or generated content.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p className="mt-2 text-sm text-muted-foreground">
            To the fullest extent permitted by law, SlashAI and its creator
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            Service. Our total liability shall not exceed the amount you paid
            us (which, since the Service is free, is zero).
          </p>
        </Section>

        <Section title="11. Changes to These Terms">
          <p className="mt-2 text-sm text-muted-foreground">
            We may revise these terms at any time. The "Last updated" date at
            the top reflects the most recent revision. Continued use of the
            Service after changes constitutes acceptance. We will make
            reasonable efforts to notify users of significant changes.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p className="mt-2 text-sm text-muted-foreground">
            These terms are governed by the laws of India, without regard to
            conflict of law principles. Any disputes shall be resolved in the
            courts of Hyderabad, Telangana, India.
          </p>
        </Section>

        <Section title="13. Contact">
          <p className="mt-2 text-sm text-muted-foreground">
            Questions about these terms? Reach us through the{" "}
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
