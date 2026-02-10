# Will You Be My Valentine? 💖

A playful, animated, mobile-first Valentine's proposal microsite.

## Quick Start

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

The output will be in `dist/` — deploy to Vercel, Netlify, or any static host.

## How to Customise

All editable content lives in **`src/config.ts`**. Open it and change:

| Field                  | What it does                                           |
| ---------------------- | ------------------------------------------------------ |
| `herName`              | Her name (shown in hero title)                         |
| `yourName`             | Your name (shown in footer)                            |
| `introLine`            | Subtitle on the hero section                           |
| `loveNote`             | Message on the back of the timeline flip card          |
| `dates.officialDate`   | "Our official day" date (DD/MM/YYYY)                   |
| `dates.valentinesDate` | Valentine's Day date (DD/MM/YYYY)                      |
| `reasons14`            | Array of 14 reason strings for the card section        |
| `successMessage`       | Message shown after they click "Yes"                   |
| `shareMessageTemplate` | Clipboard text when sharing (`{url}` = current URL)    |

## Tech Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- No backend, no paid APIs

## Features

- Floating hearts background
- Timeline flip card with countdown
- 14 interactive reason cards (with cheeky blur on #7)
- "Catch the Hearts" mini game
- Playfully dodging "No" button
- Heart confetti celebration
- Downloadable Valentine Ticket (canvas-generated)
- Share button (clipboard)
- `prefers-reduced-motion` support
- Mobile-first responsive design
