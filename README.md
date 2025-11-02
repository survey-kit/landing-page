# Survey Kit Landing Page

A modern, mobile-first landing page for Survey Kit - an accessible survey framework designed for conversational user experiences.

## Overview

Survey Kit is a mobile-first, accessible survey framework that prioritises user experience through conversational interfaces. This landing page showcases the framework's capabilities whilst maintaining the same design principles: accessibility, mobile-first design, and developer-friendly implementation.

## Features

- **Mobile-First Design**: Optimised for mobile devices with responsive layouts
- **Fully Accessible**: WCAG 2.2 AA compliant with comprehensive screen reader support
- **Modern Tech Stack**: Built with Next.js 16, React 19, and TypeScript
- **Beautiful UI**: Styled with Tailwind CSS and shadcn/ui components
- **Developer Experience**: ESLint + Prettier configuration for code quality
- **Analytics Ready**: Integrated with Vercel Analytics for performance monitoring
- **Fast Performance**: Optimised for Core Web Vitals and loading speed
- **Kanban Board**: Interactive project management board with drag-and-drop functionality, secured with GitHub OAuth authentication via Supabase

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Library**: [React 19](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: [Supabase](https://supabase.com/) with GitHub OAuth
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/) for Kanban board interactions
- **Code Quality**: ESLint 9 + Prettier
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm, yarn, pnpm, or bun
- Supabase account (for authentication and database)
- GitHub OAuth app (for login functionality)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/survey-kit/landing-page.git
   cd landing-page
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env.local` file with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Development

### Available Scripts

- `npm run dev` - Start development server (runs on port 3001)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Code Quality

This project maintains high code quality standards:

- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Automatic code formatting with Tailwind CSS class sorting
- **TypeScript**: Full type safety throughout the application
- **Accessibility**: Built-in accessibility best practices

### Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── cards/           # Kanban card management endpoints
│   │   └── auth/            # Authentication callbacks
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Homepage component
├── components/              # Reusable UI components
│   ├── kanban-board.tsx    # Main Kanban board component
│   ├── kanban-card.tsx      # Individual card component
│   ├── kanban-column.tsx    # Column component
│   ├── login-dialog.tsx     # GitHub OAuth login
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utility functions
│   ├── auth.ts             # Authentication helpers
│   └── supabase/           # Supabase client configuration
├── scripts/                 # Database migration scripts
├── public/                  # Static assets
├── .prettierrc             # Prettier configuration
├── eslint.config.mjs       # ESLint 9 flat config
├── next.config.ts          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Vercel will automatically build and deploy your application

### Manual Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

### Kanban Board

The project includes an interactive Kanban board accessible via GitHub authentication. The board allows authorised users to:

- Create, edit, and delete cards across multiple columns
- Drag and drop cards to reorder within columns or move between columns
- Real-time updates via Supabase subscriptions

Access control is enforced through:

- GitHub OAuth authentication via Supabase
- Row Level Security (RLS) policies at the database level
- Server-side API route validation

### Content

- Update `app/page.tsx` for main content
- Modify `app/layout.tsx` for metadata and SEO
- Replace `public/logo.png` with your own logo
- Configure Kanban columns and permissions via Supabase dashboard

## Links

- **Survey Kit Framework**: [GitHub Organisation](https://github.com/survey-kit)

## Support

For questions about the Survey Kit framework or this landing page:

- Open an issue on GitHub
- Contact the maintainers
- Check the documentation (when available)
