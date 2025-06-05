# Igloo Client Demo

A comprehensive demonstration of the Igloo threshold signature workflow, built with Vite, React, TypeScript, and Tailwind CSS.

This demo showcases the complete Igloo flow:
- **Keyset Generation**: Create threshold signature keysets
- **Share Distribution**: Distribute shares via QR codes
- **Echo Monitoring**: Monitor share echo confirmations
- **Secret Recovery**: Recover secrets from threshold shares

## 🚀 Tech Stack

- **⚡ Vite** - Lightning fast build tool and dev server
- **⚛️ React 19** - Modern React with latest features
- **📘 TypeScript** - Type-safe JavaScript
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🔧 ESLint** - Code linting and formatting

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository (if not already done)
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## 📁 Project Structure

```
├── src/
│   ├── App.tsx          # Main application component
│   ├── index.css        # Tailwind CSS imports
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The main CSS file (`src/index.css`) imports Tailwind's base, components, and utilities.

Custom animations and theme extensions can be added in `tailwind.config.js`.

## 🔧 Configuration

- **Vite**: Configured in `vite.config.ts`
- **TypeScript**: Configured in `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json`
- **Tailwind**: Configured in `tailwind.config.js`
- **PostCSS**: Configured in `postcss.config.js`
- **ESLint**: Configured in `eslint.config.js`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

This project can be deployed to any static hosting service. Build the project with `npm run build` and deploy the `dist` folder.

Popular options:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
