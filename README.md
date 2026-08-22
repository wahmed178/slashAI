# SlashAI

Build a production-quality responsive web app called **SlashAI**. The purpose is a searchable library of 1,000+ AI slash commands such as /HandwrittenNotesImage, /Explode, /Scan, /100xUpscale. It must be designed from the beginning to be PWA-ready and mobile-first, with clean component architecture and an app-shell suitable for later installation as a PWA.

Core requirement: create a curated catalog of at least 1,000 unique slash commands. Each command needs: command name (starting with /), short description of what it does, detailed 'How to use' example, category, subcategory, tags, and whether it is primarily for image, text, document, data, coding, research, productivity, audio/video, business, learning, or general AI. Commands should be genuinely useful, not random filler. Include broad categories such as Image & Vision, Documents & OCR, Writing, Research, Analysis, Data, Coding, Productivity, Business, Quality & Performance, Learning, Audio, Video, Marketing, Design, Automation, Security/Privacy-safe utilities, Translation, Math/Science, Career, and General AI. Include commands ranging from simple utilities to advanced workflows. Generate at least 1,000 records and make the architecture easy to extend.

UI/UX: make it feel like a polished modern AI command dashboard, not a plain table. Desktop layout: left sidebar with logo/name, categories, favorites, recently used, and settings; main area with prominent global search, command count, quick filters, category chips, sort controls, and a responsive command-card grid/list. Mobile: bottom navigation or compact drawer, large search, touch-friendly cards. Use a dark-first premium interface with an optional light theme. Add keyboard-friendly navigation.

Search/dashboard requirements: instant fuzzy search across command name, description, how-to-use text, category, subcategory and tags; search suggestions; highlighted matches; category filtering; type filtering; favorites; recently used; sort by relevance/name/category/popularity/newest; pagination or virtualized rendering so 1,000+ commands remains fast. Add a command detail view/modal with copy button, example, explanation, related commands, tags, favorite toggle and 'Use command' action. Clicking Use command should copy a ready-to-edit template to clipboard and record recent usage.

Add: Favorites, Recently Used, Copy Command, Copy Full Prompt, Share-friendly command detail URL/state if practical, random command, daily command, category explorer, command count by category, empty states, loading states, keyboard shortcut hints, and a settings panel for theme and compact/comfortable density. Persist favorites, recents, theme, and settings locally so the app works without login.

PWA readiness: include web app manifest metadata, app icons placeholders, install-friendly viewport/meta tags, service-worker-ready architecture and offline-first handling for the static command catalog. If the environment supports a service worker safely, implement it; otherwise structure the app so one can be added later without refactoring. The app should work well on Android Chrome and desktop browsers.

Data architecture: keep the command catalog in a structured local data module or JSON so it can later be moved to a database/API. Include a command schema with id, command, title, description, usage, example, category, subcategory, tags, type, difficulty, featured, and aliases. Avoid duplicate commands. Add a small set of featured commands for the dashboard.

Visual details: polished typography, subtle borders, good spacing, responsive cards, command badges, category icons, accessible contrast, smooth but restrained transitions. Do not overuse gradients or animations. Make the search the primary interaction.

Important: do not merely create a mockup with 20 commands. Populate the actual catalog with 1,000+ useful command records and make search/filtering operate on the full catalog. Ensure there are no obvious duplicates and that every record has useful descriptions and usage examples. Include a README or internal notes describing how to add more commands later. Test the UI and fix obvious errors before finishing.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://slashprompt.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7a5be5ac-220c-4f10-9f55-0a591e7f0b40).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
