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
- and 300+ other packages

---

### Step 4 — Install the Tailwind CSS v4 Vite Plugin

```bash
pnpm add -D @tailwindcss/vite
```

> ⚠️ This is a **required one-time step**. Tailwind CSS v4 uses its own Vite plugin instead of PostCSS. Without this, the site will load with **zero styling** (plain white page with no layout or colors).

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
│   ├── sections/         # Page sections (Hero, Overview, Pipeline, Results, Team, Contact)
│   ├── pages/            # Page components (Home, NotFound)
│   ├── contexts/         # React contexts (ThemeContext)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions (cn helper)
│   ├── App.tsx           # Root application component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles (Tailwind v4 + custom tokens)
├── shared/               # Shared constants between frontend and server
├── server/               # Express backend (optional, for future API use)
├── public/               # Static assets
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
