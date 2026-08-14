# Implementation Phases

The project development is broken down into the following structured phases:

## Phase 1: Project Initialization & UI Foundation

- **Goal:** Set up the Next.js 16 (React 19) environment and establish the premium design system.
- **Tasks:**
    - Initialize Next.js 16 with TypeScript and Tailwind CSS v4.
    - Configure Radix UI primitives and Framer Motion for micro-animations.
    - Set up global CSS variables (Design System) for an authentic, premium feel.
    - Implement base UI components (Buttons, Modals, Inputs, Calendar Grids).

## Phase 2: Database Architecture (Neon + Drizzle)

- **Goal:** Design and provision the serverless database.
- **Tasks:**
    - Initialize Neon PostgreSQL database.
    - Set up Drizzle ORM and define core schemas:
        - `users` (id, email, name, google_refresh_token)
        - `event_types` (id, user_id, title, duration, slug, description)
        - `availability` (id, user_id, day_of_week, start_time, end_time)
        - `bookings` (id, event_type_id, guest_email, guest_name, start_time, end_time)
    - Create seed scripts for local development without authentication.

## Phase 3: The Public Booking Experience (Recipient-First)

- **Goal:** Build the core scheduling UI where guests select times and book.
- **Tasks:**
    - Create the `/[username]` profile page listing `event_types`.
    - Create the `/[username]/[eventSlug]` booking interface.
    - Implement the interactive calendar grid using Radix and Framer Motion.
    - Handle client-side Timezone conversions dynamically.
    - Implement `useOptimistic` and React 19 Server Actions for instantaneous slot booking feedback.

## Phase 4: Authentication & Google Integration

- **Goal:** Integrate Clerk and establish the Google Calendar OAuth connection.
- **Tasks:**
    - Integrate Clerk for user authentication.
    - Configure Clerk to request Google Calendar OAuth scopes during sign-up/login.
    - Store Google Refresh Tokens securely in Neon via Clerk webhooks.
    - Build the authenticated Dashboard layout.

## Phase 5: Google Calendar Sync Engine (Native)

- **Goal:** Replace the proposed Nylas integration with a native Google Calendar API sync.
- **Tasks:**
    - Build a server-side utility to interact with the Google Calendar API.
    - When a guest books a slot (Phase 3), automatically create a Google Meet link and insert the event into the host's Google Calendar.
    - Fetch real-time busy slots from Google Calendar to prevent double bookings.

## Phase 6: Dashboard & Event Management

- **Goal:** Allow hosts to manage their availability and meeting types.
- **Tasks:**
    - Build the "Event Types" management page (Create, Edit, Delete durations and links).
    - Build the "Availability" management page (Set working hours, buffer times).
    - Build the "Scheduled Events" page to view upcoming meetings.
