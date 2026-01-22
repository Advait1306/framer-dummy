# Framer Components Development Environment

## Project Purpose

This is a React development environment for building and previewing components that are **directly compatible with Framer**. Components built here can be copied and pasted into Framer's code component editor.

## How to Use

1. Run `npm run dev` to start the development server
2. Create components in `src/components/`
3. Add them to the showcase in `src/App.tsx`
4. Preview and test components locally
5. Export to Framer using `npm run export`

## Exporting to Framer

Use the export script to generate Framer-ready code:

```bash
npm run export src/components/YourComponent.tsx
```

This creates `export/YourComponent.txt` which you can paste directly into Framer.

**What the export script does:**
- Removes local asset imports (`../assets/...`)
- Removes default values referencing local imports (e.g., `= localVideo`)
- Adds Framer imports (`addPropertyControls`, `ControlType`)
- Auto-generates property controls from the props interface

## Component Structure for Export Compatibility

When creating components, follow this pattern so they work in both local dev and Framer:

```tsx
import { motion } from "motion/react"

// Local dev assets - prefix with "local" so export script removes them
import localImage from "../assets/my-image.png"
import localVideo from "../assets/my-video.mp4"

interface MyComponentProps {
  imageSrc?: string
  videoSrc?: string
  scale?: number
  variant?: "primary" | "secondary"
}

export function MyComponent({
  imageSrc = localImage,  // Default to local asset for dev
  videoSrc = localVideo,
  scale = 1,
  variant = "primary",
}: MyComponentProps) {
  // Component code...
}
```

**Key rules:**
- Prefix local asset imports with `local` (e.g., `localVideo`, `localFrame`)
- Use these as default values in props
- The export script strips these for Framer

## Prop Type to Framer Control Mappings

The export script auto-maps props to Framer controls:

| Prop name contains | Type | Framer Control |
|-------------------|------|----------------|
| `video` | any | `ControlType.File` (mp4, webm, mov) |
| `image`, `frame`, `src` | any | `ControlType.Image` |
| `color` | any | `ControlType.Color` |
| - | `number` | `ControlType.Number` |
| - | `boolean` | `ControlType.Boolean` |
| - | `"a" \| "b"` | `ControlType.Enum` |
| - | `string` | `ControlType.String` |

## Framer Compatibility Rules

**CRITICAL: All components must follow these rules to work in Framer:**

### 1. Inline Styles Only
- Use `style={{}}` props or style objects
- **NO external CSS files** (no `.css` imports)
- **NO CSS modules**
- **NO Tailwind** or other CSS frameworks

### 2. Allowed Libraries
Only use libraries available in Framer:
- `motion/react` (from motion.dev) - for animations
- `react` and `react-dom` - core React
- Standard Web APIs

### 3. Self-Contained Components
- Each component must be in a single file
- All styles must be defined within the component file
- No imports from other local files (except React and allowed libraries)

### 4. Animation Guidelines
Use `motion` from `motion/react` for animations:
```tsx
import { motion } from "motion/react"

<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## File Structure

```
├── src/
│   ├── components/       # Framer-compatible components
│   │   ├── iPhoneVideoCard.tsx
│   │   └── IPhoneVideoGallery.tsx
│   ├── assets/           # Local dev assets (not exported)
│   ├── App.tsx           # Component list (not for Framer)
│   └── main.tsx          # Entry point (not for Framer)
├── export/               # Generated Framer-ready files (.gitignored)
└── scripts/
    └── export-to-framer.cjs
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run export <file>` - Export component for Framer

## Claude Instructions

- **NEVER run the dev server** (`npm run dev`) - the user will run it themselves
- When creating new components, use the `local*` prefix pattern for dev assets
- Always define props interface so export script can generate controls
- Test export with `npm run export` before considering component complete
