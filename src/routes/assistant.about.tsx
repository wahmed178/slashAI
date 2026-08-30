import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/assistant/about")({
  head: () => ({
    meta: [
      { title: "How SlashAI Assistant Works" },
      { name: "description", content: "Learn how the SlashAI assistant works with free AI providers." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell wide title="About Assistant">
      <div className="mx-auto max-w-2xl py-6">
        <Link to="/assistant" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Assistant
        </Link>

        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">How SlashAI Assistant works</h1>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">What is it?</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            SlashAI Assistant connects to free AI providers like Google AI Studio, Groq, OpenRouter, and Together AI.
            You bring your own API key — it stays stored only in your browser and is never sent to any server except the AI provider you choose.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Free providers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 pr-4 text-left text-muted-foreground">Provider</th>
                  <th className="pb-2 pr-4 text-left text-muted-foreground">Free tier</th>
                  <th className="pb-2 pr-4 text-left text-muted-foreground">Speed</th>
                  <th className="pb-2 text-left text-muted-foreground">Get key</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">🟢 Google AI Studio</td>
                  <td className="py-2 pr-4 text-green">Generous</td>
                  <td className="py-2 pr-4">Fast</td>
                  <td className="py-2"><a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline">Get key</a></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">⚡ Groq</td>
                  <td className="py-2 pr-4 text-green">Generous</td>
                  <td className="py-2 pr-4">Very fast</td>
                  <td className="py-2"><a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">Get key</a></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">🔀 OpenRouter</td>
                  <td className="py-2 pr-4 text-green">Some free models</td>
                  <td className="py-2 pr-4">Varies</td>
                  <td className="py-2"><a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">Get key</a></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">🤝 Together AI</td>
                  <td className="py-2 pr-4 text-green">Free credits</td>
                  <td className="py-2 pr-4">Fast</td>
                  <td className="py-2"><a href="https://api.together.xyz/settings/api-keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">Get key</a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            All providers offer free tiers. Start with Google AI Studio or Groq — they're the most generous.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your API key</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your API key is stored in your browser's localStorage. It is only sent directly to the AI provider you choose.
            SlashAI never sees, stores, or transmits your key. Clearing your browser data removes it.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Uploading documents</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You can upload PDF, Word (DOCX), or text files. The Assistant reads the content and you can ask
            questions about it. Files are read entirely within your browser — never uploaded anywhere.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Privacy promise</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Zero telemetry. Zero tracking. No account. Your messages go only to the AI provider you configured.
            Your API key stays in your browser. Clearing cache removes everything.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Troubleshooting</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">"Unauthorized" or "Invalid API key"</p>
              <p>Double-check your API key. Make sure it's active and has free tier credits.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">"Rate limited"</p>
              <p>You've hit the free tier limit. Wait a minute or switch to another provider.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">"Model not found"</p>
              <p>The model ID may have changed. Try selecting a different model from the dropdown.</p>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <Link
            to="/assistant"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Back to Assistant →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
