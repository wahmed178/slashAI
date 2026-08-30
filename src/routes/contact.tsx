import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SlashAI" },
      {
        name: "description",
        content:
          "Get in touch with the SlashAI team — feedback, bugs, feature requests, or just say hello.",
      },
    ],
  }),
  component: ContactPage,
});

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  createdAt: string;
};

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim() || !body.trim()) return;

      const msg: Message = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || "No subject",
        body: body.trim(),
        createdAt: new Date().toISOString(),
      };

      // Store locally (no backend — honest about it)
      const existing: Message[] = JSON.parse(
        localStorage.getItem("slashai-messages") || "[]"
      );
      existing.push(msg);
      localStorage.setItem("slashai-messages", JSON.stringify(existing));

      setSubmitted(true);
    },
    [name, email, subject, body]
  );

  return (
    <AppShell hideHeaderSearch title="Contact">
      <div className="mx-auto max-w-xl pt-2 pb-12">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Contact us
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Feedback, bugs, feature requests, or just say hello. We read every
            message.
          </p>
        </header>

        {submitted ? (
          <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
            <p className="text-2xl">📬</p>
            <p className="mt-3 text-sm font-medium text-green-500">
              Message saved!
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Stored locally on this device. Since SlashAI has no backend
              server, we can't receive emails — but your message is saved here.
              Thank you for the feedback!
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setSubject("");
                setBody("");
              }}
              className="mt-4 text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-medium text-muted-foreground"
              >
                Name *
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-medium text-muted-foreground"
              >
                Email *
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs font-medium text-muted-foreground"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Bug report, feature request, feedback…"
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <div>
              <label
                htmlFor="contact-body"
                className="block text-xs font-medium text-muted-foreground"
              >
                Message *
              </label>
              <textarea
                id="contact-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Tell us what's on your mind…"
                required
                rows={5}
                className="mt-1.5 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground/60">
                * Required fields
              </p>
              <button
                type="submit"
                disabled={!name.trim() || !email.trim() || !body.trim()}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-40"
              >
                Send message
              </button>
            </div>
          </form>
        )}

        {/* Quick contact links */}
        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-sm font-semibold text-foreground">
            Other ways to reach us
          </h2>
          <div className="mt-3 space-y-2">
            <a
              href="mailto:hello@slashai.app"
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 text-sm text-foreground transition-colors hover:border-primary/40"
            >
              <span className="text-lg">✉️</span>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-xs text-muted-foreground">
                  hello@slashai.app
                </p>
              </div>
            </a>
            <a
              href="https://github.com/wahmed178/slashAI/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 text-sm text-foreground transition-colors hover:border-primary/40"
            >
              <span className="text-lg">🐙</span>
              <div>
                <p className="font-medium">GitHub Issues</p>
                <p className="text-xs text-muted-foreground">
                  Report bugs or request features
                </p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
