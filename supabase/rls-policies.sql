-- ============================================================
-- atomlearn — Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE at_risk_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER: check if caller is admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper: check if caller is instructor for a cohort
CREATE OR REPLACE FUNCTION is_instructor_for_cohort(p_cohort_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM cohorts WHERE id = p_cohort_id AND instructor_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper: check if student is in instructor's cohort
CREATE OR REPLACE FUNCTION is_my_cohort_student(p_student_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM cohort_enrollments ce
    JOIN cohorts c ON c.id = ce.cohort_id
    WHERE ce.student_id = p_student_id AND c.instructor_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES
-- ============================================================

-- Users can read/update their own profile
CREATE POLICY "profiles: own read" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles: own update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Instructors can read profiles of students in their cohorts
CREATE POLICY "profiles: instructor reads cohort students" ON profiles
  FOR SELECT USING (
    is_my_cohort_student(id)
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
  );

-- System insert (triggered by auth.users)
CREATE POLICY "profiles: service insert" ON profiles
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- COURSES
-- ============================================================

-- All authenticated users can read published courses
CREATE POLICY "courses: read published" ON courses
  FOR SELECT USING (is_published = TRUE AND auth.role() = 'authenticated');

-- Instructors can manage their own courses
CREATE POLICY "courses: instructor manage" ON courses
  FOR ALL USING (instructor_id = auth.uid() OR is_admin());

-- ============================================================
-- WEEKS
-- ============================================================

CREATE POLICY "weeks: read with course access" ON weeks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = weeks.course_id AND c.is_published)
  );

CREATE POLICY "weeks: instructor manage" ON weeks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = weeks.course_id AND c.instructor_id = auth.uid())
    OR is_admin()
  );

-- ============================================================
-- MODULES
-- ============================================================

-- Free modules or enrolled students can read
CREATE POLICY "modules: read if enrolled or free" ON modules
  FOR SELECT USING (
    is_free = TRUE
    OR EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.course_id = modules.course_id AND e.student_id = auth.uid()
    )
    OR is_admin()
  );

-- Instructors manage their own course modules
CREATE POLICY "modules: instructor manage" ON modules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = modules.course_id AND c.instructor_id = auth.uid())
    OR is_admin()
  );

-- ============================================================
-- RESOURCES
-- ============================================================

CREATE POLICY "resources: read if enrolled" ON resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN enrollments e ON e.course_id = m.course_id
      WHERE m.id = resources.module_id AND e.student_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "resources: instructor manage" ON resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = resources.module_id AND c.instructor_id = auth.uid()
    )
    OR is_admin()
  );

-- ============================================================
-- QUIZZES & QUESTIONS
-- ============================================================

CREATE POLICY "quizzes: read if enrolled" ON quizzes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN enrollments e ON e.course_id = m.course_id
      WHERE m.id = quizzes.module_id AND e.student_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "questions: read if enrolled" ON questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN modules m ON m.id = q.module_id
      JOIN enrollments e ON e.course_id = m.course_id
      WHERE q.id = questions.quiz_id AND e.student_id = auth.uid()
    )
    OR is_admin()
  );

-- ============================================================
-- ENROLLMENTS
-- ============================================================

CREATE POLICY "enrollments: student reads own" ON enrollments
  FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "enrollments: instructor reads their course" ON enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = enrollments.course_id AND c.instructor_id = auth.uid())
    OR is_admin()
  );

-- Service role inserts (handled by Edge Functions)
CREATE POLICY "enrollments: service insert" ON enrollments
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR is_admin());

-- ============================================================
-- MODULE PROGRESS
-- ============================================================

CREATE POLICY "module_progress: student own" ON module_progress
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "module_progress: instructor reads cohort" ON module_progress
  FOR SELECT USING (is_my_cohort_student(student_id) OR is_admin());

-- ============================================================
-- QUIZ ATTEMPTS
-- ============================================================

CREATE POLICY "quiz_attempts: student own" ON quiz_attempts
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "quiz_attempts: instructor reads cohort" ON quiz_attempts
  FOR SELECT USING (is_my_cohort_student(student_id) OR is_admin());

-- ============================================================
-- AI INSIGHTS
-- ============================================================

CREATE POLICY "ai_insights: student reads own" ON ai_insights
  FOR SELECT USING (student_id = auth.uid());

-- Only service role can insert AI insights
CREATE POLICY "ai_insights: service insert" ON ai_insights
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- CHAT MESSAGES
-- ============================================================

CREATE POLICY "chat_messages: student own only" ON chat_messages
  FOR ALL USING (student_id = auth.uid());

-- ============================================================
-- COHORTS
-- ============================================================

CREATE POLICY "cohorts: instructor own" ON cohorts
  FOR ALL USING (instructor_id = auth.uid() OR is_admin());

CREATE POLICY "cohorts: student can read enrolled" ON cohorts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cohort_enrollments ce
      WHERE ce.cohort_id = cohorts.id AND ce.student_id = auth.uid()
    )
  );

-- ============================================================
-- COHORT ENROLLMENTS
-- ============================================================

CREATE POLICY "cohort_enrollments: student reads own" ON cohort_enrollments
  FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "cohort_enrollments: instructor manages" ON cohort_enrollments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM cohorts c WHERE c.id = cohort_enrollments.cohort_id AND c.instructor_id = auth.uid())
    OR is_admin()
  );

-- ============================================================
-- AT-RISK FLAGS (instructors only, not students)
-- ============================================================

CREATE POLICY "at_risk_flags: instructor manages" ON at_risk_flags
  FOR ALL USING (
    is_instructor_for_cohort(cohort_id)
    OR is_admin()
  );

-- Students explicitly CANNOT see at_risk_flags
-- (no SELECT policy for students)

-- ============================================================
-- CERTIFICATES
-- ============================================================

CREATE POLICY "certificates: student reads own" ON certificates
  FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "certificates: service insert" ON certificates
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR is_admin());

-- ============================================================
-- STREAKS
-- ============================================================

CREATE POLICY "streaks: student own" ON streaks
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "streaks: service update" ON streaks
  FOR UPDATE USING (auth.role() = 'service_role' OR is_admin());

-- ============================================================
-- ACTIVITY LOG
-- ============================================================

CREATE POLICY "activity_log: student own" ON activity_log
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "activity_log: instructor reads cohort" ON activity_log
  FOR SELECT USING (is_my_cohort_student(student_id) OR is_admin());
