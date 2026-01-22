# Framer Components Dev Environment

A local development environment for building React components that are directly compatible with [Framer](https://framer.com). Build, preview, and test your components locally, then export them to Framer with auto-generated property controls.

## Why?

Framer's code editor is great, but developing complex components directly in it can be limiting. This environment gives you:

- **Local development** with hot reload and proper IDE support
- **Asset support** for testing with local images/videos
- **Automatic export** that strips local assets and generates Framer property controls
- **Type safety** with TypeScript

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` to preview your components.

## Creating Components

1. Create your component in `src/components/`
2. Use the `local*` prefix for dev assets:

```tsx
import localVideo from "../assets/my-video.mp4"

interface MyComponentProps {
  videoSrc?: string
  scale?: number
}

export function MyComponent({
  videoSrc = localVideo,
  scale = 1,
}: MyComponentProps) {
  // Your component...
}
```

3. Add to `src/App.tsx` to preview locally

## Exporting to Framer

```bash
npm run export src/components/MyComponent.tsx
```

This generates `export/MyComponent.txt` ready to paste into Framer. The export script:

- Removes local asset imports
- Removes default values referencing local assets
- Adds `addPropertyControls` with auto-detected control types
- Outputs clean, Framer-ready code

## Framer Compatibility Rules

Components must follow these rules to work in Framer:

- **Inline styles only** - no CSS files, CSS modules, or Tailwind
- **Allowed imports**: `motion/react`, `react`, `framer`
- **Self-contained** - single file, no local imports (except assets for dev)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run export <file>` | Export component for Framer |
| `npm run build` | Build for production |

## Project Structure

```
├── src/
│   ├── components/    # Your Framer components
│   ├── assets/        # Local dev assets
│   ├── App.tsx        # Component preview list
│   └── main.tsx       # Entry point
├── export/            # Generated Framer exports (.gitignored)
└── scripts/
    └── export-to-framer.cjs
```

## License

MIT
