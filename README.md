# 🍿 Couch Potato - Your Ultimate Movie & TV Discovery Platform

A modern, responsive web application built with Next.js 15, React 19, and TypeScript that helps you discover, track, and manage your favorite movies and TV shows. Built with a cinematic design and smooth animations for an immersive viewing experience.

## ✨ Features

### 🎬 Content Discovery
- **Hero Carousel**: Featured movies with auto-rotating slides and smooth transitions
- **Category Browsing**: Explore movies by trending, popular, top-rated, and genre-specific categories
- **Advanced Search**: Find movies and TV shows with intelligent search functionality
- **Infinite Scrolling**: Seamless content loading with infinite scroll feeds

### 🎯 Personalization
- **User Authentication**: Secure login/signup with Supabase Auth
- **Watchlist Management**: Save movies and shows you want to watch later
- **Favorites System**: Mark your favorite content for quick access
- **Profile Management**: Customize your viewing preferences

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes with touch-friendly interactions
- **Smooth Animations**: Framer Motion powered animations throughout the app
- **Dark Theme**: Cinematic dark theme with glassmorphism effects
- **Progressive Loading**: Smart image loading with blur-to-sharp transitions

### 🎨 UI/UX Highlights
- **Cinematic Design**: Netflix-inspired interface with modern aesthetics
- **Smooth Transitions**: Micro-interactions and page transitions
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance**: Optimized with Next.js 15 and React 19 features

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling with custom design system
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives

### Backend & Database
- **Supabase** - Authentication and real-time database
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **Next.js API Routes** - Serverless API endpoints

### Data & APIs
- **TMDB API** - The Movie Database for movie/TV data
- **React Query** - Server state management and caching
- **Axios** - HTTP client for API requests

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- PostgreSQL database
- TMDB API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/couch-potato.git
cd couch-potato
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3

# Database
DATABASE_URL=your_postgresql_connection_string

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
couch-potato/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/                   # Main application pages
│   │   ├── category/             # Category browsing
│   │   ├── movies/               # Movie details
│   │   ├── tvshows/              # TV show details
│   │   ├── person/               # Person/actor details
│   │   ├── profile/              # User profile
│   │   ├── search/               # Search functionality
│   │   └── watchlist/            # User watchlist
│   └── api/                      # API routes
├── components/                   # Reusable components
│   ├── auth/                     # Authentication components
│   ├── functional/               # Feature-specific components
│   ├── general/                  # General UI components
│   ├── main/                     # Main page components
│   ├── movies/                   # Movie-related components
│   ├── navbar/                   # Navigation components
│   ├── person/                   # Person-related components
│   ├── profile/                  # Profile components
│   ├── search/                   # Search components
│   ├── tv/                       # TV show components
│   └── ui/                       # Base UI components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
├── types/                        # TypeScript type definitions
├── helpers/                      # Helper functions
└── prisma/                       # Database schema and migrations
```

## 🎨 Design System

### Color Palette
- **Primary**: Cinematic Red (`#dc2626`)
- **Secondary**: Gold Accent (`#f59e0b`)
- **Background**: Dark (`#141414`)
- **Surface**: Card (`#1f1f1f`)
- **Text**: White/Gray variants

### Typography
- **Headings**: Bold, large sizes for impact
- **Body**: Clean, readable text
- **Code**: Monospace for technical content

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Glass morphism with focus states
- **Modals**: Backdrop blur with smooth animations

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Movie Database (TMDB)** for providing comprehensive movie and TV data
- **Supabase** for authentication and database services
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Radix UI** for accessible component primitives

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**Made with ❤️ by the Couch Potato Team**