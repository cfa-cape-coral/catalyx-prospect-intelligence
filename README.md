# Catalyx Prospect Intelligence

A private prospect research and consulting-intelligence platform for Catalyx Systems.

## Current milestone

This repository currently contains the application foundation only:

- Responsive Next.js shell
- Placeholder login page
- Placeholder dashboard page
- Placeholder new-prospect page
- Placeholder prospect-profile route
- Shared navigation and layout components
- Automated foundation tests

It does **not** yet contain authentication, Supabase, AI research, OCR, public web search, or background jobs.

## Requirements

Install Node.js and npm before continuing.

## Run locally

1. Clone the private repository.
2. Open a terminal in the repository folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in a browser.

The root URL redirects to `/dashboard`.

## Available routes

- `/login`
- `/dashboard`
- `/prospects/new`
- `/prospects/example-prospect`

## Quality checks

Run all checks before committing:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

All four commands must pass.

## Security

- Do not commit API keys or passwords.
- Do not commit `.env.local`.
- All future service credentials must use environment variables.
