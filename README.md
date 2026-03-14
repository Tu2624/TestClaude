# UIGen

AI-powered React component generator with live preview.

## Prerequisites

- Node.js 18+
- npm

## Setup

1. **Optional** Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your-api-key-here
```

The project will run without an API key. Rather than using a LLM to generate components, static code will be returned instead.

2. Install dependencies and initialize database

```bash
npm run setup
```

This command will:

- Install all dependencies
- Generate Prisma client
- Run database migrations

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Sign up or continue as anonymous user
2. Describe the React component you want to create in the chat
3. View generated components in real-time preview
4. Switch to Code view to see and edit the generated files
5. Continue iterating with the AI to refine your components

## Features

- AI-powered component generation using Claude
- Live preview with hot reload
- Virtual file system (no files written to disk)
- Syntax highlighting and code editor
- Component persistence for registered users
- Export generated code

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma with SQLite
- Anthropic Claude AI
- Vercel AI SDK

## Practice Log

### Fix NODE_OPTIONS error on Windows
Next.js dev server failed to start due to `NODE_OPTIONS=--require` not being supported on Windows. Resolved by installing `cross-env` and updating `package.json` scripts to use it, making the environment variable syntax cross-platform compatible.

### Configure Anthropic API Key
Added `ANTHROPIC_API_KEY` to the `.env` file to connect the app to Claude instead of the built-in mock provider. With a real key set, the AI generates actual React components instead of returning static placeholder code.

### Refactor interface to Dark Mode
Converted the entire UI from light mode to a professional dark theme:
- Added `dark` class to `<html>` in `layout.tsx` to activate Tailwind dark mode globally
- Replaced all `neutral/gray/white` color tokens with `slate-*` equivalents across all components
- Fixed hardcoded light-mode colors in `FileTree`, `MarkdownRenderer`, and auth forms
- Added visual polish: gradient header title, dot-grid empty state background, message entry animations, 3-dot typing indicator, and a copy button on code blocks
