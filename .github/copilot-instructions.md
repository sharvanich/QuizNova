# Copilot Instructions for AI Quiz Generator UI

## Project Overview
This is a single-page React + Vite UI for an AI quiz generator with React 19 and the experimental React Compiler enabled. The AI quiz generation logic is already implemented - focus on building clean, modern UI components with dark theme aesthetics and gradient backgrounds, inspired by professional web design agencies. Uses modern ESM modules and component-based architecture.

## Key Architecture Decisions

### React Compiler Integration
- **React Compiler is enabled** via `babel-plugin-react-compiler` in `vite.config.js`
- This provides automatic optimization but impacts dev/build performance
- Write components with React Compiler best practices in mind (avoid manual memoization)

### Module System & File Extensions
- Uses ESM modules (`"type": "module"` in package.json)
- All imports use explicit `.jsx` extensions for React components
- Example: `import App from './App.jsx'` (not `'./App'`)

### Design System & Styling
- **Modern dark theme** with purple/pink gradient backgrounds and clean typography
- Single-page application layout with smooth sections and transitions
- Component-scoped CSS files following naming convention (`Component.css` for `Component.jsx`)
- Global CSS variables in `src/index.css` for consistent colors, spacing, and typography
- Responsive design with mobile-first approach (`min-width: 320px`)
- Focus on clean, professional UI elements with subtle shadows and rounded corners

## Development Workflow

### Essential Commands
```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint with flat config
```

### ESLint Configuration
- Uses **flat config format** (`eslint.config.js`)
- Custom rule: `no-unused-vars` ignores uppercase variables (constants pattern)
- Extends recommended configs for React Hooks and React Refresh
- Targets browser globals and modern ECMAScript

## Code Patterns & Conventions

### Component Structure
- Functional components with hooks (React 19 patterns)
- Default exports for components
- CSS imports after React imports: `import './Component.css'`

### Asset Handling
- Public assets referenced from root: `src="/vite.svg"`
- Src assets imported as modules: `import reactLogo from './assets/react.svg'`

### UI Architecture for AI Quiz Generator
- **Single-page application** with sections for AI quiz generation input, generated quiz display, and results
- Local state management using `useState` for UI state, generated quiz data, and user interactions
- Focus on UI components that interface with existing AI logic (forms, displays, interactions)
- Clean component hierarchy: App → QuizGenerator → GeneratedQuiz → ResultsDisplay

## File Organization
```
src/
  ├── main.jsx          # Entry point with StrictMode
  ├── App.jsx           # Main app component
  ├── index.css         # Global styles & CSS variables
  ├── App.css           # Component-specific styles
  └── assets/           # Static assets imported in components
```

## Design Guidelines
- **Color Palette**: Dark backgrounds with purple/pink gradients, white/light text
- **Layout**: Single-page with smooth scrolling sections and centered content
- **Typography**: Clean, modern fonts with good contrast and readable sizing
- **Components**: Cards with subtle shadows, rounded corners, and hover effects
- **Interactions**: Smooth transitions and micro-animations for better UX

## Common Tasks
- **Adding UI components**: Create `.jsx` files with accompanying `.css` files for quiz interfaces
- **Styling sections**: Use gradient backgrounds and consistent spacing from CSS variables
- **Input forms**: Build clean forms for AI quiz generation parameters (topic, difficulty, question count)
- **Quiz display**: Create components to elegantly display AI-generated questions and answers
- **User interactions**: Handle quiz taking, answer selection, and results display
- **Responsive design**: Ensure all UI components work seamlessly on mobile and desktop

## Browser Support
- Modern browsers supporting CSS custom properties, gradients, and ES2020+
- Touch-friendly interfaces for mobile quiz taking