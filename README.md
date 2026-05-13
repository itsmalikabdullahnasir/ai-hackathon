# Autocamp Adaptive LMS

Autocamp Adaptive LMS is a modern learning management platform for cohort-based technical education. It combines student learning journeys, instructor analytics, AI tutor workflows, progress tracking, onboarding assessment, and Supabase-backed course data into a polished Next.js application.

The product is designed for learners and instructors working across data science, AI, programming, and career-focused technical courses. It emphasizes adaptive guidance, measurable progress, and a focused dashboard experience.

## Table of Contents

- [Overview](#overview)
- [Demo Video](#demo-video)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Application Routes](#application-routes)
- [API Routes](#api-routes)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Development Scripts](#development-scripts)
- [Design System](#design-system)
- [Deployment Notes](#deployment-notes)

## Overview

Autocamp Adaptive LMS is built as a full-stack Next.js application with a premium dashboard interface. The app supports learner-facing workflows such as login, onboarding, course discovery, course playback, progress analytics, AI tutor chat, voice-note learning, explain-back evaluation, and peer support matching.

Instructor workflows include cohort analytics, at-risk learner detection, AI-generated recommendations, completion charts, and student-level progress review. Supabase provides the relational data model, authentication integration, storage configuration, row-level security policies, seed data, and Edge Function examples.

## Demo Video

Add your project demonstration video here:

```text
in the submission of GCR , the video is in .rar file uploaded with project 
```

You can also replace this placeholder with a clickable thumbnail:

```md
[![Autocamp Adaptive LMS Demo](public/demo-thumbnail.png)](https://your-demo-video-link.com)
```

## Key Features

- Student dashboard with learning streaks, module completion, deadlines, live sessions, and AI insights.
- Course catalog with search, filters, enrollment states, pricing, skills, and progress indicators.
- Course player route for module-based learning experiences.
- AI tutor interface for technical learning questions, suggested prompts, chat history UI, and fallback responses.
- Voice-note learning flow for recording, transcription, and tutor feedback.
- Explain-back workflow that evaluates a learner's understanding after a lesson.
- Peer support matching powered by learner needs, offers, and credit-style collaboration.
- Progress analytics with activity heatmap, study hours, skill radar, certificates, and cohort leaderboard.
- Instructor dashboard with cohort health metrics, completion trends, drop-off analysis, AI recommendations, and at-risk student review.
- Supabase schema for profiles, courses, weeks, modules, resources, quizzes, enrollments, progress, AI insights, chat messages, cohorts, certificates, streaks, and activity logs.
- Static HTML design references preserved under `pages/original` and `pages/green`.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| UI | React 18, Tailwind CSS, Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Backend | Next.js Route Handlers |
| Database/Auth | Supabase |
| AI Provider | Groq-compatible OpenAI API endpoint |
| Styling | Tailwind config plus `DESIGN.md` design tokens |

## Project Structure

```text
LMS/
|-- app/                         # Next.js App Router pages and API routes
|   |-- api/                     # Server route handlers
|   |-- ai-tutor/                # AI tutor, voice-note, explain-back, peer matching UI
|   |-- courses/                 # Course catalog and course detail/player routes
|   |-- dashboard/               # Student dashboard
|   |-- instructor/              # Instructor analytics dashboard
|   |-- login/                   # Authentication entry screen
|   |-- onboarding/              # Adaptive onboarding flow
|   |-- progress/                # Learner analytics and certificates
|   `-- settings/                # User settings route
|-- components/                  # Shared application shell, navigation, toast, skeletons
|-- lib/                         # Auth helpers, mock data, API helpers, Supabase clients
|-- pages/                       # Static HTML design references and theme variants
|   |-- original/
|   `-- green/
|-- public/                      # Static assets
|-- supabase/                    # Schema, RLS policies, seeds, storage config, Edge Functions
|-- DESIGN.md                    # Design system and visual direction
|-- middleware.ts                # App middleware
|-- package.json                 # Dependencies and scripts
`-- README.md                    # Project documentation
```

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects authenticated users to the dashboard and guests to login. |
| `/login` | Branded sign-in experience with local demo auth behavior. |
| `/onboarding` | Learner onboarding and skill-level assessment flow. |
| `/dashboard` | Student home with stats, learning path, live sessions, and AI insights. |
| `/courses` | Searchable course catalog with filters and enrollment states. |
| `/courses/[id]` | Course detail/player experience. |
| `/ai-tutor` | AI tutor chat, voice notes, explain-back feedback, and peer matching. |
| `/progress` | Learning analytics, certificates, heatmaps, and leaderboard views. |
| `/instructor` | Cohort analytics and instructor intervention dashboard. |
| `/settings` | User profile and application settings. |

## API Routes

| Route | Purpose |
| --- | --- |
| `/api/ai-chat` | Sends tutor messages to the configured Groq chat model. |
| `/api/ai-chat/sessions` | Chat session support route. |
| `/api/ai-chat/messages` | Chat message support route. |
| `/api/voice-note` | Processes learner voice notes for transcription and feedback. |
| `/api/explain-back` | Evaluates a learner's explanation against lesson content. |
| `/api/peer-debt` | Generates peer learning matches. |
| `/api/onboarding-assess` | Produces onboarding assessment output. |
| `/api/dashboard` | Returns authenticated dashboard data from Supabase. |
| `/api/courses` | Returns course catalog data. |
| `/api/courses/[id]` | Returns course detail data. |
| `/api/progress` | Returns learner progress data. |
| `/api/progress/complete` | Marks module progress as complete. |
| `/api/quiz/submit` | Handles quiz submission. |
| `/api/instructor` | Returns instructor dashboard data. |
| `/api/profile` | Updates learner profile data. |
| `/api/upload-avatar` | Handles avatar upload flow. |
| `/api/me` | Returns the current authenticated user context. |

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm
- Supabase project for database-backed features
- Groq API key for AI tutor, voice-note, explain-back, onboarding, and peer matching routes

### Installation

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill in the required variables in `.env.local`, then start the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Environment Variables

The project expects the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used by the browser client. `SUPABASE_SERVICE_ROLE_KEY` is used only by server-side routes and must never be exposed publicly. `GROQ_API_KEY` powers AI tutor, voice-note, explain-back, onboarding assessment, and peer matching workflows.

## Supabase Setup

Supabase database and policy files are included in the `supabase/` directory.

Recommended setup order:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Run `supabase/rls-policies.sql` to enable row-level security behavior.
4. Run `supabase/storage-config.sql` if avatar, resource, or certificate storage is needed.
5. Run either `supabase/seed.sql` or `supabase/seed_fixed.sql` to load sample data.
6. Review `supabase/SETUP_INSTRUCTIONS.sql` for project-specific setup notes.
7. Deploy Edge Functions from `supabase/functions/` if you want Supabase-hosted background AI and automation workflows.

Included Edge Function examples:

- `ai-chat`
- `at-risk-detection`
- `generate-certificate`
- `generate-insights`
- `onboarding-assess`
- `update-streak`

## Development Scripts

```bash
npm run dev
```

Starts the local Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build locally.

```bash
npm run lint
```

Runs the Next.js lint command.

## Design System

The interface follows the Adaptive Core design direction documented in `DESIGN.md`.

Primary design characteristics:

- Modern education technology interface for technical cohorts.
- High-contrast navigation with focused content areas.
- Orange and green accents for action, progress, and feedback states.
- Sora for headings and DM Sans for body text.
- Rounded cards, subtle borders, and restrained shadows.
- Dashboard-first layouts designed for scanning analytics and learning status quickly.

The `pages/original` and `pages/green` folders contain static HTML design references that document earlier visual directions and can be used for comparison or future UI exploration.

## Deployment Notes

For production deployment:

- Configure all environment variables in the hosting provider.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Run Supabase migrations and policies before enabling database-backed routes.
- Confirm `GROQ_API_KEY` is available to serverless functions.
- Build the project with `npm run build` before release.
- Review any demo local-storage authentication flows before using the app in a real production environment.

## Project Status

The repository contains a polished LMS frontend, API route scaffolding, Supabase schema, seed data, and AI workflow integrations. Some UI screens currently use local mock data while corresponding API routes and Supabase tables are present for production integration.
