import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/assistant/about")({
  head: () => ({
    meta: [
      { title: "How SlashAI Assistant Works" },
      { name: "description", content: "Learn how the local AI assistant works in your browser." },
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
            SlashAI Assistant runs an AI model directly inside your web browser using your device's GPU.
            Unlike ChatGPT or Claude, nothing you type is ever sent to any server.
            Your conversations are 100% private and stored only on your device.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">The first download</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The first time you use it, the AI model downloads from{" "}
            <a href="https://huggingface.co" target="_blank" rel="noreferrer" className="text-primary hover:underline">Hugging Face</a>{" "}
            (a free, open AI platform). The Fast Model is about 760MB — similar to a medium-sized app install.
            This happens once. After that, it loads from your device in seconds, even offline.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Which browser?</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Works best on: <strong className="text-foreground">Google Chrome, Microsoft Edge, Brave</strong>.
            These browsers support WebGPU — the technology that makes local AI fast.
            Firefox and Safari have limited support and may be slower.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Which model should I pick?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 pr-4 text-left text-muted-foreground">Model</th>
                  <th className="pb-2 pr-4 text-left text-muted-foreground">Size</th>
                  <th className="pb-2 pr-4 text-left text-muted-foreground">Speed</th>
                  <th className="pb-2 pr-4 text-left text-muted-foreground">Quality</th>
                  <th className="pb-2 text-left text-muted-foreground">Good for</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">Fast</td>
                  <td className="py-2 pr-4 text-muted-foreground">760MB</td>
                  <td className="py-2 pr-4">⚡⚡⚡</td>
                  <td className="py-2 pr-4">⭐⭐</td>
                  <td className="py-2 text-muted-foreground">Quick chat, simple tasks</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">Balanced</td>
                  <td className="py-2 pr-4 text-muted-foreground">1.8GB</td>
                  <td className="py-2 pr-4">⚡⚡</td>
                  <td className="py-2 pr-4">⭐⭐⭐</td>
                  <td className="py-2 text-muted-foreground">Writing, analysis</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Quality</td>
                  <td className="py-2 pr-4 text-muted-foreground">4.9GB</td>
                  <td className="py-2 pr-4">⚡</td>
                  <td className="py-2 pr-4">⭐⭐⭐⭐</td>
                  <td className="py-2 text-muted-foreground">Complex reasoning</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">Start with Fast. You can switch later.</p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Uploading documents</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You can upload PDF, Word (DOCX), or text files. The Assistant reads the content and you can ask
            questions about it. Files are never uploaded anywhere — they're read entirely within your browser.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Privacy promise</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Zero telemetry. Zero tracking. No account. Your messages exist only on your device.
            Clearing your browser cache removes everything.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Troubleshooting</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Model won't load</p>
              <p>Try Chrome instead of Firefox. Enable hardware acceleration in browser settings.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Very slow</p>
              <p>Use the Fast model. Close other tabs to free up GPU memory.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Download stops</p>
              <p>Refresh and try again — the download resumes from cache.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Black screen</p>
              <p>Enable hardware acceleration: Chrome → Settings → System → Use hardware acceleration.</p>
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
