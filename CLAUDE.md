# Claude Instructions

## Project Overview

This is a Next.js game discovery app using the RAWG.io API. It helps users find video games based on various filters like genre, platform, tags, and Metacritic scores.

## Key Technical Details

- **Framework**: Next.js 16 with App Router (React 19)
- **Styling**: Tailwind CSS 4 with CSS variables in `app/globals.css`
- **Linting**: Biome (not ESLint)
- **Types**: TypeScript with interfaces in `types/game.ts`

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run Biome linter
npm run typecheck  # Run TypeScript checks
```

## Architecture Notes

### API Client (`lib/rawg.ts`)

- Server-side only (uses `RAWG_API_KEY` env var)
- All fetches use 24-hour cache revalidation
- Constants extracted to `lib/constants.ts`

### Tag System

Tags use combined IDs to handle RAWG's folksonomy. For example, "Co-op" combines tag IDs `18,9,411` (co-op, online-co-op, cooperative). See `TAG_PRESETS` in `lib/constants.ts`.

### Store Links

The RAWG `/games/{slug}/stores` endpoint returns `store_id`, not full store objects. The `STORE_INFO` map in `lib/constants.ts` provides the mapping.

### NSFW Handling

Games with tags `312`, `786`, `785`, `1402` (NSFW, hentai, erotic, porn) have images lightly blurred in `GameCard.tsx`. General mature/nudity/sexual-content/adult tags are excluded to avoid blurring games like The Witcher 3, Persona 5, or Genesis Noir.

### Pagination

RAWG API returns 404 for pages beyond ~10k results. Pagination is capped at 500 pages in `app/page.tsx`.

## Color Theme

Western/tabletop style defined in `app/globals.css`:
- Background: `#1a1510` (dark sepia)
- Foreground: `#e8dcc8` (parchment)
- Card: `#2d251d`
- Gold: `#c9a059` (primary accent)
- Border: `#5c4a3a`
- Muted: `#a89a88`

## Known Limitations

- RAWG free tier: 20,000 requests/month
- `/games/{slug}/suggested` endpoint returns 401 on free tier
- Trailers/clips not reliably available (most games return null)
- Steam Deck tag not well-populated in RAWG
