# Repository Guidelines

## Project Structure & Module Organization
The application lives in `src/`, with `main.tsx` bootstrapping React and `App.tsx` hosting the Blockly workspace. Custom block definitions and code generation sit in `src/blockly/blocks.ts` and `src/blockly/generator.ts`. Shared styles are in `App.css` and `index.css`, while static assets (logos, icons) go into `src/assets/`. The production build outputs to `dist/`; Vite entry HTML and static public assets reside in `index.html` and `public/`. Tooling configuration lives at the repo root (`vite.config.ts`, `eslint.config.js`, `tsconfig.*`).

## Build, Test, and Development Commands
Run `npm install` once per environment to sync dependencies. Use `npm run dev` for the Vite dev server with fast HMR. `npm run build` performs a TypeScript project build (`tsc -b`) and emits optimized assets via Vite. `npm run preview` serves the production bundle locally for smoke tests. `npm run lint` runs ESLint across the codebase.

## Coding Style & Naming Conventions
Follow the TypeScript + React defaults enforced by ESLint. Keep two-space indentation, single quotes, and trailing commas where ESLint expects them. Name React components with `PascalCase`, hooks with a `use` prefix, and helper utilities with `camelCase`. Place new Blockly definitions alongside peers in `src/blockly`, using clear block IDs like `probot_<action>` to maintain generator parity.

## Testing Guidelines
Automated tests are not yet set up; when contributing, provide manual verification notes in the PR (e.g., “generated C++ for drive block”). If you introduce tests, colocate them under `src/__tests__` using `*.test.ts(x)` and ensure they can run through a future `npm test` Vitest script. Avoid merging changes that lack coverage for new logic-heavy generators.

## Commit & Pull Request Guidelines
Match the existing Conventional Commits style (`feat:`, `fix:`, `docs:`). Keep messages imperative and scoped to a single change. PRs should include a concise summary, linked issues, screenshots or GIFs of UI changes, and any follow-up tasks. Re-run `npm run lint` before requesting review and confirm the app builds (`npm run build`).

## Environment & Tooling Tips
Use Node 18+ so Vite 7 and TypeScript features work reliably. Enable ESLint in your editor to catch violations as you work, and prefer the TypeScript React plugin for JSX. When tweaking Blockly locales or theming, update both `src/blockly/*.ts` and matching styles in `App.css` to keep the toolbox consistent.
