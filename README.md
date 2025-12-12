# Game Discovery

A Next.js app for discovering and exploring video games using the RAWG.io API. Features a western/tabletop-inspired color scheme.

## Features

- **Browse Games** - Discover games with filters for platform, genre, tags, Metacritic score, and release date
- **Search** - Find games by title
- **Game Details** - View detailed information including description, screenshots, ratings, and store links
- **"I'm Feeling Lucky"** - Get a random game recommendation based on current filters
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

## Project Structure

```
app/
  page.tsx              # Home page with game grid and filters
  game/[slug]/          # Game detail pages
  api/lucky/            # Random game API endpoint
components/
  GameCard.tsx          # Game card component
  GameGrid.tsx          # Grid layout for games
  Filters.tsx           # Filter dropdowns and badges
  TagPicker.tsx         # Multi-select tag picker
  SearchBar.tsx         # Search input
  LuckyButton.tsx       # "I'm Feeling Lucky" button
  Badge.tsx             # Platform, Metacritic, and status badges
hooks/
  useFilters.ts         # Filter state management
lib/
  rawg.ts               # RAWG API client
  constants.ts          # App constants (tags, platforms, stores)
types/
  game.ts               # TypeScript interfaces
```

## API Limits

The RAWG free tier allows 20,000 requests/month. The app uses server-side caching (1 hour revalidation) to minimize API calls.

Pagination is capped at 500 pages to avoid RAWG API errors on deep pagination.
