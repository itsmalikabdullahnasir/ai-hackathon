-- ============================================================
--  autocamp LMS  —  Complete Seed Script
--  Run this in Supabase SQL Editor (Dashboard → SQL Editor)
--  Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING
-- ============================================================

-- ============================================================
-- STEP 1 – TABLE DEFINITIONS (creates tables if missing)
-- ============================================================

-- profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id                   uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name            text NOT NULL DEFAULT 'Learner',
  avatar_url           text,
  role                 text NOT NULL DEFAULT 'student' CHECK (role IN ('student','instructor','admin')),
  onboarding_completed boolean NOT NULL DEFAULT false,
  level                text CHECK (level IN ('beginner','intermediate','advanced')),
  cohort_id            uuid,
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- courses
CREATE TABLE IF NOT EXISTS public.courses (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  description    text,
  level          text NOT NULL CHECK (level IN ('beginner','intermediate','advanced')),
  price_pkr      integer NOT NULL DEFAULT 0,
  duration_weeks integer NOT NULL DEFAULT 1,
  total_modules  integer NOT NULL DEFAULT 0,
  thumbnail_url  text,
  rating         numeric(3,1) DEFAULT 4.7,
  skills         text[] DEFAULT '{}',
  is_published   boolean NOT NULL DEFAULT true,
  instructor_id  uuid REFERENCES public.profiles(id),
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- weeks
CREATE TABLE IF NOT EXISTS public.weeks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  week_number integer NOT NULL,
  title       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- modules
CREATE TABLE IF NOT EXISTS public.modules (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  week_id          uuid REFERENCES public.weeks(id),
  title            text NOT NULL,
  description      text,
  video_url        text,
  duration_minutes integer NOT NULL DEFAULT 30,
  order_index      integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id  uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- questions
CREATE TABLE IF NOT EXISTS public.questions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id       uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  body          text NOT NULL,
  options       text[] NOT NULL,
  correct_index integer NOT NULL DEFAULT 0,
  explanation   text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- resources
CREATE TABLE IF NOT EXISTS public.resources (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id  uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title      text NOT NULL,
  type       text NOT NULL DEFAULT 'pdf' CHECK (type IN ('pdf','code','link','video')),
  file_url   text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- cohorts
CREATE TABLE IF NOT EXISTS public.cohorts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  course_id     uuid NOT NULL REFERENCES public.courses(id),
  instructor_id uuid REFERENCES public.profiles(id),
  start_date    date NOT NULL DEFAULT CURRENT_DATE,
  end_date      date,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id   uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'active',
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id)
);

-- cohort_enrollments
CREATE TABLE IF NOT EXISTS public.cohort_enrollments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id  uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cohort_id, student_id)
);

-- module_progress
CREATE TABLE IF NOT EXISTS public.module_progress (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id      uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  completed      boolean NOT NULL DEFAULT false,
  completed_at   timestamptz,
  last_viewed_at timestamptz DEFAULT now(),
  UNIQUE (student_id, module_id)
);

-- quiz_attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id      uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  answers      jsonb DEFAULT '{}',
  score        integer DEFAULT 0,
  passed       boolean DEFAULT false,
  attempted_at timestamptz NOT NULL DEFAULT now()
);

-- streaks
CREATE TABLE IF NOT EXISTS public.streaks (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak     integer NOT NULL DEFAULT 0,
  longest_streak     integer NOT NULL DEFAULT 0,
  last_activity_date date,
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- activity_log
CREATE TABLE IF NOT EXISTS public.activity_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action     text NOT NULL,
  metadata   jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- skill_scores
CREATE TABLE IF NOT EXISTS public.skill_scores (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill      text NOT NULL,
  score      integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, skill)
);

-- certificates
CREATE TABLE IF NOT EXISTS public.certificates (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id         uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  issued_at         timestamptz NOT NULL DEFAULT now(),
  verification_code text NOT NULL UNIQUE
);

-- ai_insights
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type         text NOT NULL CHECK (type IN ('recommendation','warning','encouragement')),
  insight_text text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- live_sessions
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id          uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  title              text NOT NULL,
  starts_at          timestamptz NOT NULL,
  participants_count integer DEFAULT 0,
  instructor_id      uuid REFERENCES public.profiles(id),
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- course_deadlines
CREATE TABLE IF NOT EXISTS public.course_deadlines (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title     text NOT NULL,
  due_at    timestamptz NOT NULL
);

-- at_risk_flags
CREATE TABLE IF NOT EXISTS public.at_risk_flags (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cohort_id  uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  risk_level text NOT NULL CHECK (risk_level IN ('low','medium','high')),
  reason     text,
  flagged_at timestamptz NOT NULL DEFAULT now()
);

-- ai_recommendations
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id  uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  text       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- chat_sessions
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      text NOT NULL DEFAULT 'New Chat',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- chat_messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role       text NOT NULL CHECK (role IN ('user','assistant')),
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

