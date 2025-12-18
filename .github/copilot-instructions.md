# UniMate Development Guide

## Project Architecture

UniMate is a React + TypeScript learning management platform using Supabase as the backend. The app uses a **simple client-side routing system** via state management in `App.tsx` (no react-router) and **localStorage-based session persistence** (7-day expiry).

### Key Technical Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui components (47 pre-built components in `src/components/ui/`)
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- **Backend**: Supabase (PostgreSQL) - **NOT using Supabase Auth** (custom auth via direct DB queries)
- **Build**: Vite with esbuild minification

## Critical Patterns

### 1. Custom Authentication (Not Supabase Auth)
The app **does NOT use Supabase's built-in auth system**. Instead:
- Direct database queries to `users` table in `src/lib/auth.ts`
- Plaintext password storage (see `AuthService.signUp`) - **production should hash passwords**
- Session managed via `localStorage` with key `'unimate_user_session'`
- 7-day session expiry checked in `App.tsx` on mount

**Example auth flow:**
```typescript
// src/lib/auth.ts
await supabase.from('users').insert({ name, email, password }) // Direct insert
// No supabase.auth.signUp() call
```

### 2. State Management & Routing
- **Single root component** (`App.tsx`) manages all app state
- Page navigation via `currentPage` state string (`'home'`, `'courses'`, `'profile'`, etc.)
- User data stored in `userData` state and synced to localStorage
- No router library - conditional rendering based on `currentPage`

### 3. Database Schema Patterns
Refer to `DATABASE_STRUCTURE.md` for full schema. Key tables:
- `users` - Custom user table (not Supabase auth.users)
- `subjects`, `modules`, `lessons` - Hierarchical course content
- `user_progress`, `user_subjects` - Progress tracking with percentage-based completion
- **RLS (Row Level Security)** enabled - see `SUPABASE_SETUP.md` for policies

### 4. Component Organization
```
src/components/
├── ui/              # shadcn/ui primitives (Button, Card, Dialog, etc.)
├── *Page.tsx        # Page components (HomePage, CoursesPage, etc.)
├── AIChatbot.tsx    # AI assistant with subject context
├── Navbar.tsx       # Main navigation
└── QuestionnaireModal.tsx  # Subject assessment
```

**Import pattern for UI components:**
```typescript
import { Button } from './ui/button'  // relative paths
import { Card } from '@/components/ui/card'  // @/ alias also works
```

## Development Workflow

### Essential Commands
```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build (outputs to dist/)
npm run build:alt    # Alternative build with build.js script
npm run preview      # Preview production build
```

### Environment Setup
Required `.env` variables:
```env
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Database setup**: Run SQL scripts from `SUPABASE_SETUP.md` in Supabase SQL Editor before first run.

### Path Aliases
Vite configured with `@` alias pointing to `src/`:
```typescript
import { supabase } from '@/lib/supabase'  // resolves to src/lib/supabase
```

## Code Conventions

### TypeScript Types
- Database types defined in `src/lib/types/database.ts` matching Supabase schema
- Use type-safe Supabase client: `createClient<Database>(url, key)`
- Component props always explicitly typed with interfaces

### UI Component Usage
All shadcn/ui components use class-variance-authority (CVA) for variants:
```typescript
<Button variant="outline" size="sm">Click</Button>
<Card className="hover:shadow-lg">...</Card>
```

### Supabase Query Pattern
```typescript
// Always select specific fields and handle errors
const { data, error } = await supabase
  .from('table')
  .select('field1, field2')
  .eq('id', userId)
  .single()

if (error) throw error
return data
```

### State Updates with localStorage Sync
When updating user data, **always sync to localStorage**:
```typescript
setUserData(newData)
localStorage.setItem('unimate_user_session', JSON.stringify({
  user: newData,
  timestamp: Date.now()
}))
```

## Key Files

- `src/App.tsx` - Root component with routing & auth state
- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/auth.ts` - Custom authentication service (no Supabase Auth)
- `src/lib/types/database.ts` - TypeScript types for DB schema
- `SUPABASE_SETUP.md` - Required SQL migrations & RLS policies
- `DATABASE_STRUCTURE.md` - Complete schema documentation

## Common Pitfalls

1. **Don't use `supabase.auth.*` methods** - auth is custom, not Supabase's built-in system
2. **Password security**: Current implementation stores plaintext - hash in production
3. **Session handling**: Remember 7-day localStorage expiry when debugging login issues
4. **RLS policies**: If queries fail, check Row Level Security policies in Supabase dashboard
5. **Vite env vars**: Must prefix with `VITE_` to be accessible in client code
6. **UI component imports**: Use exact file names (e.g., `./ui/button` not `./ui/Button`)

## Deployment

Recommended platform: **Vercel**
- Auto-deploys from GitHub
- Add environment variables in Vercel dashboard (Project Settings → Environment Variables)
- Build command: `npm run build` (outputs to `dist/`)
- Ensure Supabase project is active and RLS policies are configured before deploying
