# UniMate - VS Code Setup Guide

Complete guide to move your UniMate web application from Figma Make to VS Code and run it locally.

---

## 📋 Prerequisites

Before starting, ensure you have these installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **Git** (optional but recommended) - [Download here](https://git-scm.com/)

Verify installations:
```bash
node --version
npm --version
```

---

## 🚀 Quick Start

### Step 1: Create New Project

Open your terminal and run:

```bash
# Create a new Vite project with React and TypeScript
npm create vite@latest unimate -- --template react-ts

# Navigate into the project
cd unimate
```

### Step 2: Install All Dependencies

Copy and paste this entire command:

```bash
npm install tailwindcss@next @tailwindcss/vite@next class-variance-authority clsx tailwind-merge @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-tabs lucide-react recharts sonner@2.0.3 react-hook-form@7.55.0
```

---

## ⚙️ Configuration Files

### 1. Update `vite.config.ts`

Replace the entire content with:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 2. Update `tsconfig.json`

Add the `baseUrl` and `paths` to the `compilerOptions`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. Update `tsconfig.node.json`

Add `skipLibCheck`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

---

## 📁 File Structure Setup

### Create This Folder Structure

In your `src` folder, create:

```
src/
├── App.tsx
├── main.tsx
├── components/
│   ├── AIChatbot.tsx
│   ├── CoursesPage.tsx
│   ├── DashboardPage.tsx
│   ├── HomePage.tsx
│   ├── LearnMorePage.tsx
│   ├── LoginRegister.tsx
│   ├── Navbar.tsx
│   ├── ProfilePage.tsx
│   ├── QuestionnaireModal.tsx
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   └── ui/
│       └── (all UI components)
└── styles/
    └── globals.css
```

### Commands to Create Folders

```bash
# Navigate to src folder
cd src

# Create folder structure
mkdir -p components/figma components/ui styles
```

---

## 📝 Copy Your Files

### 1. Update `src/main.tsx`

Replace the content with:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### 2. Copy All Project Files

**From Figma Make → To VS Code:**

| Source | Destination |
|--------|-------------|
| `App.tsx` | `src/App.tsx` |
| `styles/globals.css` | `src/styles/globals.css` |
| `components/*.tsx` | `src/components/*.tsx` |
| `components/ui/*.tsx` | `src/components/ui/*.tsx` |
| `components/figma/*.tsx` | `src/components/figma/*.tsx` |

### 3. Delete Unnecessary Files

Delete these files from the `src` folder if they exist:
- `src/App.css`
- `src/index.css`

---

## 🔧 Important File Updates

### Update Import Paths in All Components

You have two options for imports:

**Option A: Keep Current Imports (Relative Paths)**
```typescript
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
```

**Option B: Use Alias Imports (Recommended)**
```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

If you choose Option B, update imports in these files:
- `src/App.tsx`
- All files in `src/components/`

### ImageWithFallback Component

Your `src/components/figma/ImageWithFallback.tsx` should be:

```typescript
interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function ImageWithFallback({ src, alt, ...props }: ImageWithFallbackProps) {
  return <img src={src} alt={alt} {...props} />;
}
```

---

## ▶️ Run Your Project

### Development Server

```bash
npm run dev
```

Your app will be available at: **http://localhost:5173**

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🎨 Your Current Color Theme

Your UniMate app uses these colors:

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary | `#2563EB` | Buttons, links, primary actions |
| Accent | `#38BDF8` | Highlights, secondary actions |
| Background | `#F9FAFB` | Page background |
| Foreground | `#1F2937` | Text color |
| Card | `#FFFFFF` | Card backgrounds |

These are already configured in your `globals.css` file.

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Issue: Tailwind styles not working

**Solution:**
1. Check that `globals.css` is imported in `main.tsx`
2. Verify `@tailwindcss/vite` is in your `vite.config.ts`
3. Restart the dev server

### Issue: TypeScript errors with paths

**Solution:**
1. Ensure `tsconfig.json` has the `paths` configuration
2. Restart VS Code or the TypeScript server
3. Run: `Ctrl/Cmd + Shift + P` → "TypeScript: Restart TS Server"

### Issue: Components not rendering

**Solution:**
1. Check browser console for errors
2. Verify all imports are correct
3. Make sure all required components exist in `src/components/ui/`

### Issue: Recharts errors

**Solution:**
```bash
npm install recharts --legacy-peer-deps
```

---

## 📦 Complete Dependencies List

Here's what gets installed:

### Core
- `react`, `react-dom` - React framework
- `typescript` - TypeScript support
- `vite` - Build tool

### Styling
- `tailwindcss@next` - Tailwind CSS v4
- `@tailwindcss/vite@next` - Vite plugin for Tailwind
- `class-variance-authority` - CVA for component variants
- `clsx` - Utility for conditional classes
- `tailwind-merge` - Merge Tailwind classes

### UI Components (Radix UI)
- `@radix-ui/react-avatar` - Avatar component
- `@radix-ui/react-dialog` - Modal dialogs
- `@radix-ui/react-dropdown-menu` - Dropdown menus
- `@radix-ui/react-label` - Form labels
- `@radix-ui/react-popover` - Popovers
- `@radix-ui/react-progress` - Progress bars
- `@radix-ui/react-scroll-area` - Scroll areas
- `@radix-ui/react-select` - Select dropdowns
- `@radix-ui/react-separator` - Separators
- `@radix-ui/react-slider` - Sliders
- `@radix-ui/react-slot` - Slot utility
- `@radix-ui/react-tabs` - Tabs component

### Additional Libraries
- `lucide-react` - Icon library
- `recharts` - Chart library
- `sonner@2.0.3` - Toast notifications
- `react-hook-form@7.55.0` - Form handling

---

## 🎯 Next Steps

After setup:

1. ✅ Run `npm run dev` to start development
2. ✅ Open http://localhost:5173 in your browser
3. ✅ Test all pages and features
4. ✅ Make any customizations you need
5. ✅ Consider adding a backend with Supabase (see below)

---

## 🗄️ Optional: Add Supabase Backend

To add real database functionality:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Install Supabase client:
```bash
npm install @supabase/supabase-js
```

3. Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

4. Add environment variables to `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📚 Useful Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm install <package>` | Install new package |
| `npm update` | Update packages |
| `npm run lint` | Run linter (if configured) |

---

## 💡 Tips

1. **Use VS Code Extensions:**
   - ESLint
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin (Volar)
   - Prettier - Code formatter

2. **Hot Module Replacement:**
   - Vite provides instant updates when you save files
   - No need to manually refresh the browser

3. **TypeScript:**
   - Your project uses TypeScript for type safety
   - Check the Problems panel in VS Code for errors

4. **Git Integration:**
   - Initialize git: `git init`
   - Create `.gitignore` (Vite creates one automatically)
   - Commit your work regularly

---

## 🆘 Need Help?

Common resources:
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

---

## ✅ Checklist

Before running your app, make sure:

- [ ] Node.js is installed
- [ ] Project created with Vite
- [ ] All dependencies installed
- [ ] `vite.config.ts` updated
- [ ] `tsconfig.json` updated
- [ ] All files copied to `src` folder
- [ ] `main.tsx` imports `globals.css`
- [ ] No import errors in VS Code
- [ ] Run `npm run dev`
- [ ] App loads at http://localhost:5173

---

**🎉 Congratulations! Your UniMate app is now running in VS Code!**

For questions or issues, review the Troubleshooting section above.
