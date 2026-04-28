# Automated Bilge Dumping Detection System — Setup Instructions

## 🚀 Getting Started (After GitHub Clone)

Follow these steps **in order** to get the project running locally.

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/rohith-sheregar/React-Mini-Project.git
cd React-Mini-Project
```

---

### Step 2 — Install `pnpm` (Package Manager)

This project uses **pnpm**, not npm or yarn.

```bash
npm install -g pnpm
```

> ⚠️ Do NOT use `npm install`. The project has pnpm-specific patches in the `patches/` folder that only work with pnpm.

---

### Step 3 — Install All Project Dependencies

```bash
pnpm install
```

This installs everything listed in `pnpm-lock.yaml`, including:
- React 19
- Vite 7
- Tailwind CSS v4
- Framer Motion
- Radix UI components
- Lucide React icons
- **GSAP + ScrollTrigger** (animation library for the scrollytelling feature)
- and 300+ other packages

---

### Step 4 — Install the Tailwind CSS v4 Vite Plugin

```bash
pnpm add -D @tailwindcss/vite
```

> ⚠️ This is a **required one-time step**. Tailwind CSS v4 uses its own Vite plugin instead of PostCSS. Without this, the site will load with **zero styling** (plain white page with no layout or colors).

---

### Step 4.5 — Install GSAP (Scroll Animation Library)

```bash
pnpm add gsap
```

> ⚠️ This is **required** for the cinematic scrollytelling section to work. GSAP's `ScrollTrigger` plugin powers the 1500vh frame-scrubbing animation between the Hero and Overview sections. Without it, the scroll section will be blank.

**What it powers:**
- `src/scenes/ScrollyStory.jsx` — the cinematic 3-scene scroll experience
- Frame-by-frame scrubbing of 190 JPG frames across 3 scenes (scene1, scene2, scene3)
- Text beat animations with clip-path wipe reveals
- Scene progress indicator

**Frame assets required:**

The frames are committed to Git. After cloning they will be available at:

```
public/
└── frames/
    ├── scene1/   ← frame_001.jpg to frame_190.jpg  (oil tanker at night)
    ├── scene2/   ← frame_001.jpg to frame_190.jpg  (Sentinel-1 SAR satellite)
    └── scene3/   ← frame_001.jpg to frame_190.jpg  (maritime control room)
```

> Files use **3-digit zero-padded** `.jpg` format: `frame_001.jpg`, `frame_002.jpg` … `frame_190.jpg`

---

### Step 4.6 — Install Three.js (3D Hero Loading Animation)

```bash
pnpm add three @react-three/fiber @react-three/drei
```

> ⚠️ This is **required** for the animated 3D Earth + satellite loading sequence shown on initial page load. Without it, the `ThreeLoader` component will crash and the hero section will not render.

**What it powers:**
- `src/components/ThreeLoader.tsx` — the anime-styled 3D Earth and satellite loading screen
- `@react-three/fiber` — React renderer for Three.js scenes
- `@react-three/drei` — helpers (OrbitControls, useGLTF, Stars, etc.)
- `three` — the core WebGL / 3D engine

**Versions installed:**

| Package | Version |
|---|---|
| `three` | `^0.184.0` |
| `@react-three/fiber` | `^9.6.0` |
| `@react-three/drei` | `^10.7.7` |

---

### Step 5 — Start the Development Server

```bash
pnpm run dev
```

Open your browser and visit: **http://localhost:5173**

---

## 📋 Summary Table

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `git clone ...` | Download the project |
| 2 | `npm install -g pnpm` | Install the pnpm package manager globally |
| 3 | `pnpm install` | Install all project dependencies |
| 4 | `pnpm add -D @tailwindcss/vite` | Install Tailwind v4 Vite plugin (styling) |
| 4.5 | `pnpm add gsap` | Install GSAP for scrollytelling animations |
| 4.6 | `pnpm add three @react-three/fiber @react-three/drei` | Install Three.js for the 3D hero loading screen |
| 5 | `pnpm run dev` | Start the local dev server |

---

## ⚙️ Requirements

- **Node.js** v18 or higher
- **npm** (just to install pnpm globally in Step 2)
- **Git**

---

## 🛠️ Other Useful Commands

```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Type-check the project
pnpm run check

# Format code with Prettier
pnpm run format
```

---

## 📁 Project Structure

```
React-Mini-Project/
├── src/
│   ├── components/       # Reusable UI components (Navbar, ScrollReveal, etc.)
│   ├── scenes/           # Cinematic scroll scenes
│   │   ├── ScrollyStory.jsx        # 3-scene GSAP scrollytelling component
│   │   └── ScrollyStory.module.css # Scoped styles (letterbox, grain, beats)
│   ├── sections/         # Page sections (Hero, Overview, Pipeline, Results, Team, Contact)
│   ├── pages/            # Page components (Home, NotFound)
│   ├── contexts/         # React contexts (ThemeContext)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions (cn helper)
│   ├── App.tsx           # Root application component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles (Tailwind v4 + custom tokens)
├── public/
│   └── frames/           # ⚠️ NOT in Git — add manually after clone
│       ├── scene1/       # 00001.jpg … 00192.jpg
│       ├── scene2/       # 00001.jpg … 00192.jpg
│       └── scene3/       # 00001.jpg … 00192.jpg
├── shared/               # Shared constants between frontend and server
├── server/               # Express backend (optional, for future API use)
├── index.html            # HTML entry point
├── vite.config.ts        # Vite + Tailwind plugin configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

---

## ℹ️ Notes

- The `node_modules/` folder is **not committed to Git** — always run `pnpm install` after cloning.
- Always use `pnpm` for adding/removing packages (not `npm` or `yarn`).
- The project uses **Tailwind CSS v4** which is CSS-first and does not require a `tailwind.config.js` or `postcss.config.js`.
- **GSAP** (`gsap` package) must be installed separately with `pnpm add gsap` — it is not part of the base lockfile.
- **Three.js** (`three`, `@react-three/fiber`, `@react-three/drei`) must be installed separately with `pnpm add three @react-three/fiber @react-three/drei` — required for the 3D loading screen.
- The **frame assets** (`public/frames/`) are committed to Git (190 JPGs × 3 scenes). They will be present after a normal `git clone`.
