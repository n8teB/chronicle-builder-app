# Chronicle Builder

A comprehensive story development workspace for writers, featuring version control, research integration, and project management tools.

## Features

- **Story Management**: Create, organize, and manage multiple writing projects
- **Version Control**: Track changes with draft management and comparison tools
- **Research Integration**: Web clipping, inspiration boards, and mood collections
- **Comments & Annotations**: Collaborative feedback and note-taking system
- **Global Search**: Search across all content types
- **Export Tools**: Multiple format support for manuscripts

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Desktop App**: Tauri (cross-platform)
- **Data Storage**: localStorage (client-side)

## Development

### Prerequisites

- Node.js 18+
- Rust (for Tauri builds)

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build desktop app (requires Rust)
npm run tauri-build
```

### Building Desktop Apps

To build desktop executables:

1. Install Rust: https://rustup.rs/
2. Run: `npm run tauri-build`

Alternatively, use GitHub Actions for automated builds on push.

## License

MIT License
