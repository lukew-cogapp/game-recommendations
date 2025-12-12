# Agent Guidelines

This document helps AI assistants understand the codebase architecture and make informed decisions.

## Project Overview

A Next.js game discovery app using the RAWG.io API. Users can browse, filter, and search for video games.

## Critical Architecture: Hybrid Filtering

**The most important thing to understand is the filtering strategy.**

### The Problem

RAWG API uses **OR logic** for tags. If you request `tags=152,18` (Western + Co-op), you get games with Western **OR** Co-op, not both.

### The Solution

We use a hybrid approach based on what filters are active:

| User Tags | Multiplayer | API Tags | Client Filter |
|-----------|-------------|----------|---------------|
| None | None | None | None |
| None | Co-op | `18,9,411` | None |
| Western | None | `152` | None |
| Western | Co-op | `152` | Co-op tags |

**Key logic in `app/page.tsx`:**
```typescript
const needsClientSideMultiplayerFilter = Boolean(params.tags && selectedMultiplayerMode);

if (params.tags) {
  apiTags = params.tags;  // User tags only
} else if (selectedMultiplayerMode) {
  apiTags = MULTIPLAYER_TAGS[selectedMultiplayerMode].join(",");  // Multiplayer tags to API
}
```

**Client-side filtering in `GameGridWithLoadMore.tsx`:**
- Filters games to require at least one multiplayer tag
- Uses larger page sizes (100 vs 20) to compensate
- Auto-fetches up to 5 pages if filtered results < 8

## Key Files

- `app/page.tsx` - Server component, determines API vs client filtering
- `components/GameGridWithLoadMore.tsx` - Client component, handles pagination and filtering
- `lib/constants.ts` - Tag IDs, multiplayer definitions, filter presets
- `hooks/useFilters.ts` - URL-based filter state management

## Common Tasks

### Adding a New Tag Preset

Edit `lib/constants.ts` → `TAG_PRESETS`:
```typescript
{ ids: "123,456", label: "My Tag", category: "Genre" }
```

Look up tag IDs via RAWG API: `https://api.rawg.io/api/tags?search=tagname`

### Adding a New Multiplayer Mode

Edit `lib/constants.ts` → `MULTIPLAYER_TAGS`:
```typescript
export const MULTIPLAYER_TAGS = {
  singleplayer: [31],
  coop: [18, 9, 411],
  local: [72, 75, 198],
  newmode: [tagId1, tagId2],  // Add here
} as const;
```

Then update `components/MultiplayerFilter.tsx` to add the UI option.

## Testing API Queries

Use the helper script pattern:
```bash
node -e '
require("dotenv").config({ path: ".env.local" });
const API_KEY = process.env.RAWG_API_KEY;
fetch(`https://api.rawg.io/api/games?key=${API_KEY}&tags=123&page_size=5`)
  .then(r => r.json())
  .then(d => console.log(d.results.map(g => g.slug)));
'
```

## Gotchas

1. **Default ordering is `-metacritic`** - Auto-adds `metacritic=1,100` filter to avoid nulls
2. **NSFW content** - Images are blurred client-side based on `NSFW_TAG_IDS`
3. **Pagination limit** - RAWG caps at 500 pages
4. **Tag search discrepancy** - List endpoint tags may differ from detail endpoint
