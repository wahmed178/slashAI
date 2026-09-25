import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Send, Sparkles, Check, ArrowLeft, Globe, Store } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { CATEGORY_META } from "@/lib/commands";
import { STORE_SIGNUP_FORM_URL } from "@/lib/stores";

export const Route = createFileRoute("/suggest")({
  head: () => ({
    meta: [
      { title: "Suggest a Command - SlashAI" },
      {
        name: "description",
        content: "Suggest a new AI slash command for the SlashAI library. Free and open for everyone.",
      },
    ],
  }),
  component: SuggestCommandPage,
});

function SuggestCommandPage() {
  const [commandName, setCommandName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORY_META[0]?.category ?? "Writing");
  const [author, setAuthor] = useState("");
  const [example, setExample] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = commandName.trim().startsWith("/")
      ? commandName.trim()
      : `/${commandName.trim()}`;

    if (!cleanCmd || cleanCmd.length < 2) {
      toast.error("Please provide a valid command name starting with /");
      return;
    }
    if (!description.trim()) {
      toast.error("Please explain what the command does");
      return;
    }

    const subject = encodeURIComponent(`SlashAI Command Suggestion: ${cleanCmd}`);
    const body = encodeURIComponent(
      `Command: ${cleanCmd}\nCategory: ${category}\nWhat it does: ${description.trim()}\n\nExample / Notes:\n${example.trim() || "N/A"}\n\nSuggested by: ${author.trim() || "Anonymous"}`
    );

    window.location.href = `mailto:wahmed178@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    toast.success("Opening your email client to send the suggestion!");
  };

  return (
    <AppShell wide hideHeaderSearch title="Suggest a Command">
      <div className="mx-auto max-w-xl pb-12">
        <header className="page-enter pt-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Sparkles className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Suggest a Command
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Have a prompt pattern that saves you hours? Share it with the SlashAI community.
          </p>
        </header>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-primary/30 bg-surface p-8 text-center">
            <span className="flex mx-auto size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Check className="size-6" />
            </span>
            <h3 className="mt-3 text-lg font-bold text-foreground">Thank you!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your email client should have opened with the pre-filled suggestion. Send it over and we'll review it for the catalogue!
            </p>
            <Button
              className="mt-5"
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setCommandName("");
                setDescription("");
                setExample("");
              }}
            >
              Suggest another command
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="cmd-name" className="block text-xs font-semibold text-foreground">
                Command Name <span className="text-primary">*</span>
              </label>
              <p className="text-[11px] text-muted-foreground">
                Start with a slash (e.g., <code>/ColdEmailPitch</code> or <code>/RegexExplainer</code>)
              </p>
              <input
                id="cmd-name"
                type="text"
                required
                value={commandName}
                onChange={(e) => setCommandName(e.target.value)}
                placeholder="/YourCommandName"
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <div>
              <label htmlFor="cmd-cat" className="block text-xs font-semibold text-foreground">
                Category <span className="text-primary">*</span>
              </label>
              <select
                id="cmd-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                {CATEGORY_META.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cmd-desc" className="block text-xs font-semibold text-foreground">
                What does it do? <span className="text-primary">*</span>
              </label>
              <p className="text-[11px] text-muted-foreground">
                A 1-2 sentence summary of what this command accomplishes.
              </p>
              <textarea
                id="cmd-desc"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Extracts key technical specs and summarizes them in a clean comparison table..."
                className="mt-1.5 w-full resize-none rounded-xl border border-border bg-surface p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <div>
              <label htmlFor="cmd-example" className="block text-xs font-semibold text-foreground">
                Example or Full Prompt <span className="text-muted-foreground">(optional)</span>
              </label>
              <p className="text-[11px] text-muted-foreground">
                Use <code>[brackets]</code> for placeholders you want users to fill in.
              </p>
              <textarea
                id="cmd-example"
                rows={4}
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="/CommandName [your topic] with constraints [word limit]..."
                className="mt-1.5 w-full resize-y rounded-xl border border-border bg-surface p-3.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <div>
              <label htmlFor="cmd-author" className="block text-xs font-semibold text-foreground">
                Your Name or Handle <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                id="cmd-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Alex or @twitter_handle"
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <Button type="submit" className="w-full gap-2 text-sm font-semibold">
              <Send className="size-4" />
              Send Command Suggestion
            </Button>
          </form>
        )}

        {/* ── Suggest a software / website, or list your store ── */}
        <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-5">
          <h2 className="text-sm font-bold text-foreground">
            Want to suggest a software or website instead?
          </h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
            Found a free tool, app or website the catalogue is missing — or you run a store
            website / storefront that should be listed? Fill the short Google Form and it goes
            straight to the review queue:
          </p>
          <div className="mt-3.5 flex flex-col gap-2 sm:flex-row">
            <a
              href={STORE_SIGNUP_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ripple-press inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-bold text-background"
            >
              <ExternalLink className="size-4" aria-hidden />
              Suggest a software / website
            </a>
            <Link
              to="/stores"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-[13px] font-bold text-foreground transition-colors hover:border-primary/40"
            >
              <Store className="size-4" aria-hidden />
              Free store for your shop
            </Link>
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-[11.5px] text-muted-foreground">
            <Globe className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Works on mobile too — the form opens in a new tab and takes about a minute.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
