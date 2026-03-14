# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Initial setup (installs deps, generates Prisma client, runs migrations)
npm run setup

# Development server (uses Turbopack + node-compat shim)
npm run dev

# Build
npm run build

# Lint
npm run lint

# Run all tests
npm test

# Run a single test file
npx vitest run src/lib/__tests__/file-system.test.ts

# Reset database
npm run db:reset

# Regenerate Prisma client after schema changes
npx prisma generate

# Run new migrations
npx prisma migrate dev
```

## Architecture Overview

UIGen is a Next.js 15 (App Router) application that lets users describe React components in a chat interface and see a live preview rendered in an iframe — no files are written to disk.

### Request Flow

1. User types a prompt → `ChatContext` (`src/lib/contexts/chat-context.tsx`) calls `/api/chat` via Vercel AI SDK's `useChat`
2. `POST /api/chat` (`src/app/api/chat/route.ts`) streams responses from Claude using `streamText` with two tools:
   - `str_replace_editor` — create/edit files via string replacement or insertion
   - `file_manager` — rename/delete files
3. Tool calls are intercepted client-side in `ChatContext.onToolCall` → forwarded to `FileSystemContext.handleToolCall`
4. `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`) mutates the in-memory `VirtualFileSystem` and triggers a re-render
5. `PreviewFrame` (`src/components/preview/PreviewFrame.tsx`) reads all files, transforms them via `createImportMap` and renders the result in an `<iframe>` using native ES module import maps

### Key Abstractions

**VirtualFileSystem** (`src/lib/file-system.ts`)
An in-memory tree of `FileNode` objects. All generated code lives here — nothing touches the real filesystem. Supports serialize/deserialize for persistence. A singleton `fileSystem` is exported but the React tree uses instances passed through context.

**JSX Transformer** (`src/lib/transform/jsx-transformer.ts`)
Uses `@babel/standalone` to transpile JSX/TSX to JS in the browser. `createImportMap` builds a native ES module import map: local files become Blob URLs; third-party packages are resolved via `https://esm.sh/`. Missing local imports get stub placeholder modules.

**Language Model Provider** (`src/lib/provider.ts`)
If `ANTHROPIC_API_KEY` is set, uses `claude-haiku-4-5` via `@ai-sdk/anthropic`. Otherwise falls back to `MockLanguageModel` which returns static component examples — useful for development without an API key.

**Auth** (`src/lib/auth.ts`)
JWT-based session stored in an httpOnly cookie. Uses `jose` for signing/verification. Marked `server-only`. Anonymous users can work without signing in; their in-progress work is tracked in `src/lib/anon-work-tracker.ts` and offered for save upon sign-up.

**Persistence** (`prisma/schema.prisma`)
SQLite via Prisma. `Project` stores chat `messages` and file system `data` as JSON strings. Projects are optional — anonymous sessions are ephemeral.

### Context Nesting

```
FileSystemProvider
  └── ChatProvider       (depends on FileSystemProvider for handleToolCall)
        └── UI components
```

Both providers are set up in `src/app/[projectId]/page.tsx` and `src/app/main-content.tsx`.

### Testing

Tests use Vitest + jsdom + React Testing Library. Test files live alongside source in `__tests__/` subdirectories. The vitest config (`vitest.config.mts`) uses `vite-tsconfig-paths` so `@/` path aliases resolve correctly.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | No | If absent, mock provider is used |
| `JWT_SECRET` | No | Defaults to `"development-secret-key"` |
