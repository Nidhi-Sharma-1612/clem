<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Historic George Hotel

Boutique suites in a 1930s building in downtown Klamath Falls, OR. Redesign of historicgeorgehotel.com.

- Phase 1 (this code): layout, design, animations. Suite data is a static snapshot in `lib/data/suites.json`, pulled from the Hostaway booking engine (account 124190, listing IDs = `id`).
- Phase 2: swap `lib/suites.ts` to read from the Hostaway (PMS) API, add live availability/pricing to `BookingCard` and `SearchBar`, add payments.
- Theme: black and white with a brass accent (`--color-brass-*` in `app/globals.css`). Fonts: Bodoni Moda (display) + Manrope (body).
