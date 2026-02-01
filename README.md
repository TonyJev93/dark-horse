# Dark Horse 🏇

A strategic horse racing board game for 2-6 players, built as a web application.

## About

Dark Horse is a horse racing game where players bet on horses and use action cards to influence the race outcome. Players must strategically manage their cards to get their horses to the highest ranks while trying to sabotage their opponents.

## Tech Stack

- **Framework:** Next.js 15.1.6
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Platform:** Web (Browser)
- **Mode:** Local multiplayer (2-6 players on same screen)

## Project Structure

```
dark-horse/
├── src/
│   ├── types/          # TypeScript type definitions
│   ├── game/           # Core game logic (pure functions)
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── app/            # Next.js app directory
├── docs/               # Game rules and documentation
└── .agents/            # Development tasks and guidelines
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Game Rules

See detailed game rules in:
- [`docs/GAME_RULES.md`](docs/GAME_RULES.md) - Complete game rules
- [`docs/QUICK_REFERENCE.md`](docs/QUICK_REFERENCE.md) - Quick reference guide

## Development

### Current Status

**Phase 1: ✅ Completed** - Project setup and type definitions  
**Phase 2: 🚧 In Progress** - Core game logic implementation  
**Phase 3: 📋 Planned** - UI implementation  
**Phase 4: 📋 Planned** - Game flow and state management

See [`.agents/tasks/dark-horse-web-implementation.md`](.agents/tasks/dark-horse-web-implementation.md) for detailed implementation tasks.

## License

Private project
