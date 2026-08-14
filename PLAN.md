# Calendly Clone Project Plan

## Overview

We are building a modern, full-stack scheduling platform focused natively on Google Calendar integration. The platform allows hosts to define availability and event types, and guests to seamlessly book appointments using a highly optimized, recipient-first UI.

## Tech Stack

- **Framework:** Next.js 16 (React 19 compiler)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS v4, Radix UI primitives, Framer Motion
- **Database:** Neon (Serverless Postgres) + Drizzle ORM
- **Authentication:** Clerk (Google OAuth)
- **Calendar Sync:** Native Google Calendar API
- **Code Review:** CodeRabbit (via GitHub Actions)

## Core Features

### 1. Host Dashboard

- **Event Types:** Create and manage meetings with specific durations (e.g., 15-min chat, 30-min discovery call).
- **Availability Management:** Set working hours, specific days off, and automated buffer times between meetings.
- **Bookings View:** A unified list of all upcoming scheduled events.

### 2. Public Booking Experience

- **Profile Page (`/[username]`):** A branded page listing all public event types.
- **Interactive Calendar:** A fluid date and time selection interface built with Radix and animated via Framer Motion.
- **Timezone Mastery:** Dynamic, client-side translation of the host's availability into the guest's local timezone.
- **Optimistic UI:** Instant slot lock feedback leveraging React 19's `useOptimistic` hook and Server Actions to prevent double bookings visually.

### 3. Google Calendar Integration

- **OAuth Sync:** Hosts authenticate via Clerk, securely granting offline access to their Google Calendar.
- **Automated Event Creation:** When a guest books a slot, the system automatically inserts the event into the host's primary calendar and generates a Google Meet conferencing link.
- **Conflict Prevention:** Real-time fetching of Google Calendar free/busy schedules to ensure no overlapping appointments are displayed.

## Technical Architecture

- **Rendering Strategy:** Partial Prerendering (PPR) will deliver the static host profile instantly from the edge, while streaming the dynamic availability grids from the server.
- **Data Mutations:** React 19 Server Actions completely replace traditional API routes for form submissions, ensuring secure, server-side database writes.
- **Responsive Styling:** Tailwind v4 `@container` queries ensure the calendar components are fully embeddable and responsive across varying screen sizes.
