# Giotto - Circle Drawing Game

A precision circle drawing game with AI-powered feedback and progress tracking. Built with modern web technologies and designed for both web and mobile platforms.

## 🎯 Features

- **Precision Circle Drawing**: Practice drawing perfect circles with real-time feedback
- **AI-Powered Scoring**: Advanced geometric analysis and scoring algorithms
- **Progress Tracking**: Comprehensive analytics and progress visualization
- **Multiple Game Modes**: Various difficulty levels and practice modes
- **Mobile Optimized**: Built with Capacitor for cross-platform mobile deployment
- **Real-time Feedback**: Instant visual and haptic feedback
- **Achievement System**: Gamified progress with badges and milestones

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks + Context API
- **Backend**: Supabase (Auth, Database, Functions)
- **Mobile**: Capacitor
- **Animations**: Framer Motion + Lottie
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd giotto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8080`

## 📱 Mobile Development

### iOS Development
```bash
npm run ios
```

### Android Development
```bash
npm run android
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Authentication components
│   ├── game/           # Game-related components
│   ├── progress/       # Progress tracking components
│   └── settings/       # Settings components
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── lib/                # Library configurations
└── assets/             # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run lint` - Run ESLint (currently disabled due to TypeScript compatibility)

## 🎨 Design System

The project uses a comprehensive design system with:

- **Color System**: HSL-based color palette with dark/light mode support
- **Typography**: Custom font scale with SF Pro Rounded
- **Spacing**: 8pt grid system
- **Components**: shadcn/ui component library
- **Animations**: Framer Motion for smooth interactions

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 📊 Database Schema

The project uses Supabase with the following main tables:

- `profiles` - User profiles and settings
- `game_sessions` - Game session data
- `progress_data` - User progress tracking
- `achievements` - Achievement system data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the component documentation in the codebase

## 🚀 Deployment

### Web Deployment
The project can be deployed to any static hosting service:

```bash
npm run build
```

### Mobile Deployment
Use Capacitor to build for mobile platforms:

```bash
npm run build
npx cap sync
npx cap open ios    # For iOS
npx cap open android # For Android
```
