# SuiTree - Modern UI Component Library

A fully responsive, modern UI component library built with React, TypeScript, Tailwind CSS, and shadcn/ui. Features a unified design system with light/dark mode support, smooth animations, and accessibility best practices.

## 🚀 Features

- **Modern Design System**: Consistent colors, typography, and spacing
- **Responsive Design**: Mobile-first approach with perfect responsiveness
- **Dark/Light Mode**: System preference detection with manual toggle
- **Accessibility**: WCAG compliant components with semantic HTML
- **Animations**: Smooth transitions powered by Framer Motion
- **TypeScript**: Full type safety and IntelliSense support
- **Performance**: Optimized bundle size and runtime performance

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component primitives
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons
- **Vite** - Fast build tool and dev server

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

## 🎨 Design System

### Colors
- **Primary**: Blue-based color palette for main actions
- **Secondary**: Neutral grays for secondary elements
- **Success**: Green for positive actions and states
- **Warning**: Yellow for caution and attention
- **Error**: Red for errors and destructive actions
- **Muted**: Subtle colors for less important content

### Typography
- **Font Family**: Inter (primary), JetBrains Mono (code)
- **Scale**: Harmonious type scale from 12px to 48px
- **Weights**: Light (300) to Bold (700)

### Spacing
- **Scale**: 4px base unit with consistent spacing scale
- **Responsive**: Adaptive spacing for different screen sizes

## 🧩 Components

### Core Components
- **Button** - Multiple variants with loading states
- **Card** - Flexible container with header, content, footer
- **Input** - Form inputs with labels, validation, and helper text
- **Badge** - Status indicators and labels
- **Modal** - Accessible dialog with backdrop and keyboard navigation
- **Table** - Data tables with sorting and responsive design
- **Tabs** - Tabbed interface with keyboard navigation

### Layout Components
- **Navbar** - Responsive navigation with mobile menu
- **Footer** - Multi-column footer with social links
- **Hero** - Landing page hero sections with CTAs

### Utilities
- **Theme Toggle** - Light/dark/system mode switcher
- **Theme Provider** - Context-based theme management
- **Utility Functions** - Helper functions for common tasks

## 🎯 Usage Examples

### Basic Button
```tsx
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button loading>Loading...</Button>
    </div>
  )
}
```

### Card Component
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function FeatureCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Title</CardTitle>
        <CardDescription>Feature description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  )
}
```

### Theme Provider
```tsx
import { ThemeProvider } from "@/hooks/use-theme"
import { ThemeToggle } from "@/components/theme-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <div>
        <ThemeToggle />
        {/* Your app content */}
      </div>
    </ThemeProvider>
  )
}
```

## 📱 Responsive Design

The design system is built mobile-first with the following breakpoints:

- **sm**: 640px (small tablets)
- **md**: 768px (tablets)
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktops)
- **2xl**: 1536px (large desktops)

## 🌙 Dark Mode

Dark mode is fully supported with:
- System preference detection
- Manual toggle between light/dark/system
- Persistent theme selection
- Smooth transitions between themes

## ♿ Accessibility

All components follow accessibility best practices:
- Semantic HTML structure
- ARIA attributes where needed
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## 🎬 Animations

Smooth animations powered by Framer Motion:
- Page transitions
- Component entrance animations
- Hover and focus states
- Loading states
- Theme transitions

## 📁 File Structure

```
src/
├── components/
│   ├── ui/           # Core UI components
│   ├── layout/       # Layout components
│   └── theme-toggle.tsx
├── hooks/
│   └── use-theme.tsx # Theme management
├── lib/
│   ├── utils.ts      # Utility functions
│   └── theme.ts      # Theme configuration
├── pages/
│   └── demo.tsx      # Component showcase
├── styles/
│   └── globals.css   # Global styles
└── main.tsx          # App entry point
```

## 🚀 Getting Started

1. **View the demo page** at `/demo` to see all components in action
2. **Import components** from `@/components/ui/`
3. **Use the theme provider** to enable dark mode
4. **Customize the design system** in `src/lib/theme.ts`

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
