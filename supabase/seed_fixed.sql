-- ============================================================
-- atomlearn by atomcamp — Supabase Seed (FIXED, idempotent)
-- Run this in Supabase SQL Editor AFTER schema.sql has been applied.
-- Safe to re-run: every insert is guarded by ON CONFLICT.
-- ============================================================

BEGIN;

-- Make sure required extensions are present (pgcrypto for gen_salt/crypt)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- AUTH USERS  (instance_id is required by Supabase)
-- ============================================================

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, raw_app_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES
  ('00000000-0000-0000-0000-000000000000','11111111-1111-1111-1111-111111111111','authenticated','authenticated','ahmed@atomcamp.com',         crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Ahmed Malik',       'avatar_url','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','22222222-2222-2222-2222-222222222222','authenticated','authenticated','ayesha.khan@atomcamp.com',   crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Dr. Ayesha Khan',   'avatar_url','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','33333333-3333-3333-3333-333333333333','authenticated','authenticated','omar.farooq@atomcamp.com',   crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Dr. Omar Farooq',   'avatar_url','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','44444444-4444-4444-4444-444444444444','authenticated','authenticated','usman.tariq@atomcamp.com',   crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Usman Tariq',       'avatar_url','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','99999999-9999-9999-9999-999999999999','authenticated','authenticated','admin@atomcamp.com',         crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Admin',             'avatar_url', NULL),                                                                                              jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','3a111111-1111-1111-1111-111111111111','authenticated','authenticated','ali@atomcamp.com',          crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Ali Hassan',        'avatar_url','https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','3a222222-2222-2222-2222-222222222222','authenticated','authenticated','fatima@atomcamp.com',       crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Fatima Zahra',      'avatar_url','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','3a333333-3333-3333-3333-333333333333','authenticated','authenticated','bilal@atomcamp.com',        crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Bilal Ahmed',       'avatar_url','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','3a444444-4444-4444-4444-444444444444','authenticated','authenticated','amna@atomcamp.com',         crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Amna Siddiqui',     'avatar_url','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','3a555555-5555-5555-5555-555555555555','authenticated','authenticated','hassan@atomcamp.com',       crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Hassan Raza',       'avatar_url','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','3a666666-6666-6666-6666-666666666666','authenticated','authenticated','zara@atomcamp.com',         crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Zara Khan',         'avatar_url','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','3a777777-7777-7777-7777-777777777777','authenticated','authenticated','imran@atomcamp.com',        crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Imran Malik',       'avatar_url','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000','3a888888-8888-8888-8888-888888888888','authenticated','authenticated','sana@atomcamp.com',         crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name','Sana Mir',          'avatar_url','https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider','email','providers',ARRAY['email']), NOW(), NOW(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- AUTH IDENTITIES  (provider_id is required in current Supabase)
-- ============================================================

INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
SELECT
  gen_random_uuid(),
  u.id,
  u.id::text,
  'email',
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true, 'phone_verified', false),
  NOW(), NOW(), NOW()
FROM auth.users u
WHERE u.email IN (
  'ahmed@atomcamp.com','ayesha.khan@atomcamp.com','omar.farooq@atomcamp.com','usman.tariq@atomcamp.com','admin@atomcamp.com',
  'ali@atomcamp.com','fatima@atomcamp.com','bilal@atomcamp.com','amna@atomcamp.com','hassan@atomcamp.com',
  'zara@atomcamp.com','imran@atomcamp.com','sana@atomcamp.com'
)
ON CONFLICT (provider, provider_id) DO NOTHING;

-- ============================================================
-- PROFILES  (rows are auto-created by the handle_new_user trigger;
--           we UPSERT to be safe in case the trigger is disabled)
-- ============================================================

