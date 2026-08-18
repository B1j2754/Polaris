# A dev talks to himself as he builds

## 1. Setting up the repo

Following steps and thought process:

- `pnpm create expo-app@latest ../polaris` -- This is for the main expo app setup
- `pnpm install expo-secure-store` -- This is for secure persistent storage
- `pnpm install tailwind-variants` -- This is for easy variant management for tailwind styling
- Deleted the auto generated fluff. Ready to code ig?

## 2. File Structure

Decided to devote a dev-talk section to this, since this seems much more important than in other languages like python or java or cpp that I've used.

---

- Expo seems to route paths through their files. So `app/pages/home` is just the route `/pages/home`.
- Looking at the docs, a `_layout.tsx` file needs to be at the root of every dir and subdir. It gathers together all the roots above it and decided how and where they go.
  [Update]:
  It seems like this has to do with mounting. So it acts as a checkpoint for things. If we want to return to a navigation page, we would go back to the latest `_layout.tsx`
- Wrapping something with parens, `(home)` for example, hides it from the route, but exists in the filesystem. Organization only I suppose.
- I don't understand this one as well, but wrapping something in brackets, like `[server]` means its a 'dynamic' section. Not sure how this works. It seems reusable? But then again, isn't that what all components are supposed to be? Idk.
  [Update]:
  It appears as if it is a reusable page. Dynamic gen. So like a function that takes a parameter.

---
