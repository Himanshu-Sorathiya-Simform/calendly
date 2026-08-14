# General Instructions

- Never assume or guess. Ask questions if there is any doubt, questionability,
  uncertainty, or ambiguity.
- Provide responses/plans first. Do not apply changes or modify files unless
  explicitly instructed or approved. Always wait for approval.

# CSS Rules

- Use TailwindCSS v4.
- Do not use any arbitrary values unless highly required.
- Create variables and rely on a good Design System as much as possible.
- The website should feel authentic and match the look and feel of a modern Calendar
  website.

# TypeScript Rules

- Maximize TypeScript support, use v5.x (latest).
- Never use `any`, default to `unknown`.
- Use Generics only where they have a scope of being used later on.

# React & Next.js Rules

- The project is single-feature; do not use feature-driven folder structures. Use a
  single `src` folder.
- Use React 19 compiler mode and Next.js 16 with the App Router.
- Use a single `app` directory for managing all routing-related work.
- Wherever possible, include `page`, `layout`, `loading`, `error`, and `not-found`
  files with one default global error. Try to use other Next.js features such as
  `@folder` slot patterns (parallel routes) and intercepting routes if applicable.
- Prefer server components and use client components only when strictly required.
- Place all API route requests in `/src/app/api` so they reside in a single place.
- Have a single `components` folder and use logical grouping inside it. Do not put
  all components at the same level (e.g., group them inside subfolders like `ui/`,
  `calendar/`, `core/`, etc.).

# Code Structure & Best Practices

- Component naming must be PascalCase, and all other naming should be camelCase (except Next.js routing files).
- Only components should be default exports; all others should be named exports.
- Never have any constants, utilities, and types at the global level. Put them in `{name}Utils.ts`, `{name}Constants.ts`, or `{name}Types.ts` files inside `types/`, `constants/`, and `utils/` folders (except prop types, which should be one line above the component definition).
- Export only the things that are used; not everything requires an export.
- Follow the single responsibility principle: a single component or hook should be doing a single thing. Allow only one component per file.
