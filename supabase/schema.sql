-- ============================================================
-- atomlearn by atomcamp — Supabase PostgreSQL Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE resource_type AS ENUM ('pdf', 'link', 'code');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE insight_type AS ENUM ('encouragement', 'warning', 'recommendation');
CREATE TYPE chat_role AS ENUM ('user', 'assistant');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE activity_action AS ENUM ('module_view', 'quiz_attempt', 'chat_message', 'login');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  avatar_url      TEXT,
  role            user_role NOT NULL DEFAULT 'student',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  level           skill_level,
  cohort_id       UUID,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_cohort ON profiles(cohort_id);

-- ============================================================
-- COURSES & CONTENT
-- ============================================================

CREATE TABLE courses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  description     TEXT,
  level           course_level NOT NULL DEFAULT 'beginner',
  price_pkr       INTEGER DEFAULT 0,
  duration_weeks  INTEGER NOT NULL,
  total_modules   INTEGER DEFAULT 0,
  instructor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  thumbnail_url   TEXT,
  is_published    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_published ON courses(is_published);

CREATE TABLE weeks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  week_number     INTEGER NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, week_number)
);

CREATE INDEX idx_weeks_course ON weeks(course_id);

CREATE TABLE modules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id         UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  video_url       TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index     INTEGER NOT NULL DEFAULT 0,
  is_free         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_modules_week ON modules(week_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);

CREATE TABLE resources (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id       UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  file_url        TEXT,
  type            resource_type NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_resources_module ON resources(module_id);

CREATE TABLE quizzes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id       UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id         UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  body            TEXT NOT NULL,
  options         JSONB NOT NULL,          -- ["option A", "option B", ...]
  correct_index   INTEGER NOT NULL,
  explanation     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_quiz ON questions(quiz_id);

-- ============================================================
-- ENROLLMENT & PROGRESS
-- ============================================================

CREATE TABLE enrollments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at     TIMESTAMPTZ DEFAULT NOW(),
  status          enrollment_status DEFAULT 'active',
  UNIQUE(student_id, course_id)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

CREATE TABLE module_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id       UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  completed       BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  last_viewed_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, module_id)
);

CREATE INDEX idx_module_progress_student ON module_progress(student_id);
CREATE INDEX idx_module_progress_module ON module_progress(module_id);

CREATE TABLE quiz_attempts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id         UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  answers         JSONB NOT NULL,          -- { "question_id": selected_index, ... }
  score           INTEGER NOT NULL,        -- 0-100
  passed          BOOLEAN DEFAULT FALSE,
  attempted_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- ============================================================
-- AI & INSIGHTS
-- ============================================================

CREATE TABLE ai_insights (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_text    TEXT NOT NULL,
  type            insight_type NOT NULL DEFAULT 'encouragement',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insights_student ON ai_insights(student_id);
CREATE INDEX idx_insights_created ON ai_insights(created_at DESC);

CREATE TABLE chat_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id      UUID NOT NULL,
  role            chat_role NOT NULL,
  content         TEXT NOT NULL,
  module_context_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_student ON chat_messages(student_id);
CREATE INDEX idx_chat_session ON chat_messages(session_id);
CREATE INDEX idx_chat_created ON chat_messages(created_at);

-- ============================================================
-- COHORTS & INSTRUCTOR
-- ============================================================

CREATE TABLE cohorts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  start_date      DATE NOT NULL,
  end_date        DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cohorts_course ON cohorts(course_id);
CREATE INDEX idx_cohorts_instructor ON cohorts(instructor_id);

CREATE TABLE cohort_enrollments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_id       UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cohort_id, student_id)
);

CREATE INDEX idx_cohort_enrollments_cohort ON cohort_enrollments(cohort_id);
CREATE INDEX idx_cohort_enrollments_student ON cohort_enrollments(student_id);

CREATE TABLE at_risk_flags (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cohort_id       UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  risk_level      risk_level NOT NULL DEFAULT 'medium',
  reason          TEXT,
  flagged_at      TIMESTAMPTZ DEFAULT NOW(),
  resolved        BOOLEAN DEFAULT FALSE,
  UNIQUE(student_id, cohort_id)
);

CREATE INDEX idx_risk_flags_cohort ON at_risk_flags(cohort_id);
CREATE INDEX idx_risk_flags_student ON at_risk_flags(student_id);
CREATE INDEX idx_risk_flags_level ON at_risk_flags(risk_level);

-- ============================================================
-- CERTIFICATES
-- ============================================================

CREATE TABLE certificates (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id         UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  issued_at         TIMESTAMPTZ DEFAULT NOW(),
  pdf_url           TEXT,
  verification_code UUID DEFAULT uuid_generate_v4(),
  UNIQUE(student_id, course_id)
);

CREATE INDEX idx_certificates_student ON certificates(student_id);

-- ============================================================
-- GAMIFICATION
-- ============================================================

CREATE TABLE streaks (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak      INTEGER DEFAULT 0,
  longest_streak      INTEGER DEFAULT 0,
  last_activity_date  DATE DEFAULT CURRENT_DATE,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activity_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action          activity_action NOT NULL,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_student ON activity_log(student_id);
CREATE INDEX idx_activity_created ON activity_log(created_at DESC);
CREATE INDEX idx_activity_action ON activity_log(action);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TRIGGER: activity_log → update streak
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_update_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- This is handled by the update-streak Edge Function via webhook
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_activity_log_streak
  AFTER INSERT ON activity_log
  FOR EACH ROW EXECUTE FUNCTION trigger_update_streak();