INSERT INTO profiles (id, full_name, avatar_url, role, onboarding_completed, level, notification_prefs)
VALUES
  ('11111111-1111-1111-1111-111111111111','Ahmed Malik',     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face','student',    TRUE,  'intermediate', '{"email_sessions":true,"weekly_digest":true,"ai_recommendations":true,"new_courses":false}'),
  ('22222222-2222-2222-2222-222222222222','Dr. Ayesha Khan', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face','instructor', TRUE,  NULL,           '{}'),
  ('33333333-3333-3333-3333-333333333333','Dr. Omar Farooq', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face','instructor', TRUE,  NULL,           '{}'),
  ('44444444-4444-4444-4444-444444444444','Usman Tariq',     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face','instructor', TRUE,  NULL,           '{}'),
  ('99999999-9999-9999-9999-999999999999','Admin',           NULL,                                                                                          'admin',      TRUE,  NULL,           '{}'),
  ('3a111111-1111-1111-1111-111111111111','Ali Hassan',      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face','student',    TRUE,  'intermediate', '{}'),
  ('3a222222-2222-2222-2222-222222222222','Fatima Zahra',    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face','student',    TRUE,  'beginner',     '{}'),
  ('3a333333-3333-3333-3333-333333333333','Bilal Ahmed',     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face','student',    TRUE,  'beginner',     '{}'),
  ('3a444444-4444-4444-4444-444444444444','Amna Siddiqui',   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face','student',    TRUE,  'advanced',     '{}'),
  ('3a555555-5555-5555-5555-555555555555','Hassan Raza',     'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face','student',    FALSE, 'beginner',     '{}'),
  ('3a666666-6666-6666-6666-666666666666','Zara Khan',       'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face','student',    TRUE,  'intermediate', '{}'),
  ('3a777777-7777-7777-7777-777777777777','Imran Malik',     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face','student',    TRUE,  'beginner',     '{}'),
  ('3a888888-8888-8888-8888-888888888888','Sana Mir',        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face','student',    TRUE,  'intermediate', '{}')
ON CONFLICT (id) DO UPDATE
SET full_name            = EXCLUDED.full_name,
    avatar_url           = EXCLUDED.avatar_url,
    role                 = EXCLUDED.role,
    onboarding_completed = EXCLUDED.onboarding_completed,
    level                = EXCLUDED.level,
    notification_prefs   = EXCLUDED.notification_prefs;

-- ============================================================
-- COURSES
-- ============================================================

INSERT INTO courses (id, title, description, level, price_pkr, duration_weeks, total_modules, instructor_id, thumbnail_url, rating, skills, is_published) VALUES
  ('c1111111-1111-1111-1111-111111111111','Data Analytics Bootcamp',
   'Master data analysis with Python, SQL, and visualization tools. Build real-world dashboards and reports that drive business decisions. Covers statistics, EDA, Pandas, Matplotlib, Seaborn, and Tableau.',
   'beginner',     50000, 12, 12, '22222222-2222-2222-2222-222222222222',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
   4.8, ARRAY['Python','SQL','Tableau','Statistics','Excel','Pandas'], TRUE),
  ('c2222222-2222-2222-2222-222222222222','AI & Machine Learning Bootcamp',
   'Go deep into machine learning and deep learning. Build neural networks, NLP models, and computer vision applications. From linear regression to transformers — full stack AI.',
   'intermediate', 75000, 14, 14, '33333333-3333-3333-3333-333333333333',
   'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop',
   4.9, ARRAY['ML','Deep Learning','PyTorch','NLP','Computer Vision','Scikit-learn'], TRUE),
  ('c3333333-3333-3333-3333-333333333333','Automation with AI',
   'Automate repetitive tasks using Python scripts, AI APIs, and workflow automation tools like n8n and Make.com. Build bots, scrapers, and intelligent pipelines.',
   'intermediate', 35000, 6, 8,  '44444444-4444-4444-4444-444444444444',
   'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop',
   4.7, ARRAY['Python','APIs','n8n','Zapier','LLMs','Web Scraping'], TRUE),
  ('c4444444-4444-4444-4444-444444444444','AI Agents for Business',
   'Design and deploy autonomous AI agents for business workflows. Build with LangChain, OpenAI, and vector databases. Create RAG pipelines, multi-agent systems, and production-grade deployments.',
   'advanced',     60000, 8, 10, '44444444-4444-4444-4444-444444444444',
   'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
   4.9, ARRAY['LangChain','OpenAI API','Vector DBs','RAG','Agents','LlamaIndex'], TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- WEEKS
-- ============================================================

INSERT INTO weeks (id, course_id, title, week_number) VALUES
  ('w1a11111-1111-1111-1111-111111111111','c1111111-1111-1111-1111-111111111111','Python & SQL Foundations',     1),
  ('w1b22222-2222-2222-2222-222222222222','c1111111-1111-1111-1111-111111111111','Data Wrangling & EDA',         2),
  ('w1c33333-3333-3333-3333-333333333333','c1111111-1111-1111-1111-111111111111','Visualization & Reporting',    3),
  ('w2a11111-1111-1111-1111-111111111111','c2222222-2222-2222-2222-222222222222','ML Foundations',               1),
  ('w2b22222-2222-2222-2222-222222222222','c2222222-2222-2222-2222-222222222222','Supervised Learning',          2),
  ('w2c33333-3333-3333-3333-333333333333','c2222222-2222-2222-2222-222222222222','Neural Networks & DL',         3),
  ('w2d44444-4444-4444-4444-444444444444','c2222222-2222-2222-2222-222222222222','NLP & Computer Vision',        4),
  ('w3a11111-1111-1111-1111-111111111111','c3333333-3333-3333-3333-333333333333','Python Automation',            1),
  ('w3b22222-2222-2222-2222-222222222222','c3333333-3333-3333-3333-333333333333','AI-Powered Workflows',         2),
  ('w4a11111-1111-1111-1111-111111111111','c4444444-4444-4444-4444-444444444444','Agent Architecture',           1),
  ('w4b22222-2222-2222-2222-222222222222','c4444444-4444-4444-4444-444444444444','Production Agents',            2)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- MODULES (Course 1 — Data Analytics, 12 modules)
-- ============================================================

INSERT INTO modules (id, week_id, course_id, title, description, video_url, duration_minutes, order_index, is_free) VALUES
  ('m1a01111-1111-1111-1111-111111111111','w1a11111-1111-1111-1111-111111111111','c1111111-1111-1111-1111-111111111111','Python Crash Course for Analysts','Variables, lists, dicts, loops, and functions.', NULL, 45,  1, TRUE),
  ('m1a02222-2222-2222-2222-222222222222','w1a11111-1111-1111-1111-111111111111','c1111111-1111-1111-1111-111111111111','NumPy Essentials','Arrays, broadcasting, vectorized operations.', NULL, 40,  2, FALSE),
  ('m1a03333-3333-3333-3333-333333333333','w1a11111-1111-1111-1111-111111111111','c1111111-1111-1111-1111-111111111111','SQL Fundamentals','SELECT, WHERE, JOIN, GROUP BY, ORDER BY.', NULL, 50,  3, FALSE),
  ('m1a04444-4444-4444-4444-444444444444','w1a11111-1111-1111-1111-111111111111','c1111111-1111-1111-1111-111111111111','Advanced SQL & Window Functions','CTEs, subqueries, PARTITION BY, RANK.', NULL, 60,  4, FALSE),
  ('m1b01111-1111-1111-1111-111111111111','w1b22222-2222-2222-2222-222222222222','c1111111-1111-1111-1111-111111111111','Pandas DataFrames Deep Dive','Read, filter, transform, merge, pivot.', NULL, 65,  5, FALSE),
  ('m1b02222-2222-2222-2222-222222222222','w1b22222-2222-2222-2222-222222222222','c1111111-1111-1111-1111-111111111111','Data Cleaning & Quality','Missing values, duplicates, outliers.', NULL, 55,  6, FALSE),
  ('m1b03333-3333-3333-3333-333333333333','w1b22222-2222-2222-2222-222222222222','c1111111-1111-1111-1111-111111111111','Exploratory Data Analysis','EDA workflow and insight extraction.', NULL, 55,  7, FALSE),
  ('m1b04444-4444-4444-4444-444444444444','w1b22222-2222-2222-2222-222222222222','c1111111-1111-1111-1111-111111111111','Statistics for Data Analysis','Hypothesis testing, A/B testing.', NULL, 70,  8, FALSE),
  ('m1c01111-1111-1111-1111-111111111111','w1c33333-3333-3333-3333-333333333333','c1111111-1111-1111-1111-111111111111','Matplotlib & Seaborn Visualization','Charts: histograms, scatter, heatmaps.', NULL, 50,  9, FALSE),
  ('m1c02222-2222-2222-2222-222222222222','w1c33333-3333-3333-3333-333333333333','c1111111-1111-1111-1111-111111111111','Tableau Fundamentals','Interactive dashboards in Tableau.', NULL, 60, 10, FALSE),
  ('m1c03333-3333-3333-3333-333333333333','w1c33333-3333-3333-3333-333333333333','c1111111-1111-1111-1111-111111111111','Capstone: Sales Analytics Dashboard','End-to-end dashboard from a real dataset.', NULL, 90, 11, FALSE),
  ('m1c04444-4444-4444-4444-444444444444','w1c33333-3333-3333-3333-333333333333','c1111111-1111-1111-1111-111111111111','Storytelling with Data','Pyramid Principle and MECE.', NULL, 45, 12, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Course 2 — AI & ML (14 modules)
INSERT INTO modules (id, week_id, course_id, title, description, video_url, duration_minutes, order_index, is_free) VALUES
  ('m2a01111-1111-1111-1111-111111111111','w2a11111-1111-1111-1111-111111111111','c2222222-2222-2222-2222-222222222222','Introduction to Machine Learning','Supervised vs unsupervised, the ML pipeline.', NULL, 50,  1, TRUE),
  ('m2a02222-2222-2222-2222-222222222222','w2a11111-1111-1111-1111-111111111111','c2222222-2222-2222-2222-222222222222','Data Preprocessing for ML','Feature engineering, encoding, CV.', NULL, 55,  2, FALSE),
  ('m2a03333-3333-3333-3333-333333333333','w2a11111-1111-1111-1111-111111111111','c2222222-2222-2222-2222-222222222222','Linear & Logistic Regression','Gradient descent, L1/L2 regularisation.', NULL, 65,  3, FALSE),
  ('m2b01111-1111-1111-1111-111111111111','w2b22222-2222-2222-2222-222222222222','c2222222-2222-2222-2222-222222222222','Decision Trees & Random Forests','Gini, bagging, boosting, importance.', NULL, 60,  4, FALSE),
  ('m2b02222-2222-2222-2222-222222222222','w2b22222-2222-2222-2222-222222222222','c2222222-2222-2222-2222-222222222222','SVM & KNN','Kernel trick, hyperparameter tuning.', NULL, 55,  5, FALSE),
  ('m2b03333-3333-3333-3333-333333333333','w2b22222-2222-2222-2222-222222222222','c2222222-2222-2222-2222-222222222222','Model Evaluation & Tuning','Confusion matrix, ROC-AUC, GridSearchCV.', NULL, 70,  6, FALSE),
  ('m2b04444-4444-4444-4444-444444444444','w2b22222-2222-2222-2222-222222222222','c2222222-2222-2222-2222-222222222222','Clustering & Dim. Reduction','K-Means, DBSCAN, PCA, t-SNE.', NULL, 60,  7, FALSE),
  ('m2c01111-1111-1111-1111-111111111111','w2c33333-3333-3333-3333-333333333333','c2222222-2222-2222-2222-222222222222','Neural Network Fundamentals','Perceptrons, backprop, MLPs from scratch.', NULL, 75,  8, FALSE),
  ('m2c02222-2222-2222-2222-222222222222','w2c33333-3333-3333-3333-333333333333','c2222222-2222-2222-2222-222222222222','PyTorch in Practice','Tensors, autograd, training loops.', NULL, 80,  9, FALSE),
  ('m2c03333-3333-3333-3333-333333333333','w2c33333-3333-3333-3333-333333333333','c2222222-2222-2222-2222-222222222222','Convolutional Neural Networks','Conv2D, pooling, ResNet, transfer learning.', NULL, 85, 10, FALSE),
  ('m2c04444-4444-4444-4444-444444444444','w2c33333-3333-3333-3333-333333333333','c2222222-2222-2222-2222-222222222222','Recurrent Networks & LSTMs','Sequence modelling, GRUs, time-series.', NULL, 75, 11, FALSE),
  ('m2d01111-1111-1111-1111-111111111111','w2d44444-4444-4444-4444-444444444444','c2222222-2222-2222-2222-222222222222','NLP: Text Classification','Tokenization, TF-IDF, BERT fine-tuning.', NULL, 80, 12, FALSE),
  ('m2d02222-2222-2222-2222-222222222222','w2d44444-4444-4444-4444-444444444444','c2222222-2222-2222-2222-222222222222','Computer Vision Projects','YOLO and Mask R-CNN.', NULL, 90, 13, FALSE),
  ('m2d03333-3333-3333-3333-333333333333','w2d44444-4444-4444-4444-444444444444','c2222222-2222-2222-2222-222222222222','ML in Production','FastAPI, Docker, CI/CD for ML.', NULL, 70, 14, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Course 3 — Automation (8 modules)
INSERT INTO modules (id, week_id, course_id, title, description, video_url, duration_minutes, order_index, is_free) VALUES
  ('m3a01111-1111-1111-1111-111111111111','w3a11111-1111-1111-1111-111111111111','c3333333-3333-3333-3333-333333333333','Python Scripting for Automation','Files, schedulers, subprocess.', NULL, 45, 1, TRUE),
  ('m3a02222-2222-2222-2222-222222222222','w3a11111-1111-1111-1111-111111111111','c3333333-3333-3333-3333-333333333333','Web Scraping','BeautifulSoup & Selenium.', NULL, 60, 2, FALSE),
  ('m3a03333-3333-3333-3333-333333333333','w3a11111-1111-1111-1111-111111111111','c3333333-3333-3333-3333-333333333333','REST APIs & Integration','requests, auth, JSON.', NULL, 50, 3, FALSE),
  ('m3a04444-4444-4444-4444-444444444444','w3a11111-1111-1111-1111-111111111111','c3333333-3333-3333-3333-333333333333','Automating Sheets & Email','gspread, Gmail API, SMTP.', NULL, 55, 4, FALSE),
  ('m3b01111-1111-1111-1111-111111111111','w3b22222-2222-2222-2222-222222222222','c3333333-3333-3333-3333-333333333333','n8n No-Code Automation','Visual workflows.', NULL, 65, 5, FALSE),
  ('m3b02222-2222-2222-2222-222222222222','w3b22222-2222-2222-2222-222222222222','c3333333-3333-3333-3333-333333333333','LLM API Integration','OpenAI, Claude, Gemini.', NULL, 60, 6, FALSE),
  ('m3b03333-3333-3333-3333-333333333333','w3b22222-2222-2222-2222-222222222222','c3333333-3333-3333-3333-333333333333','Building AI Chatbots','WhatsApp/Slack bots with memory.', NULL, 70, 7, FALSE),
  ('m3b04444-4444-4444-4444-444444444444','w3b22222-2222-2222-2222-222222222222','c3333333-3333-3333-3333-333333333333','Capstone: Report Generator','Daily PDF report system.', NULL, 90, 8, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Course 4 — AI Agents (10 modules)
INSERT INTO modules (id, week_id, course_id, title, description, video_url, duration_minutes, order_index, is_free) VALUES
  ('m4a01111-1111-1111-1111-111111111111','w4a11111-1111-1111-1111-111111111111','c4444444-4444-4444-4444-444444444444','What Are AI Agents?','ReAct loop, tool use, memory.', NULL, 45,  1, TRUE),
  ('m4a02222-2222-2222-2222-222222222222','w4a11111-1111-1111-1111-111111111111','c4444444-4444-4444-4444-444444444444','LangChain Fundamentals','Chains, prompts, agents, tools.', NULL, 70,  2, FALSE),
  ('m4a03333-3333-3333-3333-333333333333','w4a11111-1111-1111-1111-111111111111','c4444444-4444-4444-4444-444444444444','Vector Databases & Embeddings','Pinecone, Chroma, FAISS.', NULL, 65,  3, FALSE),
  ('m4a04444-4444-4444-4444-444444444444','w4a11111-1111-1111-1111-111111111111','c4444444-4444-4444-4444-444444444444','RAG: Retrieval Augmented Gen.','Document Q&A pipelines.', NULL, 80,  4, FALSE),
  ('m4a05555-5555-5555-5555-555555555555','w4a11111-1111-1111-1111-111111111111','c4444444-4444-4444-4444-444444444444','Tool-Using Agents','Function calling in practice.', NULL, 75,  5, FALSE),
  ('m4b01111-1111-1111-1111-111111111111','w4b22222-2222-2222-2222-222222222222','c4444444-4444-4444-4444-444444444444','Multi-Agent Systems','CrewAI, AutoGen, orchestration.', NULL, 85,  6, FALSE),
  ('m4b02222-2222-2222-2222-222222222222','w4b22222-2222-2222-2222-222222222222','c4444444-4444-4444-4444-444444444444','Agent Memory & Persistence','Short/long/episodic memory.', NULL, 70,  7, FALSE),
  ('m4b03333-3333-3333-3333-333333333333','w4b22222-2222-2222-2222-222222222222','c4444444-4444-4444-4444-444444444444','Guardrails & Safety','Prompt injection, validation.', NULL, 60,  8, FALSE),
  ('m4b04444-4444-4444-4444-444444444444','w4b22222-2222-2222-2222-222222222222','c4444444-4444-4444-4444-444444444444','Deploying Agents to Production','FastAPI, LangServe, monitoring.', NULL, 80,  9, FALSE),
  ('m4b05555-5555-5555-5555-555555555555','w4b22222-2222-2222-2222-222222222222','c4444444-4444-4444-4444-444444444444','Capstone: BI Agent','Reads DB, answers, reports.', NULL,120, 10, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RESOURCES
-- ============================================================

INSERT INTO resources (id, module_id, title, file_url, type) VALUES
  ('r1111111-1111-1111-1111-111111111111','m1b03333-3333-3333-3333-333333333333','EDA Cheat Sheet (PDF)',     'https://example.com/eda-cheatsheet.pdf', 'pdf'),
  ('r2222222-2222-2222-2222-222222222222','m1b03333-3333-3333-3333-333333333333','Dataset: Sales Analytics',  'https://example.com/sales-dataset.zip',   'code'),
  ('r3333333-3333-3333-3333-333333333333','m1b03333-3333-3333-3333-333333333333','Pandas Documentation',      'https://pandas.pydata.org/docs/',         'link'),
  ('r4444444-4444-4444-4444-444444444444','m1a03333-3333-3333-3333-333333333333','SQL Reference Guide (PDF)', 'https://example.com/sql-guide.pdf',       'pdf'),
  ('r5555555-5555-5555-5555-555555555555','m1a03333-3333-3333-3333-333333333333','Practice Dataset',          'https://example.com/ecommerce.csv',       'code'),
  ('r6666666-6666-6666-6666-666666666666','m1b04444-4444-4444-4444-444444444444','Statistics Flashcards',     'https://example.com/stats-flashcards.pdf','pdf'),
  ('r7777777-7777-7777-7777-777777777777','m1c02222-2222-2222-2222-222222222222','Tableau Public',            'https://public.tableau.com/',             'link')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- QUIZZES & QUESTIONS
-- ============================================================

INSERT INTO quizzes (id, module_id, title) VALUES
  ('qz111111-1111-1111-1111-111111111111','m1a01111-1111-1111-1111-111111111111','Python Basics Check'),
  ('qz222222-2222-2222-2222-222222222222','m1b03333-3333-3333-3333-333333333333','EDA Fundamentals Quiz'),
  ('qz333333-3333-3333-3333-333333333333','m1a03333-3333-3333-3333-333333333333','SQL Fundamentals Quiz'),
  ('qz444444-4444-4444-4444-444444444444','m2a01111-1111-1111-1111-111111111111','ML Concepts Check')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (id, quiz_id, body, options, correct_index, explanation) VALUES
  ('qq111111-aaaa-1111-1111-111111111111','qz111111-1111-1111-1111-111111111111','Which data structure in Python is ordered, mutable, and allows duplicates?', '["Tuple","Set","List","Dictionary"]'::jsonb, 2, 'Lists are ordered, mutable, allow duplicates.'),
  ('qq111111-bbbb-1111-1111-111111111111','qz111111-1111-1111-1111-111111111111','What does range(5) produce?',                                                 '["[1,2,3,4,5]","[0,1,2,3,4]","[0,1,2,3,4,5]","Error"]'::jsonb, 1, 'range(5) produces 0..4.'),
  ('qq111111-cccc-1111-1111-111111111111','qz111111-1111-1111-1111-111111111111','Which keyword defines a function?',                                          '["function","def","fn","lambda"]'::jsonb, 1, 'def defines a function.'),
  ('qq111111-dddd-1111-1111-111111111111','qz111111-1111-1111-1111-111111111111','Output of print(type({}))?',                                                 '["<class ''list''>","<class ''set''>","<class ''dict''>","<class ''tuple''>"]'::jsonb, 2, '{} is an empty dict.'),
  ('qq222222-aaaa-2222-2222-222222222222','qz222222-2222-2222-2222-222222222222','Primary library for data manipulation?',                                     '["NumPy","Pandas","Matplotlib","Scikit-learn"]'::jsonb, 1, 'Pandas provides DataFrames.'),
  ('qq222222-bbbb-2222-2222-222222222222','qz222222-2222-2222-2222-222222222222','What does EDA stand for?',                                                   '["Exploratory Data Analysis","Extended Data Algorithm","Efficient Data Aggregation","Experimental Design Approach"]'::jsonb, 0, 'Exploratory Data Analysis.'),
  ('qq222222-cccc-2222-2222-222222222222','qz222222-2222-2222-2222-222222222222','Which Pandas function shows mean/std/quartiles?',                            '["df.info()","df.head()","df.describe()","df.summary()"]'::jsonb, 2, 'df.describe() gives stats.'),
  ('qq222222-dddd-2222-2222-222222222222','qz222222-2222-2222-2222-222222222222','How to check for missing values?',                                           '["df.missing()","df.isnull().sum()","df.nulls()","df.na_count()"]'::jsonb, 1, 'df.isnull().sum() returns null counts.'),
  ('qq333333-aaaa-3333-3333-333333333333','qz333333-3333-3333-3333-333333333333','Which clause filters rows after grouping?',                                  '["WHERE","HAVING","FILTER","LIMIT"]'::jsonb, 1, 'HAVING filters after GROUP BY.'),
  ('qq333333-bbbb-3333-3333-333333333333','qz333333-3333-3333-3333-333333333333','JOIN that returns all rows from both tables?',                               '["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN"]'::jsonb, 3, 'FULL OUTER JOIN returns all rows.'),
  ('qq333333-cccc-3333-3333-333333333333','qz333333-3333-3333-3333-333333333333','Which function counts all rows including NULLs?',                            '["COUNT(column)","COUNT(*)","SUM(*)","TOTAL(*)"]'::jsonb, 1, 'COUNT(*) counts all rows.'),
  ('qq444444-aaaa-4444-4444-444444444444','qz444444-4444-4444-4444-444444444444','Model memorises training, fails on new data:',                               '["Underfitting","Overfitting","High bias","Data leakage"]'::jsonb, 1, 'Overfitting.'),
  ('qq444444-bbbb-4444-4444-444444444444','qz444444-4444-4444-4444-444444444444','Which is unsupervised?',                                                     '["Linear Regression","Random Forest","K-Means Clustering","Logistic Regression"]'::jsonb, 2, 'K-Means is unsupervised.'),
  ('qq444444-cccc-4444-4444-444444444444','qz444444-4444-4444-4444-444444444444','Purpose of a validation set?',                                               '["Train the model","Tune hyperparameters","Report final performance","Store raw data"]'::jsonb, 1, 'Validation tunes hyperparameters.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- COHORT (must exist before profiles reference it)
-- ============================================================

INSERT INTO cohorts (id, course_id, instructor_id, name, start_date, end_date) VALUES
  ('c0c0c0c0-0000-0000-0000-000000000001','c1111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222',
   'Cohort 12 — Data Analytics (May 2026)', '2026-04-20', '2026-07-20')
ON CONFLICT (id) DO NOTHING;

UPDATE profiles SET cohort_id = 'c0c0c0c0-0000-0000-0000-000000000001'
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '3a111111-1111-1111-1111-111111111111','3a222222-2222-2222-2222-222222222222',
  '3a333333-3333-3333-3333-333333333333','3a444444-4444-4444-4444-444444444444',
  '3a555555-5555-5555-5555-555555555555','3a666666-6666-6666-6666-666666666666',
  '3a777777-7777-7777-7777-777777777777','3a888888-8888-8888-8888-888888888888'
);

-- ============================================================
-- ENROLLMENTS
-- ============================================================

INSERT INTO enrollments (student_id, course_id, status) VALUES
  ('11111111-1111-1111-1111-111111111111','c1111111-1111-1111-1111-111111111111','active'),
  ('3a111111-1111-1111-1111-111111111111','c1111111-1111-1111-1111-111111111111','active'),
  ('3a222222-2222-2222-2222-222222222222','c1111111-1111-1111-1111-111111111111','active'),
  ('3a333333-3333-3333-3333-333333333333','c1111111-1111-1111-1111-111111111111','active'),
  ('3a444444-4444-4444-4444-444444444444','c1111111-1111-1111-1111-111111111111','active'),
  ('3a555555-5555-5555-5555-555555555555','c1111111-1111-1111-1111-111111111111','active'),
  ('3a666666-6666-6666-6666-666666666666','c1111111-1111-1111-1111-111111111111','active'),
  ('3a777777-7777-7777-7777-777777777777','c1111111-1111-1111-1111-111111111111','active'),
  ('3a888888-8888-8888-8888-888888888888','c1111111-1111-1111-1111-111111111111','active')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO cohort_enrollments (cohort_id, student_id) VALUES
  ('c0c0c0c0-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111'),
  ('c0c0c0c0-0000-0000-0000-000000000001','3a111111-1111-1111-1111-111111111111'),
  ('c0c0c0c0-0000-0000-0000-000000000001','3a222222-2222-2222-2222-222222222222'),
  ('c0c0c0c0-0000-0000-0000-000000000001','3a333333-3333-3333-3333-333333333333'),
  ('c0c0c0c0-0000-0000-0000-000000000001','3a444444-4444-4444-4444-444444444444'),
  ('c0c0c0c0-0000-0000-0000-000000000001','3a555555-5555-5555-5555-555555555555'),
  ('c0c0c0c0-0000-0000-0000-000000000001','3a666666-6666-6666-6666-666666666666'),
  ('c0c0c0c0-0000-0000-0000-000000000001','3a777777-7777-7777-7777-777777777777'),
  ('c0c0c0c0-0000-0000-0000-000000000001','3a888888-8888-8888-8888-888888888888')
ON CONFLICT (cohort_id, student_id) DO NOTHING;

-- ============================================================
-- STREAKS, PROGRESS, QUIZ ATTEMPTS
-- ============================================================

INSERT INTO streaks (student_id, current_streak, longest_streak, last_activity_date) VALUES
  ('11111111-1111-1111-1111-111111111111',12,18, CURRENT_DATE),
  ('3a111111-1111-1111-1111-111111111111',10,15, CURRENT_DATE - 1),
  ('3a222222-2222-2222-2222-222222222222', 2, 7, CURRENT_DATE - 6),
  ('3a333333-3333-3333-3333-333333333333', 4, 9, CURRENT_DATE - 3),
  ('3a444444-4444-4444-4444-444444444444',14,20, CURRENT_DATE),
  ('3a555555-5555-5555-5555-555555555555', 1, 5, CURRENT_DATE - 8),
  ('3a666666-6666-6666-6666-666666666666', 7,11, CURRENT_DATE - 1),
  ('3a777777-7777-7777-7777-777777777777', 3, 8, CURRENT_DATE - 4),
  ('3a888888-8888-8888-8888-888888888888', 9,12, CURRENT_DATE)
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO module_progress (student_id, module_id, completed, completed_at, last_viewed_at) VALUES
  ('11111111-1111-1111-1111-111111111111','m1a01111-1111-1111-1111-111111111111',TRUE,  NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('11111111-1111-1111-1111-111111111111','m1a02222-2222-2222-2222-222222222222',TRUE,  NOW() - INTERVAL '9 days',  NOW() - INTERVAL '9 days'),
  ('11111111-1111-1111-1111-111111111111','m1a03333-3333-3333-3333-333333333333',TRUE,  NOW() - INTERVAL '7 days',  NOW() - INTERVAL '7 days'),
  ('11111111-1111-1111-1111-111111111111','m1a04444-4444-4444-4444-444444444444',TRUE,  NOW() - INTERVAL '5 days',  NOW() - INTERVAL '5 days'),
  ('11111111-1111-1111-1111-111111111111','m1b01111-1111-1111-1111-111111111111',TRUE,  NOW() - INTERVAL '3 days',  NOW() - INTERVAL '3 days'),
  ('11111111-1111-1111-1111-111111111111','m1b02222-2222-2222-2222-222222222222',FALSE, NULL,                       NOW() - INTERVAL '1 day'),
  ('3a111111-1111-1111-1111-111111111111','m1a01111-1111-1111-1111-111111111111',TRUE,  NOW() - INTERVAL '8 days',  NOW() - INTERVAL '8 days'),
  ('3a111111-1111-1111-1111-111111111111','m1a02222-2222-2222-2222-222222222222',TRUE,  NOW() - INTERVAL '6 days',  NOW() - INTERVAL '6 days'),
  ('3a111111-1111-1111-1111-111111111111','m1a03333-3333-3333-3333-333333333333',TRUE,  NOW() - INTERVAL '4 days',  NOW() - INTERVAL '4 days'),
  ('3a222222-2222-2222-2222-222222222222','m1a01111-1111-1111-1111-111111111111',TRUE,  NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
  ('3a333333-3333-3333-3333-333333333333','m1a01111-1111-1111-1111-111111111111',TRUE,  NOW() - INTERVAL '9 days',  NOW() - INTERVAL '9 days'),
  ('3a333333-3333-3333-3333-333333333333','m1a02222-2222-2222-2222-222222222222',TRUE,  NOW() - INTERVAL '6 days',  NOW() - INTERVAL '6 days'),
  ('3a444444-4444-4444-4444-444444444444','m1a01111-1111-1111-1111-111111111111',TRUE,  NOW() - INTERVAL '5 days',  NOW() - INTERVAL '5 days'),
  ('3a444444-4444-4444-4444-444444444444','m1a02222-2222-2222-2222-222222222222',TRUE,  NOW() - INTERVAL '3 days',  NOW() - INTERVAL '3 days'),
  ('3a444444-4444-4444-4444-444444444444','m1a03333-3333-3333-3333-333333333333',TRUE,  NOW() - INTERVAL '2 days',  NOW() - INTERVAL '2 days'),
  ('3a444444-4444-4444-4444-444444444444','m1a04444-4444-4444-4444-444444444444',TRUE,  NOW() - INTERVAL '1 day',   NOW() - INTERVAL '1 day'),
  ('3a666666-6666-6666-6666-666666666666','m1a01111-1111-1111-1111-111111111111',TRUE,  NOW() - INTERVAL '3 days',  NOW() - INTERVAL '3 days'),
  ('3a666666-6666-6666-6666-666666666666','m1a02222-2222-2222-2222-222222222222',TRUE,  NOW() - INTERVAL '2 days',  NOW() - INTERVAL '2 days')
ON CONFLICT (student_id, module_id) DO NOTHING;

INSERT INTO quiz_attempts (id, student_id, quiz_id, answers, score, passed, attempted_at) VALUES
  ('qa111111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111','qz111111-1111-1111-1111-111111111111',
   '{"qq111111-aaaa-1111-1111-111111111111":2,"qq111111-bbbb-1111-1111-111111111111":1,"qq111111-cccc-1111-1111-111111111111":1,"qq111111-dddd-1111-1111-111111111111":2}'::jsonb,
   100, TRUE, NOW() - INTERVAL '9 days'),
  ('qa222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','qz333333-3333-3333-3333-333333333333',
   '{"qq333333-aaaa-3333-3333-333333333333":1,"qq333333-bbbb-3333-3333-333333333333":3,"qq333333-cccc-3333-3333-333333333333":1}'::jsonb,
   100, TRUE, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- AI INSIGHTS, CHAT, AT-RISK, CERTIFICATES, SKILLS, ACTIVITY
-- ============================================================

INSERT INTO ai_insights (id, student_id, insight_text, type) VALUES
  ('a1111111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111','You are excelling at SQL — your quiz score of 100% puts you in the top 5% of the cohort.', 'recommendation'),
  ('a2222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','Your pace slowed in the Pandas module. A 30-minute session today would put you back on track.', 'warning'),
  ('a3333333-3333-3333-3333-333333333333','11111111-1111-1111-1111-111111111111','12-day streak! You are in the top 8% of Cohort 12.', 'encouragement')
ON CONFLICT (id) DO NOTHING;

INSERT INTO chat_sessions (id, student_id, title) VALUES
  ('cs111111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111','Exploratory Data Analysis'),
  ('cs222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','SQL Window Functions')
ON CONFLICT (id) DO NOTHING;

INSERT INTO chat_messages (id, student_id, session_id, role, content, created_at) VALUES
  ('cb111111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111','cs111111-1111-1111-1111-111111111111','assistant','Hi! I''m atombot. What would you like to explore in EDA today?', NOW() - INTERVAL '3 days'),
  ('cb222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','cs111111-1111-1111-1111-111111111111','user','What''s the difference between df.describe() and df.info()?', NOW() - INTERVAL '3 days' + INTERVAL '1 minute'),
  ('cb333333-3333-3333-3333-333333333333','11111111-1111-1111-1111-111111111111','cs111111-1111-1111-1111-111111111111','assistant','df.describe() gives statistical summaries; df.info() shows dtypes and non-null counts.', NOW() - INTERVAL '3 days' + INTERVAL '2 minutes'),
  ('cb444444-4444-4444-4444-444444444444','11111111-1111-1111-1111-111111111111','cs111111-1111-1111-1111-111111111111','user','How do I handle missing values in a dataset?', NOW() - INTERVAL '3 days' + INTERVAL '5 minutes'),
  ('cb555555-5555-5555-5555-555555555555','11111111-1111-1111-1111-111111111111','cs111111-1111-1111-1111-111111111111','assistant','Use df.isnull().sum() to find them; df.dropna() or df.fillna(...) to handle them.', NOW() - INTERVAL '3 days' + INTERVAL '6 minutes'),
  ('cb666666-6666-6666-6666-666666666666','11111111-1111-1111-1111-111111111111','cs222222-2222-2222-2222-222222222222','user','Can you explain SQL window functions with an example?', NOW() - INTERVAL '1 day'),
  ('cb777777-7777-7777-7777-777777777777','11111111-1111-1111-1111-111111111111','cs222222-2222-2222-2222-222222222222','assistant','RANK() OVER (PARTITION BY dept ORDER BY salary DESC) ranks rows within each group without collapsing them.', NOW() - INTERVAL '1 day' + INTERVAL '1 minute')
ON CONFLICT (id) DO NOTHING;

INSERT INTO at_risk_flags (student_id, cohort_id, risk_level, reason, flagged_at, resolved) VALUES
  ('3a222222-2222-2222-2222-222222222222','c0c0c0c0-0000-0000-0000-000000000001','high','Inactive for 6 days. Only 1 module completed.', NOW() - INTERVAL '1 day', FALSE),
  ('3a333333-3333-3333-3333-333333333333','c0c0c0c0-0000-0000-0000-000000000001','medium','No activity in 3 days.', NOW() - INTERVAL '2 days', FALSE),
  ('3a555555-5555-5555-5555-555555555555','c0c0c0c0-0000-0000-0000-000000000001','high','No activity in 8 days. Zero quiz attempts.', NOW() - INTERVAL '3 days', FALSE)
ON CONFLICT (student_id, cohort_id) DO NOTHING;

INSERT INTO certificates (student_id, course_id, issued_at, pdf_url) VALUES
  ('11111111-1111-1111-1111-111111111111','c1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '40 days', 'https://example.com/certificates/ahmed-data-analytics.pdf')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO skill_scores (student_id, skill, score) VALUES
  ('11111111-1111-1111-1111-111111111111','Python',       72),
  ('11111111-1111-1111-1111-111111111111','Statistics',   55),
  ('11111111-1111-1111-1111-111111111111','ML',           48),
  ('11111111-1111-1111-1111-111111111111','Deep Learning',30),
  ('11111111-1111-1111-1111-111111111111','Data Viz',     68),
  ('11111111-1111-1111-1111-111111111111','SQL',          81)
ON CONFLICT (student_id, skill) DO NOTHING;

INSERT INTO activity_log (id, student_id, action, metadata, created_at) VALUES
  ('ab101111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111','module_view',  '{"duration_minutes":45,"module_id":"m1a01111-1111-1111-1111-111111111111"}'::jsonb, NOW() - INTERVAL '10 days'),
  ('ab102222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','module_view',  '{"duration_minutes":40,"module_id":"m1a02222-2222-2222-2222-222222222222"}'::jsonb, NOW() - INTERVAL '9 days'),
  ('ab103333-3333-3333-3333-333333333333','11111111-1111-1111-1111-111111111111','quiz_attempt', '{"quiz_id":"qz111111-1111-1111-1111-111111111111","score":100}'::jsonb,             NOW() - INTERVAL '9 days'),
  ('ab104444-4444-4444-4444-444444444444','11111111-1111-1111-1111-111111111111','module_view',  '{"duration_minutes":50,"module_id":"m1a03333-3333-3333-3333-333333333333"}'::jsonb, NOW() - INTERVAL '7 days'),
  ('ab105555-5555-5555-5555-555555555555','11111111-1111-1111-1111-111111111111','quiz_attempt', '{"quiz_id":"qz333333-3333-3333-3333-333333333333","score":100}'::jsonb,             NOW() - INTERVAL '6 days'),
  ('ab106666-6666-6666-6666-666666666666','11111111-1111-1111-1111-111111111111','module_view',  '{"duration_minutes":60,"module_id":"m1a04444-4444-4444-4444-444444444444"}'::jsonb, NOW() - INTERVAL '5 days'),
  ('ab107777-7777-7777-7777-777777777777','11111111-1111-1111-1111-111111111111','chat_message', '{"session_id":"cs111111-1111-1111-1111-111111111111"}'::jsonb,                      NOW() - INTERVAL '3 days'),
  ('ab108888-8888-8888-8888-888888888888','11111111-1111-1111-1111-111111111111','module_view',  '{"duration_minutes":65,"module_id":"m1b01111-1111-1111-1111-111111111111"}'::jsonb, NOW() - INTERVAL '3 days'),
  ('ab109999-9999-9999-9999-999999999999','11111111-1111-1111-1111-111111111111','module_view',  '{"duration_minutes":30,"module_id":"m1b02222-2222-2222-2222-222222222222"}'::jsonb, NOW() - INTERVAL '1 day'),
  ('ab100001-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','chat_message', '{"session_id":"cs222222-2222-2222-2222-222222222222"}'::jsonb,                      NOW() - INTERVAL '1 day'),
  ('ab200001-0000-0000-0000-000000000001','3a222222-2222-2222-2222-222222222222','module_view',  '{"duration_minutes":30}'::jsonb,                                                    NOW() - INTERVAL '8 days'),
  ('ab300001-0000-0000-0000-000000000001','3a444444-4444-4444-4444-444444444444','module_view',  '{"duration_minutes":50}'::jsonb,                                                    NOW() - INTERVAL '1 day'),
  ('ab400001-0000-0000-0000-000000000001','3a666666-6666-6666-6666-666666666666','module_view',  '{"duration_minutes":45}'::jsonb,                                                    NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- LIVE SESSIONS, AI RECOMMENDATIONS, COURSE DEADLINES
-- ============================================================

INSERT INTO live_sessions (id, cohort_id, title, starts_at, duration_minutes, instructor_id, participants_count, meeting_url) VALUES
  ('15111111-1111-1111-1111-111111111111','c0c0c0c0-0000-0000-0000-000000000001','EDA Deep Dive Workshop',                 NOW() + INTERVAL '3 hours', 90, '22222222-2222-2222-2222-222222222222', 14, 'https://meet.google.com/atomcamp-eda'),
  ('15222222-2222-2222-2222-222222222222','c0c0c0c0-0000-0000-0000-000000000001','SQL Window Functions Masterclass',       NOW() + INTERVAL '1 day',   90, '22222222-2222-2222-2222-222222222222', 45, 'https://meet.google.com/atomcamp-sql'),
  ('15333333-3333-3333-3333-333333333333','c0c0c0c0-0000-0000-0000-000000000001','Pandas & Data Cleaning Q&A',             NOW() + INTERVAL '3 days',  60, '44444444-4444-4444-4444-444444444444',  8, 'https://meet.google.com/atomcamp-pandas'),
  ('15444444-4444-4444-4444-444444444444','c0c0c0c0-0000-0000-0000-000000000001','Career Prep: Data Analyst Job Market',   NOW() + INTERVAL '5 days',  60, '22222222-2222-2222-2222-222222222222', 62, 'https://meet.google.com/atomcamp-career')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ai_recommendations (id, cohort_id, text) VALUES
  ('a4111111-1111-1111-1111-111111111111','c0c0c0c0-0000-0000-0000-000000000001','3 students have not logged in for 6+ days. Send a re-engagement message.'),
  ('a4222222-2222-2222-2222-222222222222','c0c0c0c0-0000-0000-0000-000000000001','The SQL Fundamentals module shows a 40% drop-off rate.'),
  ('a4333333-3333-3333-3333-333333333333','c0c0c0c0-0000-0000-0000-000000000001','Top performers are ready for advanced projects.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO course_deadlines (id, course_id, title, due_at) VALUES
  ('cd111111-1111-1111-1111-111111111111','c1111111-1111-1111-1111-111111111111','Submit EDA Notebook (Module 7)', NOW() + INTERVAL '3 days'),
  ('cd222222-2222-2222-2222-222222222222','c1111111-1111-1111-1111-111111111111','Quiz: SQL Window Functions',     NOW() + INTERVAL '5 days'),
  ('cd333333-3333-3333-3333-333333333333','c1111111-1111-1111-1111-111111111111','Week 2 Self-Assessment',         NOW() + INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- ============================================================
-- VERIFY
-- ============================================================
SELECT 'profiles'        AS table_name, COUNT(*) FROM profiles
UNION ALL SELECT 'courses',            COUNT(*) FROM courses
UNION ALL SELECT 'weeks',              COUNT(*) FROM weeks
UNION ALL SELECT 'modules',            COUNT(*) FROM modules
UNION ALL SELECT 'resources',          COUNT(*) FROM resources
UNION ALL SELECT 'quizzes',            COUNT(*) FROM quizzes
UNION ALL SELECT 'questions',          COUNT(*) FROM questions
UNION ALL SELECT 'enrollments',        COUNT(*) FROM enrollments
UNION ALL SELECT 'cohorts',            COUNT(*) FROM cohorts
UNION ALL SELECT 'cohort_enrollments', COUNT(*) FROM cohort_enrollments
UNION ALL SELECT 'module_progress',    COUNT(*) FROM module_progress
UNION ALL SELECT 'quiz_attempts',      COUNT(*) FROM quiz_attempts
UNION ALL SELECT 'streaks',            COUNT(*) FROM streaks
UNION ALL SELECT 'chat_sessions',      COUNT(*) FROM chat_sessions
UNION ALL SELECT 'chat_messages',      COUNT(*) FROM chat_messages
UNION ALL SELECT 'ai_insights',        COUNT(*) FROM ai_insights
UNION ALL SELECT 'at_risk_flags',      COUNT(*) FROM at_risk_flags
UNION ALL SELECT 'certificates',       COUNT(*) FROM certificates
UNION ALL SELECT 'skill_scores',       COUNT(*) FROM skill_scores
UNION ALL SELECT 'activity_log',       COUNT(*) FROM activity_log
UNION ALL SELECT 'live_sessions',      COUNT(*) FROM live_sessions
UNION ALL SELECT 'ai_recommendations', COUNT(*) FROM ai_recommendations
UNION ALL SELECT 'course_deadlines',   COUNT(*) FROM course_deadlines;
