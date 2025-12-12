# Game Discovery

A Next.js app for discovering and exploring video games using the RAWG.io API.

## Features

- **Browse Games** - Discover games with filters for platform, genre, tags, Metacritic score, and release date
- **Multiplayer Filter** - Filter by Singleplayer, Co-op, or Local Multiplayer
- **Search** - Find games by title
- **Game Details** - View detailed information including description, screenshots, ratings, and store links
- **"I'm Feeling Lucky"** - Get a random game recommendation based on current filters
- **Load More Pagination** - Seamlessly load more results with auto-fetch when filtered results are low
- **NSFW Filtering** - Mature content images are automatically blurred
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Linting/Formatting**: Biome
- **API**: RAWG.io

## Getting Started

### Prerequisites

- Node.js 24+ (use `nvm use` to switch)
- RAWG API key (free at https://rawg.io/apidocs)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```
RAWG_API_KEY=your_api_key_here
```

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run Biome linter
- `npm run typecheck` - Run TypeScript type checking

## Architecture

### Filtering Strategy

The app uses a hybrid server-side and client-side filtering approach due to RAWG API limitations:

**RAWG API Limitation**: When multiple tags are passed (e.g., `tags=152,18`), RAWG uses OR logic, returning games with ANY of those tags rather than ALL of them.

**Our Solution**:

1. **Multiplayer-only queries** (no user tags selected):
   - Multiplayer tags are passed directly to the API
   - Results are properly sorted (e.g., "top-rated co-op games")
   - No client-side filtering needed

2. **User tags + Multiplayer** (both selected):
   - Only user-selected tags are sent to the API
   - Multiplayer filtering happens client-side
   - Larger page sizes (100 vs 20) compensate for filtering losses
   - Auto-fetches more pages if filtered results < 8 games

This ensures that when filtering for "Western Co-op games", users get games that are BOTH Western AND Co-op, not Western OR Co-op.

### Key Files

```
app/
  page.tsx                    # Home page - determines API vs client filtering
  api/games/route.ts          # API route for client-side pagination
  game/[slug]/                # Game detail pages
components/
  GameCard.tsx                # Game card with rating, metacritic, date
  GameGrid.tsx                # Simple grid layout
  GameGridWithLoadMore.tsx    # Grid with pagination and client-side filtering
  Filters.tsx                 # Filter dropdowns and badges
  MultiplayerFilter.tsx       # Singleplayer/Co-op/Local filter
  TagPicker.tsx               # Multi-select tag picker
  SearchBar.tsx               # Search input
  LuckyButton.tsx             # Random game button
hooks/
  useFilters.ts               # URL-based filter state management
lib/
  rawg.ts                     # RAWG API client
  constants.ts                # Tags, platforms, multiplayer definitions
types/
  game.ts                     # TypeScript interfaces
```

## API Limits

The RAWG free tier allows 20,000 requests/month. The app uses server-side caching (1 hour revalidation) to minimize API calls.

Pagination is capped at 500 pages to avoid RAWG API errors on deep pagination.
