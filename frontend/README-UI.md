# SuiTree Modern UI System

A complete, modern, responsive UI theme for SuiTree - a Web3 link-in-bio application built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🎨 Design System

### Color Palette
- **Primary**: `#4B9EFF` (Sui Blue)
- **Secondary**: `#10B981` (Success Green)
- **Background Dark**: `#0D0D0F`
- **Background Light**: `#F9FAFB`
- **Card Dark**: `#18181B`
- **Text Primary**: `#E4E4E7` (dark) / `#1F2937` (light)
- **Text Secondary**: `#A1A1AA` (dark) / `#6B7280` (light)

### Typography
- **Font Family**: Inter (primary), JetBrains Mono (monospace)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Responsive Sizes**: xs (0.75rem) to 5xl (3rem)

## 🏗️ Architecture

### Core Components
- **Button**: Multiple variants (primary, secondary, outline, ghost, destructive)
- **Card**: Default, elevated, and outlined variants with hover effects
- **Input**: With labels, error states, and icon support
- **Modal**: Responsive modal with overlay and keyboard navigation
- **Badge**: Status indicators with multiple color variants
- **Avatar**: User avatars with status indicators and fallbacks

### Layout Components
- **AdminLayout**: Complete admin dashboard layout with sidebar and topbar
- **Sidebar**: Collapsible navigation with smooth animations
- **Topbar**: Search, theme toggle, wallet status, and user menu

### Pages
- **Dashboard**: Admin dashboard with stats, profile management, and analytics
- **PublicProfile**: Modern link-in-bio page with animations and responsive design
- **Demo**: Showcase page demonstrating all components and features

## 🚀 Features

### Admin Dashboard
- **Responsive Sidebar**: Collapsible navigation with smooth animations
- **Modern Topbar**: Search functionality, theme toggle, wallet connection status
- **Profile Management**: View, edit, and manage user profiles
- **Analytics**: View counts, link statistics, and performance metrics
- **Dark/Light Mode**: System preference detection with manual override

### Public Profile
- **Link-in-Bio Design**: Clean, centered layout optimized for mobile
- **Social Integration**: Twitter, GitHub, LinkedIn, Instagram support
- **Wallet Integration**: Display and copy wallet addresses
- **Premium Links**: Support for premium content access
- **Responsive Design**: Perfect on all device sizes

### Theme System
- **Unified Colors**: Consistent color palette across all components
- **Dark/Light Mode**: Automatic system detection with manual toggle
- **Custom Gradients**: Support for custom background gradients
- **Typography Scale**: Consistent font sizes and weights

## 🎭 Animations

Built with Framer Motion for smooth, performant animations:
- **Page Transitions**: Smooth fade and slide animations
- **Hover Effects**: Subtle scale and shadow changes
- **Loading States**: Spinner animations and skeleton loading
- **Micro-interactions**: Button presses, form focus states

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices first
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Touch-Friendly**: Large touch targets and gesture support
- **Adaptive Layout**: Sidebar collapses on mobile, responsive grids

## 🛠️ Tech Stack

- **React 18**: Latest React with hooks and concurrent features
- **TypeScript**: Full type safety and IntelliSense support
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready motion library
- **Lucide React**: Beautiful, customizable icons
- **shadcn/ui**: High-quality, accessible component primitives

## 📁 File Structure

```
src/
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   └── Avatar.tsx
│   └── layout/             # Layout components
│       ├── AdminLayout.tsx
│       ├── Sidebar.tsx
│       └── Topbar.tsx
├── contexts/
│   └── ThemeContext.tsx    # Theme management
├── lib/
│   ├── theme.ts           # Design system configuration
│   └── utils.ts           # Utility functions
├── pages/
│   ├── admin/
│   │   └── Dashboard.tsx  # Admin dashboard
│   ├── PublicProfile.tsx  # Public profile page
│   └── Demo.tsx           # Component showcase
└── styles/
    └── globals.css        # Global styles and Tailwind
```

## 🎯 Usage

### View the Demo
Visit `http://localhost:3003/#/new-demo` to see the complete UI system in action.

### Subdomain System
The system supports subdomain access for user profiles:
- **Development**: `username.localhost:3003`
- **Production**: `username.suitree.trwall.app`

Test the subdomain system at `http://localhost:3003/#/subdomain-test`

### Admin Dashboard
- Navigate to the admin section to see the full dashboard
- Toggle the sidebar to see responsive behavior
- Use the theme toggle to switch between light/dark modes
- Search and filter profiles

### Public Profile
- Click "View Public Profile" in the demo to see the link-in-bio page
- Notice the smooth animations and responsive design
- Test the wallet address copy functionality

## 🎨 Customization

### Theme Colors
Edit `src/lib/theme.ts` to customize colors, typography, and spacing:

```typescript
export const theme = {
  colors: {
    accent: {
      primary: '#4B9EFF', // Change primary color
      secondary: '#10B981', // Change secondary color
    },
    // ... other color definitions
  },
  // ... other theme properties
};
```

### Component Variants
All components support multiple variants and can be customized:

```tsx
<Button variant="primary" size="lg" leftIcon={<Plus />}>
  Create Profile
</Button>

<Card variant="elevated" hover>
  <CardContent>Content here</CardContent>
</Card>
```

## 🔧 Development

### Adding New Components
1. Create component in `src/components/ui/`
2. Follow the existing pattern with variants and TypeScript
3. Add to the demo page for testing
4. Update this README

### Theme Updates
1. Modify `src/lib/theme.ts` for design system changes
2. Update component styles to use theme values
3. Test in both light and dark modes

## 📊 Performance

- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Animations**: Hardware-accelerated with Framer Motion
- **Responsive**: CSS-only responsive design for best performance
- **Accessibility**: WCAG 2.1 AA compliant components

## 🌟 Key Features

✅ **Modern Design**: Clean, minimalistic aesthetic similar to Linear/Vercel  
✅ **Dark/Light Mode**: Automatic system detection with manual override  
✅ **Responsive**: Mobile-first design that works on all devices  
✅ **Animations**: Smooth, performant animations with Framer Motion  
✅ **Accessibility**: Keyboard navigation and screen reader support  
✅ **TypeScript**: Full type safety and excellent developer experience  
✅ **Customizable**: Easy to modify colors, fonts, and component styles  
✅ **Production Ready**: Optimized for performance and user experience  

## 🚀 Next Steps

1. **Integration**: Integrate with existing SuiTree backend
2. **Testing**: Add comprehensive test suite
3. **Documentation**: Create Storybook for component documentation
4. **Performance**: Add performance monitoring and optimization
5. **Features**: Add more advanced features like drag-and-drop, real-time updates

---

Built with ❤️ for the Sui ecosystem. This UI system provides a solid foundation for building modern, responsive Web3 applications.
