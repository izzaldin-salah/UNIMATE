
# UniMate - University Learning Management Platform

UniMate is a modern learning management system designed for university students and teachers. Built with React, TypeScript, and Supabase, it provides a comprehensive platform for course management, student progress tracking, and interactive learning.

## Features

- 🔐 **Authentication System** - Secure login and registration for students and teachers
- 📚 **Course Management** - Browse and manage courses and lessons
- 📈 **Progress Tracking** - Track student progress through lessons and courses
- 👤 **User Profiles** - Personalized user profiles with academic information
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS and shadcn/ui
- 💬 **AI Chatbot** - Interactive AI assistant for student support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time)
- **Deployment**: Vercel (recommended)

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/izzaldin-salah/UNIMATE.git
   cd UNIMATE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up Supabase database**
   - Follow the instructions in `SUPABASE_SETUP.md` to set up your database schema

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) to view the application.

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (already done if you're reading this!)

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
   - Click "New Project" and select your UNIMATE repository
   - Configure environment variables:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - Click "Deploy"

3. **Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add the same variables from your `.env` file
   - Redeploy if necessary

### Alternative Deployment Options

- **Netlify**: Similar process to Vercel
- **Railway**: Great for full-stack applications
- **AWS Amplify**: Enterprise-grade hosting
- **Static hosting**: Build with `npm run build` and deploy `dist/` folder

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── AIChatbot.tsx   # AI chatbot component
│   ├── CoursesPage.tsx # Course listing and management
│   ├── LoginRegister.tsx # Authentication forms
│   └── ...
├── lib/                # Utilities and services
│   ├── auth.ts         # Authentication service
│   ├── courses.ts      # Course management service
│   ├── supabase.ts     # Supabase client configuration
│   └── types/          # TypeScript type definitions
├── styles/             # Global styles
└── App.tsx             # Main application component
```

## Configuration Files

- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Environment Variables

The application requires the following environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the `SUPABASE_SETUP.md` for database setup issues
2. Ensure all environment variables are correctly set
3. Verify your Supabase project is active and accessible
4. Open an issue on GitHub for additional support

## Acknowledgments

- Original design from Figma: [UniMate UI/UX Design](https://www.figma.com/design/VRcsLywLxa8M6kb87aE4yQ/UniMate-UI-UX-Design)
- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Powered by [Supabase](https://supabase.com/) and [Vercel](https://vercel.com/)