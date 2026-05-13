-- ============================================================
-- atomlearn seed data — full production-quality dataset
-- ============================================================

-- ============================================================
-- AUTH USERS: 3 instructors + 1 admin + demo student + 8 cohort students
-- ============================================================

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, raw_app_meta_data, created_at, updated_at
) VALUES
  (
    '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'ahmed@atomcamp.com',
    crypt('Password123!', gen_salt('bf')), NOW(),
    jsonb_build_object('full_name', 'Ahmed Malik', 'avatar_url', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'ayesha.khan@atomcamp.com',
    crypt('Password123!', gen_salt('bf')), NOW(),
    jsonb_build_object('full_name', 'Dr. Ayesha Khan', 'avatar_url', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'omar.farooq@atomcamp.com',
    crypt('Password123!', gen_salt('bf')), NOW(),
    jsonb_build_object('full_name', 'Dr. Omar Farooq', 'avatar_url', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'usman.tariq@atomcamp.com',
    crypt('Password123!', gen_salt('bf')), NOW(),
    jsonb_build_object('full_name', 'Usman Tariq', 'avatar_url', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()
  ),
  (
    '99999999-9999-9999-9999-999999999999', 'authenticated', 'authenticated', 'admin@atomcamp.com',
    crypt('Password123!', gen_salt('bf')), NOW(),
    jsonb_build_object('full_name', 'Admin', 'avatar_url', null),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider, identity_data, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'email', jsonb_build_object('sub', '11111111-1111-1111-1111-111111111111', 'email', 'ahmed@atomcamp.com'), NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'email', jsonb_build_object('sub', '22222222-2222-2222-2222-222222222222', 'email', 'ayesha.khan@atomcamp.com'), NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'email', jsonb_build_object('sub', '33333333-3333-3333-3333-333333333333', 'email', 'omar.farooq@atomcamp.com'), NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'email', jsonb_build_object('sub', '44444444-4444-4444-4444-444444444444', 'email', 'usman.tariq@atomcamp.com'), NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'email', jsonb_build_object('sub', '99999999-9999-9999-9999-999999999999', 'email', 'admin@atomcamp.com'), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Cohort students
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, raw_app_meta_data, created_at, updated_at
) VALUES
  ('3a111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'ali@atomcamp.com', crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name', 'Ali Hassan', 'avatar_url', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()),
  ('3a222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'fatima@atomcamp.com', crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name', 'Fatima Zahra', 'avatar_url', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()),
  ('3a333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'bilal@atomcamp.com', crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name', 'Bilal Ahmed', 'avatar_url', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()),
  ('3a444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'amna@atomcamp.com', crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name', 'Amna Siddiqui', 'avatar_url', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()),
  ('3a555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'hassan@atomcamp.com', crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name', 'Hassan Raza', 'avatar_url', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()),
  ('3a666666-6666-6666-6666-666666666666', 'authenticated', 'authenticated', 'zara@atomcamp.com', crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name', 'Zara Khan', 'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()),
  ('3a777777-7777-7777-7777-777777777777', 'authenticated', 'authenticated', 'imran@atomcamp.com', crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name', 'Imran Malik', 'avatar_url', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW()),
  ('3a888888-8888-8888-8888-888888888888', 'authenticated', 'authenticated', 'sana@atomcamp.com', crypt('Password123!', gen_salt('bf')), NOW(), jsonb_build_object('full_name', 'Sana Mir', 'avatar_url', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'), jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider, identity_data, created_at, updated_at) VALUES
  ('3a111111-1111-1111-1111-111111111111', '3a111111-1111-1111-1111-111111111111', 'email', jsonb_build_object('sub', '3a111111-1111-1111-1111-111111111111', 'email', 'ali@atomcamp.com'), NOW(), NOW()),
  ('3a222222-2222-2222-2222-222222222222', '3a222222-2222-2222-2222-222222222222', 'email', jsonb_build_object('sub', '3a222222-2222-2222-2222-222222222222', 'email', 'fatima@atomcamp.com'), NOW(), NOW()),
  ('3a333333-3333-3333-3333-333333333333', '3a333333-3333-3333-3333-333333333333', 'email', jsonb_build_object('sub', '3a333333-3333-3333-3333-333333333333', 'email', 'bilal@atomcamp.com'), NOW(), NOW()),
  ('3a444444-4444-4444-4444-444444444444', '3a444444-4444-4444-4444-444444444444', 'email', jsonb_build_object('sub', '3a444444-4444-4444-4444-444444444444', 'email', 'amna@atomcamp.com'), NOW(), NOW()),
  ('3a555555-5555-5555-5555-555555555555', '3a555555-5555-5555-5555-555555555555', 'email', jsonb_build_object('sub', '3a555555-5555-5555-5555-555555555555', 'email', 'hassan@atomcamp.com'), NOW(), NOW()),
  ('3a666666-6666-6666-6666-666666666666', '3a666666-6666-6666-6666-666666666666', 'email', jsonb_build_object('sub', '3a666666-6666-6666-6666-666666666666', 'email', 'zara@atomcamp.com'), NOW(), NOW()),
  ('3a777777-7777-7777-7777-777777777777', '3a777777-7777-7777-7777-777777777777', 'email', jsonb_build_object('sub', '3a777777-7777-7777-7777-777777777777', 'email', 'imran@atomcamp.com'), NOW(), NOW()),
  ('3a888888-8888-8888-8888-888888888888', '3a888888-8888-8888-8888-888888888888', 'email', jsonb_build_object('sub', '3a888888-8888-8888-8888-888888888888', 'email', 'sana@atomcamp.com'), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PROFILES: roles
-- ============================================================

UPDATE profiles SET role = 'student', onboarding_completed = TRUE, level = 'intermediate',
  notification_prefs = '{"email_sessions":true,"weekly_digest":true,"ai_recommendations":true,"new_courses":false}'
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE profiles SET role = 'instructor' WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE profiles SET role = 'instructor' WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE profiles SET role = 'instructor' WHERE id = '44444444-4444-4444-4444-444444444444';
UPDATE profiles SET role = 'admin'      WHERE id = '99999999-9999-9999-9999-999999999999';

-- ============================================================
-- COURSES (4 courses, all published)
-- ============================================================

INSERT INTO courses (id, title, description, level, price_pkr, duration_weeks, total_modules, instructor_id, thumbnail_url, rating, skills, is_published) VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'Data Analytics Bootcamp',
    'Master data analysis with Python, SQL, and visualization tools. Build real-world dashboards and reports that drive business decisions. Covers statistics, EDA, Pandas, Matplotlib, Seaborn, and Tableau.',
    'beginner', 50000, 12, 12,
    '22222222-2222-2222-2222-222222222222',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    4.8, ARRAY['Python', 'SQL', 'Tableau', 'Statistics', 'Excel', 'Pandas'], TRUE
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'AI & Machine Learning Bootcamp',
    'Go deep into machine learning and deep learning. Build neural networks, NLP models, and computer vision applications. From linear regression to transformers — full stack AI.',
    'intermediate', 75000, 14, 14,
    '33333333-3333-3333-3333-333333333333',
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop',
    4.9, ARRAY['ML', 'Deep Learning', 'PyTorch', 'NLP', 'Computer Vision', 'Scikit-learn'], TRUE
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'Automation with AI',
    'Automate repetitive tasks using Python scripts, AI APIs, and workflow automation tools like n8n and Make.com. Build bots, scrapers, and intelligent pipelines.',
    'intermediate', 35000, 6, 8,
    '44444444-4444-4444-4444-444444444444',
    'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop',
    4.7, ARRAY['Python', 'APIs', 'n8n', 'Zapier', 'LLMs', 'Web Scraping'], TRUE
  ),
  (
    'c4444444-4444-4444-4444-444444444444',
    'AI Agents for Business',
    'Design and deploy autonomous AI agents for business workflows. Build with LangChain, OpenAI, and vector databases. Create RAG pipelines, multi-agent systems, and production-grade deployments.',
    'advanced', 60000, 8, 10,
    '44444444-4444-4444-4444-444444444444',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
    4.9, ARRAY['LangChain', 'OpenAI API', 'Vector DBs', 'RAG', 'Agents', 'LlamaIndex'], TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- COURSE 1: DATA ANALYTICS BOOTCAMP — 3 weeks, 12 modules
-- ============================================================

INSERT INTO weeks (id, course_id, title, week_number) VALUES
  ('w1a11111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Python & SQL Foundations', 1),
  ('w1b22222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Data Wrangling & EDA',    2),
  ('w1c33333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Visualization & Reporting', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO modules (id, week_id, course_id, title, description, video_url, duration_minutes, order_index, is_free) VALUES
  ('m1a01111-1111-1111-1111-111111111111', 'w1a11111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111',
   'Python Crash Course for Analysts', 'Variables, lists, dicts, loops, and functions — everything you need to start working with data right away.', null, 45, 1, TRUE),
  ('m1a02222-2222-2222-2222-222222222222', 'w1a11111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111',
   'NumPy Essentials', 'Arrays, broadcasting, vectorized operations, and statistical functions with NumPy.', null, 40, 2, FALSE),
  ('m1a03333-3333-3333-3333-333333333333', 'w1a11111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111',
   'SQL Fundamentals', 'SELECT, WHERE, JOIN, GROUP BY, ORDER BY — query databases with confidence.', null, 50, 3, FALSE),
  ('m1a04444-4444-4444-4444-444444444444', 'w1a11111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111',
   'Advanced SQL & Window Functions', 'CTEs, subqueries, PARTITION BY, RANK, LAG/LEAD — the queries analysts actually use.', null, 60, 4, FALSE),

  ('m1b01111-1111-1111-1111-111111111111', 'w1b22222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111',
   'Pandas DataFrames Deep Dive', 'Read, filter, transform, merge, pivot — the complete Pandas workflow for real datasets.', null, 65, 5, FALSE),
  ('m1b02222-2222-2222-2222-222222222222', 'w1b22222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111',
   'Data Cleaning & Quality', 'Handle missing values, duplicates, outliers, and type mismatches in messy real-world data.', null, 55, 6, FALSE),
  ('m1b03333-3333-3333-3333-333333333333', 'w1b22222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111',
   'Exploratory Data Analysis', 'EDA workflow: distributions, correlations, feature relationships, and insights extraction.', null, 55, 7, FALSE),
  ('m1b04444-4444-4444-4444-444444444444', 'w1b22222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111',
   'Statistics for Data Analysis', 'Hypothesis testing, p-values, confidence intervals, and A/B testing for analysts.', null, 70, 8, FALSE),

  ('m1c01111-1111-1111-1111-111111111111', 'w1c33333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111',
   'Matplotlib & Seaborn Visualization', 'Create publication-quality charts: histograms, scatter plots, heatmaps, and box plots.', null, 50, 9, FALSE),
  ('m1c02222-2222-2222-2222-222222222222', 'w1c33333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111',
   'Tableau Fundamentals', 'Build interactive dashboards in Tableau: calculated fields, filters, parameters, and stories.', null, 60, 10, FALSE),
  ('m1c03333-3333-3333-3333-333333333333', 'w1c33333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111',
   'Capstone: Sales Analytics Dashboard', 'Build a full end-to-end sales analytics dashboard from a real retail dataset.', null, 90, 11, FALSE),
  ('m1c04444-4444-4444-4444-444444444444', 'w1c33333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111',
   'Storytelling with Data & Presentations', 'Present data insights persuasively to stakeholders using the Pyramid Principle and MECE framework.', null, 45, 12, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- COURSE 2: AI & ML BOOTCAMP — 4 weeks, 14 modules
-- ============================================================

INSERT INTO weeks (id, course_id, title, week_number) VALUES
  ('w2a11111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'ML Foundations',          1),
  ('w2b22222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Supervised Learning',     2),
  ('w2c33333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 'Neural Networks & DL',    3),
  ('w2d44444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222', 'NLP & Computer Vision',   4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO modules (id, week_id, course_id, title, description, video_url, duration_minutes, order_index, is_free) VALUES
  ('m2a01111-1111-1111-1111-111111111111', 'w2a11111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222',
   'Introduction to Machine Learning', 'Supervised vs unsupervised, bias-variance tradeoff, the ML pipeline from data to deployment.', null, 50, 1, TRUE),
  ('m2a02222-2222-2222-2222-222222222222', 'w2a11111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222',
   'Data Preprocessing for ML', 'Feature engineering, scaling, encoding, train-test split, and cross-validation.', null, 55, 2, FALSE),
  ('m2a03333-3333-3333-3333-333333333333', 'w2a11111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222',
   'Linear & Logistic Regression', 'Gradient descent, cost functions, regularisation (L1/L2), and interpreting coefficients.', null, 65, 3, FALSE),

  ('m2b01111-1111-1111-1111-111111111111', 'w2b22222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222',
   'Decision Trees & Random Forests', 'Information gain, Gini impurity, bagging, boosting, and feature importance.', null, 60, 4, FALSE),
  ('m2b02222-2222-2222-2222-222222222222', 'w2b22222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222',
   'SVM & KNN', 'Kernel trick, hyperparameter tuning, distance metrics, and choosing the right algorithm.', null, 55, 5, FALSE),
  ('m2b03333-3333-3333-3333-333333333333', 'w2b22222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222',
   'Model Evaluation & Tuning', 'Confusion matrix, ROC-AUC, precision/recall, GridSearchCV, and avoiding data leakage.', null, 70, 6, FALSE),
  ('m2b04444-4444-4444-4444-444444444444', 'w2b22222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222',
   'Clustering & Dimensionality Reduction', 'K-Means, DBSCAN, PCA, t-SNE — unsupervised learning in practice.', null, 60, 7, FALSE),

  ('m2c01111-1111-1111-1111-111111111111', 'w2c33333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222',
   'Neural Network Fundamentals', 'Perceptrons, activation functions, backpropagation, and building MLPs from scratch.', null, 75, 8, FALSE),
  ('m2c02222-2222-2222-2222-222222222222', 'w2c33333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222',
   'PyTorch in Practice', 'Tensors, autograd, DataLoaders, training loops, and saving/loading models.', null, 80, 9, FALSE),
  ('m2c03333-3333-3333-3333-333333333333', 'w2c33333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222',
   'Convolutional Neural Networks', 'Conv2D, pooling, batch norm, ResNet, transfer learning for image classification.', null, 85, 10, FALSE),
  ('m2c04444-4444-4444-4444-444444444444', 'w2c33333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222',
   'Recurrent Networks & LSTMs', 'Sequence modelling, vanishing gradients, LSTMs, GRUs, and time-series prediction.', null, 75, 11, FALSE),

  ('m2d01111-1111-1111-1111-111111111111', 'w2d44444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222',
   'NLP: Text Classification & Sentiment', 'Tokenization, TF-IDF, word embeddings, BERT fine-tuning for text tasks.', null, 80, 12, FALSE),
  ('m2d02222-2222-2222-2222-222222222222', 'w2d44444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222',
   'Computer Vision Projects', 'Build object detection and segmentation models with YOLO and Mask R-CNN.', null, 90, 13, FALSE),
  ('m2d03333-3333-3333-3333-333333333333', 'w2d44444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222',
   'ML in Production: Deployment', 'FastAPI, Docker, cloud deployment (AWS/GCP), model monitoring, and CI/CD for ML.', null, 70, 14, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- COURSE 3: AUTOMATION WITH AI — 2 weeks, 8 modules
-- ============================================================

INSERT INTO weeks (id, course_id, title, week_number) VALUES
  ('w3a11111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'Python Automation',      1),
  ('w3b22222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333', 'AI-Powered Workflows',   2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO modules (id, week_id, course_id, title, description, video_url, duration_minutes, order_index, is_free) VALUES
  ('m3a01111-1111-1111-1111-111111111111', 'w3a11111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333',
   'Python Scripting for Automation', 'Files, directories, schedulers, subprocess, and writing reusable automation scripts.', null, 45, 1, TRUE),
  ('m3a02222-2222-2222-2222-222222222222', 'w3a11111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333',
   'Web Scraping with BeautifulSoup & Selenium', 'Scrape static and dynamic websites, handle pagination, and store data.', null, 60, 2, FALSE),
  ('m3a03333-3333-3333-3333-333333333333', 'w3a11111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333',
   'REST APIs & Integration', 'Call any REST API with Python requests, handle auth, parse JSON, and chain APIs.', null, 50, 3, FALSE),
  ('m3a04444-4444-4444-4444-444444444444', 'w3a11111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333',
   'Automating Google Sheets & Email', 'Use gspread, Gmail API, and SMTP to build automated reporting pipelines.', null, 55, 4, FALSE),

  ('m3b01111-1111-1111-1111-111111111111', 'w3b22222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333',
   'n8n No-Code Automation', 'Build visual workflows in n8n: triggers, conditions, API calls, and error handling.', null, 65, 5, FALSE),
  ('m3b02222-2222-2222-2222-222222222222', 'w3b22222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333',
   'LLM API Integration', 'Call OpenAI, Claude, and Gemini APIs to add AI to any automation pipeline.', null, 60, 6, FALSE),
  ('m3b03333-3333-3333-3333-333333333333', 'w3b22222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333',
   'Building AI Chatbots & Assistants', 'Create WhatsApp and Slack bots with conversational memory using LLM APIs.', null, 70, 7, FALSE),
  ('m3b04444-4444-4444-4444-444444444444', 'w3b22222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333',
   'Capstone: Automated Report Generator', 'Build a system that pulls data, runs analysis, and emails a PDF report daily.', null, 90, 8, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- COURSE 4: AI AGENTS FOR BUSINESS — 2 weeks, 10 modules
-- ============================================================

INSERT INTO weeks (id, course_id, title, week_number) VALUES
  ('w4a11111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 'Agent Architecture',   1),
  ('w4b22222-2222-2222-2222-222222222222', 'c4444444-4444-4444-4444-444444444444', 'Production Agents',    2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO modules (id, week_id, course_id, title, description, video_url, duration_minutes, order_index, is_free) VALUES
  ('m4a01111-1111-1111-1111-111111111111', 'w4a11111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444',
   'What Are AI Agents?', 'Agents vs chatbots, ReAct loop, tool use, planning, memory — the agent architecture explained.', null, 45, 1, TRUE),
  ('m4a02222-2222-2222-2222-222222222222', 'w4a11111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444',
   'LangChain Fundamentals', 'Chains, prompts, memory, agents, tools, and output parsers in LangChain.', null, 70, 2, FALSE),
  ('m4a03333-3333-3333-3333-333333333333', 'w4a11111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444',
   'Vector Databases & Embeddings', 'Pinecone, Chroma, FAISS — store and retrieve semantic information for agents.', null, 65, 3, FALSE),
  ('m4a04444-4444-4444-4444-444444444444', 'w4a11111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444',
   'RAG: Retrieval Augmented Generation', 'Build a document Q&A agent: ingest PDFs, chunk, embed, and retrieve accurately.', null, 80, 4, FALSE),
  ('m4a05555-5555-5555-5555-555555555555', 'w4a11111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444',
   'Tool-Using Agents', 'Give agents tools: web search, code execution, calculators, APIs — function calling in practice.', null, 75, 5, FALSE),

  ('m4b01111-1111-1111-1111-111111111111', 'w4b22222-2222-2222-2222-222222222222', 'c4444444-4444-4444-4444-444444444444',
   'Multi-Agent Systems', 'Orchestrator-worker patterns, CrewAI, AutoGen — coordinate multiple specialised agents.', null, 85, 6, FALSE),
  ('m4b02222-2222-2222-2222-222222222222', 'w4b22222-2222-2222-2222-222222222222', 'c4444444-4444-4444-4444-444444444444',
   'Agent Memory & Persistence', 'Short-term, long-term, and episodic memory — making agents that remember across sessions.', null, 70, 7, FALSE),
  ('m4b03333-3333-3333-3333-333333333333', 'w4b22222-2222-2222-2222-222222222222', 'c4444444-4444-4444-4444-444444444444',
   'Guardrails & Safety', 'Prompt injection, hallucination detection, output validation, and responsible AI deployment.', null, 60, 8, FALSE),
  ('m4b04444-4444-4444-4444-444444444444', 'w4b22222-2222-2222-2222-222222222222', 'c4444444-4444-4444-4444-444444444444',
   'Deploying Agents to Production', 'FastAPI, LangServe, Dockerise an agent, add authentication, monitoring, and cost controls.', null, 80, 9, FALSE),
  ('m4b05555-5555-5555-5555-555555555555', 'w4b22222-2222-2222-2222-222222222222', 'c4444444-4444-4444-4444-444444444444',
   'Capstone: Business Intelligence Agent', 'Build an agent that reads your company database, answers questions, and generates reports.', null, 120, 10, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RESOURCES (Course 1 modules)
-- ============================================================

INSERT INTO resources (id, module_id, title, file_url, type) VALUES
  ('r1111111-1111-1111-1111-111111111111', 'm1b03333-3333-3333-3333-333333333333', 'EDA Cheat Sheet (PDF)', 'https://example.com/eda-cheatsheet.pdf', 'pdf'),
  ('r2222222-2222-2222-2222-222222222222', 'm1b03333-3333-3333-3333-333333333333', 'Dataset: Sales Analytics', 'https://example.com/sales-dataset.zip', 'code'),
  ('r3333333-3333-3333-3333-333333333333', 'm1b03333-3333-3333-3333-333333333333', 'Pandas Documentation', 'https://pandas.pydata.org/docs/', 'link'),
  ('r4444444-4444-4444-4444-444444444444', 'm1a03333-3333-3333-3333-333333333333', 'SQL Reference Guide (PDF)', 'https://example.com/sql-guide.pdf', 'pdf'),
  ('r5555555-5555-5555-5555-555555555555', 'm1a03333-3333-3333-3333-333333333333', 'Practice Dataset: E-commerce', 'https://example.com/ecommerce.csv', 'code'),
  ('r6666666-6666-6666-6666-666666666666', 'm1b04444-4444-4444-4444-444444444444', 'Statistics Flashcards', 'https://example.com/stats-flashcards.pdf', 'pdf'),
  ('r7777777-7777-7777-7777-777777777777', 'm1c02222-2222-2222-2222-222222222222', 'Tableau Public', 'https://public.tableau.com/', 'link')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- QUIZZES & QUESTIONS (one per module for Week 1 of Course 1)
-- ============================================================

-- Python Crash Course quiz
INSERT INTO quizzes (id, module_id, title) VALUES
  ('qz111111-1111-1111-1111-111111111111', 'm1a01111-1111-1111-1111-111111111111', 'Python Basics Check')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (id, quiz_id, body, options, correct_index, explanation) VALUES
  ('qq111111-aaaa-1111-1111-111111111111', 'qz111111-1111-1111-1111-111111111111',
   'Which data structure in Python is ordered, mutable, and allows duplicates?',
   '["Tuple", "Set", "List", "Dictionary"]', 2, 'Lists are ordered, mutable, and allow duplicate values.'),
  ('qq111111-bbbb-1111-1111-111111111111', 'qz111111-1111-1111-1111-111111111111',
   'What does the range(5) function produce?',
   '["[1,2,3,4,5]", "[0,1,2,3,4]", "[0,1,2,3,4,5]", "Error"]', 1, 'range(5) produces integers 0 through 4 (not including 5).'),
  ('qq111111-cccc-1111-1111-111111111111', 'qz111111-1111-1111-1111-111111111111',
   'Which keyword defines a function in Python?',
   '["function", "def", "fn", "lambda"]', 1, '"def" is the keyword used to define a function in Python.'),
  ('qq111111-dddd-1111-1111-111111111111', 'qz111111-1111-1111-1111-111111111111',
   'What is the output of: print(type({}))?',
   '["<class ''list''>", "<class ''set''>", "<class ''dict''>", "<class ''tuple''>"]', 2, '{} creates an empty dictionary in Python.')
ON CONFLICT (id) DO NOTHING;

-- EDA Quiz
INSERT INTO quizzes (id, module_id, title) VALUES
  ('qz222222-2222-2222-2222-222222222222', 'm1b03333-3333-3333-3333-333333333333', 'EDA Fundamentals Quiz')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (id, quiz_id, body, options, correct_index, explanation) VALUES
  ('qq222222-aaaa-2222-2222-222222222222', 'qz222222-2222-2222-2222-222222222222',
   'Which Python library is primarily used for data manipulation and analysis?',
   '["NumPy", "Pandas", "Matplotlib", "Scikit-learn"]', 1, 'Pandas provides DataFrame structures for data manipulation, cleaning, and analysis.'),
  ('qq222222-bbbb-2222-2222-222222222222', 'qz222222-2222-2222-2222-222222222222',
   'What does EDA stand for in data science?',
   '["Exploratory Data Analysis", "Extended Data Algorithm", "Efficient Data Aggregation", "Experimental Design Approach"]', 0,
   'EDA (Exploratory Data Analysis) is the process of analyzing datasets to summarize their main characteristics.'),
  ('qq222222-cccc-2222-2222-222222222222', 'qz222222-2222-2222-2222-222222222222',
   'Which Pandas function shows basic statistics like mean, std, and quartiles?',
   '["df.info()", "df.head()", "df.describe()", "df.summary()"]', 2, 'df.describe() generates descriptive statistics for numerical columns.'),
  ('qq222222-dddd-2222-2222-222222222222', 'qz222222-2222-2222-2222-222222222222',
   'How do you check for missing values in a Pandas DataFrame?',
   '["df.missing()", "df.isnull().sum()", "df.nulls()", "df.na_count()"]', 1, 'df.isnull().sum() returns the count of null values per column.')
ON CONFLICT (id) DO NOTHING;

-- SQL Quiz
INSERT INTO quizzes (id, module_id, title) VALUES
  ('qz333333-3333-3333-3333-333333333333', 'm1a03333-3333-3333-3333-333333333333', 'SQL Fundamentals Quiz')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (id, quiz_id, body, options, correct_index, explanation) VALUES
  ('qq333333-aaaa-3333-3333-333333333333', 'qz333333-3333-3333-3333-333333333333',
   'Which SQL clause filters rows after grouping?',
   '["WHERE", "HAVING", "FILTER", "LIMIT"]', 1, 'HAVING filters rows after GROUP BY aggregation; WHERE filters before.'),
  ('qq333333-bbbb-3333-3333-333333333333', 'qz333333-3333-3333-3333-333333333333',
   'What type of JOIN returns all rows from both tables?',
   '["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"]', 3, 'FULL OUTER JOIN returns all rows from both tables, with NULLs where there is no match.'),
  ('qq333333-cccc-3333-3333-333333333333', 'qz333333-3333-3333-3333-333333333333',
   'Which function counts all rows including NULLs?',
   '["COUNT(column)", "COUNT(*)", "SUM(*)", "TOTAL(*)"]', 1, 'COUNT(*) counts all rows. COUNT(column) skips NULLs in that column.')
ON CONFLICT (id) DO NOTHING;

-- ML Intro Quiz
INSERT INTO quizzes (id, module_id, title) VALUES
  ('qz444444-4444-4444-4444-444444444444', 'm2a01111-1111-1111-1111-111111111111', 'ML Concepts Check')
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (id, quiz_id, body, options, correct_index, explanation) VALUES
  ('qq444444-aaaa-4444-4444-444444444444', 'qz444444-4444-4444-4444-444444444444',
   'A model that memorises training data but fails on new data is experiencing:',
   '["Underfitting", "Overfitting", "High bias", "Data leakage"]', 1, 'Overfitting means the model learns noise in training data and fails to generalise.'),
  ('qq444444-bbbb-4444-4444-444444444444', 'qz444444-4444-4444-4444-444444444444',
   'Which of these is an unsupervised learning algorithm?',
   '["Linear Regression", "Random Forest", "K-Means Clustering", "Logistic Regression"]', 2, 'K-Means is unsupervised — it groups data without labelled examples.'),
  ('qq444444-cccc-4444-4444-444444444444', 'qz444444-4444-4444-4444-444444444444',
   'What is the purpose of a validation set?',
   '["Train the model", "Tune hyperparameters", "Report final performance", "Store raw data"]', 1, 'The validation set is used to tune hyperparameters without touching the test set.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- COHORT
-- ============================================================

INSERT INTO cohorts (id, course_id, instructor_id, name, start_date, end_date) VALUES
  ('c0c0c0c0-0000-0000-0000-000000000001', 'c1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
   'Cohort 12 — Data Analytics (May 2026)', '2026-04-20', '2026-07-20')
ON CONFLICT (id) DO NOTHING;

UPDATE profiles
SET cohort_id = 'c0c0c0c0-0000-0000-0000-000000000001'
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '3a111111-1111-1111-1111-111111111111',
  '3a222222-2222-2222-2222-222222222222',
  '3a333333-3333-3333-3333-333333333333',
  '3a444444-4444-4444-4444-444444444444',
  '3a555555-5555-5555-5555-555555555555',
  '3a666666-6666-6666-6666-666666666666',
  '3a777777-7777-7777-7777-777777777777',
  '3a888888-8888-8888-8888-888888888888'
);

-- ============================================================
-- ENROLLMENTS
-- ============================================================

INSERT INTO enrollments (student_id, course_id, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'active'),
  ('3a111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'active'),
  ('3a222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'active'),
  ('3a333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'active'),
  ('3a444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', 'active'),
  ('3a555555-5555-5555-5555-555555555555', 'c1111111-1111-1111-1111-111111111111', 'active'),
  ('3a666666-6666-6666-6666-666666666666', 'c1111111-1111-1111-1111-111111111111', 'active'),
  ('3a777777-7777-7777-7777-777777777777', 'c1111111-1111-1111-1111-111111111111', 'active'),
  ('3a888888-8888-8888-8888-888888888888', 'c1111111-1111-1111-1111-111111111111', 'active')
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO cohort_enrollments (cohort_id, student_id) VALUES
  ('c0c0c0c0-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111'),
  ('c0c0c0c0-0000-0000-0000-000000000001', '3a111111-1111-1111-1111-111111111111'),
  ('c0c0c0c0-0000-0000-0000-000000000001', '3a222222-2222-2222-2222-222222222222'),
  ('c0c0c0c0-0000-0000-0000-000000000001', '3a333333-3333-3333-3333-333333333333'),
  ('c0c0c0c0-0000-0000-0000-000000000001', '3a444444-4444-4444-4444-444444444444'),
  ('c0c0c0c0-0000-0000-0000-000000000001', '3a555555-5555-5555-5555-555555555555'),
  ('c0c0c0c0-0000-0000-0000-000000000001', '3a666666-6666-6666-6666-666666666666'),
  ('c0c0c0c0-0000-0000-0000-000000000001', '3a777777-7777-7777-7777-777777777777'),
  ('c0c0c0c0-0000-0000-0000-000000000001', '3a888888-8888-8888-8888-888888888888')
ON CONFLICT (cohort_id, student_id) DO NOTHING;

-- ============================================================
-- STREAKS
-- ============================================================

INSERT INTO streaks (student_id, current_streak, longest_streak, last_activity_date) VALUES
  ('11111111-1111-1111-1111-111111111111', 12, 18, CURRENT_DATE),
  ('3a111111-1111-1111-1111-111111111111', 10, 15, CURRENT_DATE - 1),
  ('3a222222-2222-2222-2222-222222222222',  2,  7, CURRENT_DATE - 6),
  ('3a333333-3333-3333-3333-333333333333',  4,  9, CURRENT_DATE - 3),
  ('3a444444-4444-4444-4444-444444444444', 14, 20, CURRENT_DATE),
  ('3a555555-5555-5555-5555-555555555555',  1,  5, CURRENT_DATE - 8),
  ('3a666666-6666-6666-6666-666666666666',  7, 11, CURRENT_DATE - 1),
  ('3a777777-7777-7777-7777-777777777777',  3,  8, CURRENT_DATE - 4),
  ('3a888888-8888-8888-8888-888888888888',  9, 12, CURRENT_DATE)
ON CONFLICT (student_id) DO NOTHING;

-- ============================================================
-- MODULE PROGRESS — Ahmed: 5 of 12 done (modules 1-5)
-- ============================================================

INSERT INTO module_progress (student_id, module_id, completed, completed_at, last_viewed_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'm1a01111-1111-1111-1111-111111111111', TRUE,  NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('11111111-1111-1111-1111-111111111111', 'm1a02222-2222-2222-2222-222222222222', TRUE,  NOW() - INTERVAL '9 days',  NOW() - INTERVAL '9 days'),
  ('11111111-1111-1111-1111-111111111111', 'm1a03333-3333-3333-3333-333333333333', TRUE,  NOW() - INTERVAL '7 days',  NOW() - INTERVAL '7 days'),
  ('11111111-1111-1111-1111-111111111111', 'm1a04444-4444-4444-4444-444444444444', TRUE,  NOW() - INTERVAL '5 days',  NOW() - INTERVAL '5 days'),
  ('11111111-1111-1111-1111-111111111111', 'm1b01111-1111-1111-1111-111111111111', TRUE,  NOW() - INTERVAL '3 days',  NOW() - INTERVAL '3 days'),
  ('11111111-1111-1111-1111-111111111111', 'm1b02222-2222-2222-2222-222222222222', FALSE, NULL,                        NOW() - INTERVAL '1 day')
ON CONFLICT (student_id, module_id) DO NOTHING;

-- Cohort students progress (varied)
INSERT INTO module_progress (student_id, module_id, completed, completed_at, last_viewed_at) VALUES
  ('3a111111-1111-1111-1111-111111111111', 'm1a01111-1111-1111-1111-111111111111', TRUE, NOW() - INTERVAL '8 days',  NOW() - INTERVAL '8 days'),
  ('3a111111-1111-1111-1111-111111111111', 'm1a02222-2222-2222-2222-222222222222', TRUE, NOW() - INTERVAL '6 days',  NOW() - INTERVAL '6 days'),
  ('3a111111-1111-1111-1111-111111111111', 'm1a03333-3333-3333-3333-333333333333', TRUE, NOW() - INTERVAL '4 days',  NOW() - INTERVAL '4 days'),
  ('3a222222-2222-2222-2222-222222222222', 'm1a01111-1111-1111-1111-111111111111', TRUE, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
  ('3a333333-3333-3333-3333-333333333333', 'm1a01111-1111-1111-1111-111111111111', TRUE, NOW() - INTERVAL '9 days',  NOW() - INTERVAL '9 days'),
  ('3a333333-3333-3333-3333-333333333333', 'm1a02222-2222-2222-2222-222222222222', TRUE, NOW() - INTERVAL '6 days',  NOW() - INTERVAL '6 days'),
  ('3a444444-4444-4444-4444-444444444444', 'm1a01111-1111-1111-1111-111111111111', TRUE, NOW() - INTERVAL '5 days',  NOW() - INTERVAL '5 days'),
  ('3a444444-4444-4444-4444-444444444444', 'm1a02222-2222-2222-2222-222222222222', TRUE, NOW() - INTERVAL '3 days',  NOW() - INTERVAL '3 days'),
  ('3a444444-4444-4444-4444-444444444444', 'm1a03333-3333-3333-3333-333333333333', TRUE, NOW() - INTERVAL '2 days',  NOW() - INTERVAL '2 days'),
  ('3a444444-4444-4444-4444-444444444444', 'm1a04444-4444-4444-4444-444444444444', TRUE, NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day'),
  ('3a666666-6666-6666-6666-666666666666', 'm1a01111-1111-1111-1111-111111111111', TRUE, NOW() - INTERVAL '3 days',  NOW() - INTERVAL '3 days'),
  ('3a666666-6666-6666-6666-666666666666', 'm1a02222-2222-2222-2222-222222222222', TRUE, NOW() - INTERVAL '2 days',  NOW() - INTERVAL '2 days')
ON CONFLICT (student_id, module_id) DO NOTHING;

-- ============================================================
-- QUIZ ATTEMPTS — Ahmed
-- ============================================================

INSERT INTO quiz_attempts (id, student_id, quiz_id, answers, score, passed, attempted_at) VALUES
  ('qa111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
   'qz111111-1111-1111-1111-111111111111',
   '{"qq111111-aaaa-1111-1111-111111111111":2,"qq111111-bbbb-1111-1111-111111111111":1,"qq111111-cccc-1111-1111-111111111111":1,"qq111111-dddd-1111-1111-111111111111":2}',
   100, TRUE, NOW() - INTERVAL '9 days'),
  ('qa222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   'qz333333-3333-3333-3333-333333333333',
   '{"qq333333-aaaa-3333-3333-333333333333":1,"qq333333-bbbb-3333-3333-333333333333":3,"qq333333-cccc-3333-3333-333333333333":1}',
   100, TRUE, NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- AI INSIGHTS
-- ============================================================

INSERT INTO ai_insights (id, student_id, insight_text, type) VALUES
  ('ai111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
   'You are excelling at SQL — your quiz score of 100% puts you in the top 5% of the cohort. Try the advanced SQL bonus challenge before this week''s session.', 'recommendation'),
  ('ai222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   'Your pace slowed slightly in the Pandas module. A 30-minute session today would put you back on track to finish Week 2 by Thursday.', 'warning'),
  ('ai333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
   '12-day streak! You are in the top 8% of Cohort 12. Consistent learners like you are 3x more likely to complete and land a job.', 'encouragement')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- CHAT SESSION & MESSAGES (7 messages for Ahmed)
-- ============================================================

INSERT INTO chat_sessions (id, student_id, title) VALUES
  ('cs111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Exploratory Data Analysis'),
  ('cs222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'SQL Window Functions')
ON CONFLICT (id) DO NOTHING;

INSERT INTO chat_messages (id, student_id, session_id, role, content, created_at) VALUES
  ('cm111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'cs111111-1111-1111-1111-111111111111',
   'assistant', 'Hi! I''m atombot. What would you like to explore in EDA today?', NOW() - INTERVAL '3 days'),
  ('cm222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'cs111111-1111-1111-1111-111111111111',
   'user', 'What''s the difference between df.describe() and df.info()?', NOW() - INTERVAL '3 days' + INTERVAL '1 minute'),
  ('cm333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'cs111111-1111-1111-1111-111111111111',
   'assistant', 'Great question! df.describe() gives you statistical summaries (mean, std, quartiles) for numeric columns. df.info() shows data types, non-null counts, and memory usage for every column — it''s your first check for data quality issues.', NOW() - INTERVAL '3 days' + INTERVAL '2 minutes'),
  ('cm444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'cs111111-1111-1111-1111-111111111111',
   'user', 'How do I handle missing values in a dataset?', NOW() - INTERVAL '3 days' + INTERVAL '5 minutes'),
  ('cm555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'cs111111-1111-1111-1111-111111111111',
   'assistant', 'In Pandas, check missing values with df.isnull().sum(). Then choose a strategy: 1) Drop rows/columns with df.dropna(). 2) Fill with a constant via df.fillna(0). 3) Fill with mean/median: df[''col''].fillna(df[''col''].mean()). For ML pipelines, SimpleImputer from sklearn is cleaner.', NOW() - INTERVAL '3 days' + INTERVAL '6 minutes'),
  ('cm666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'cs222222-2222-2222-2222-222222222222',
   'user', 'Can you explain SQL window functions with an example?', NOW() - INTERVAL '1 day'),
  ('cm777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'cs222222-2222-2222-2222-222222222222',
   'assistant', 'Window functions compute values across rows related to the current row — without collapsing them like GROUP BY. Example: SELECT name, salary, RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rank FROM employees. This ranks employees by salary within each department, keeping all rows intact.', NOW() - INTERVAL '1 day' + INTERVAL '1 minute')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- AT-RISK FLAGS
-- ============================================================

INSERT INTO at_risk_flags (student_id, cohort_id, risk_level, reason, flagged_at, resolved) VALUES
  ('3a222222-2222-2222-2222-222222222222', 'c0c0c0c0-0000-0000-0000-000000000001', 'high',   'Inactive for 6 days. Only 1 module completed. Progress below cohort average.', NOW() - INTERVAL '1 day', FALSE),
  ('3a333333-3333-3333-3333-333333333333', 'c0c0c0c0-0000-0000-0000-000000000001', 'medium', 'No activity in 3 days. Progress decelerated after module 2.', NOW() - INTERVAL '2 days', FALSE),
  ('3a555555-5555-5555-5555-555555555555', 'c0c0c0c0-0000-0000-0000-000000000001', 'high',   'No activity in 8 days. Zero quiz attempts. High dropout risk.', NOW() - INTERVAL '3 days', FALSE)
ON CONFLICT (student_id, cohort_id) DO NOTHING;

-- ============================================================
-- CERTIFICATES
-- ============================================================

INSERT INTO certificates (student_id, course_id, issued_at, pdf_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '40 days', 'https://example.com/certificates/ahmed-data-analytics.pdf')
ON CONFLICT (student_id, course_id) DO NOTHING;

-- ============================================================
-- SKILL SCORES — Ahmed
-- ============================================================

INSERT INTO skill_scores (student_id, skill, score) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Python',       72),
  ('11111111-1111-1111-1111-111111111111', 'Statistics',   55),
  ('11111111-1111-1111-1111-111111111111', 'ML',           48),
  ('11111111-1111-1111-1111-111111111111', 'Deep Learning',30),
  ('11111111-1111-1111-1111-111111111111', 'Data Viz',     68),
  ('11111111-1111-1111-1111-111111111111', 'SQL',          81)
ON CONFLICT (student_id, skill) DO NOTHING;

-- ============================================================
-- ACTIVITY LOG — Ahmed (study sessions over the last 14 days)
-- ============================================================

INSERT INTO activity_log (id, student_id, action, metadata, created_at) VALUES
  ('al101111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'module_view', '{"duration_minutes":45,"module_id":"m1a01111-1111-1111-1111-111111111111"}', NOW() - INTERVAL '10 days'),
  ('al102222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'module_view', '{"duration_minutes":40,"module_id":"m1a02222-2222-2222-2222-222222222222"}', NOW() - INTERVAL '9 days'),
  ('al103333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'quiz_attempt', '{"quiz_id":"qz111111-1111-1111-1111-111111111111","score":100}', NOW() - INTERVAL '9 days'),
  ('al104444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'module_view', '{"duration_minutes":50,"module_id":"m1a03333-3333-3333-3333-333333333333"}', NOW() - INTERVAL '7 days'),
  ('al105555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'quiz_attempt', '{"quiz_id":"qz333333-3333-3333-3333-333333333333","score":100}', NOW() - INTERVAL '6 days'),
  ('al106666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'module_view', '{"duration_minutes":60,"module_id":"m1a04444-4444-4444-4444-444444444444"}', NOW() - INTERVAL '5 days'),
  ('al107777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'chat_message', '{"session_id":"cs111111-1111-1111-1111-111111111111"}', NOW() - INTERVAL '3 days'),
  ('al108888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'module_view', '{"duration_minutes":65,"module_id":"m1b01111-1111-1111-1111-111111111111"}', NOW() - INTERVAL '3 days'),
  ('al109999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'module_view', '{"duration_minutes":30,"module_id":"m1b02222-2222-2222-2222-222222222222"}', NOW() - INTERVAL '1 day'),
  ('al110000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'chat_message', '{"session_id":"cs222222-2222-2222-2222-222222222222"}', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Cohort student activity
INSERT INTO activity_log (id, student_id, action, metadata, created_at) VALUES
  ('al201111-1111-1111-1111-111111111111', '3a222222-2222-2222-2222-222222222222', 'module_view', '{"duration_minutes":30}', NOW() - INTERVAL '8 days'),
  ('al301111-1111-1111-1111-111111111111', '3a444444-4444-4444-4444-444444444444', 'module_view', '{"duration_minutes":50}', NOW() - INTERVAL '1 day'),
  ('al401111-1111-1111-1111-111111111111', '3a666666-6666-6666-6666-666666666666', 'module_view', '{"duration_minutes":45}', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- LIVE SESSIONS (4 upcoming)
-- ============================================================

INSERT INTO live_sessions (id, cohort_id, title, starts_at, duration_minutes, instructor_id, participants_count, meeting_url) VALUES
  ('ls111111-1111-1111-1111-111111111111', 'c0c0c0c0-0000-0000-0000-000000000001',
   'EDA Deep Dive Workshop', NOW() + INTERVAL '3 hours', 90, '22222222-2222-2222-2222-222222222222', 14, 'https://meet.google.com/atomcamp-eda'),
  ('ls222222-2222-2222-2222-222222222222', 'c0c0c0c0-0000-0000-0000-000000000001',
   'SQL Window Functions Masterclass', NOW() + INTERVAL '1 day', 90, '22222222-2222-2222-2222-222222222222', 45, 'https://meet.google.com/atomcamp-sql'),
  ('ls333333-3333-3333-3333-333333333333', 'c0c0c0c0-0000-0000-0000-000000000001',
   'Pandas & Data Cleaning Q&A', NOW() + INTERVAL '3 days', 60, '44444444-4444-4444-4444-444444444444', 8, 'https://meet.google.com/atomcamp-pandas'),
  ('ls444444-4444-4444-4444-444444444444', 'c0c0c0c0-0000-0000-0000-000000000001',
   'Career Prep: Data Analyst Job Market 2026', NOW() + INTERVAL '5 days', 60, '22222222-2222-2222-2222-222222222222', 62, 'https://meet.google.com/atomcamp-career')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- AI RECOMMENDATIONS (instructor view)
-- ============================================================

INSERT INTO ai_recommendations (id, cohort_id, text) VALUES
  ('ar111111-1111-1111-1111-111111111111', 'c0c0c0c0-0000-0000-0000-000000000001',
   '3 students have not logged in for 6+ days — Fatima Zahra, Hassan Raza, and Bilal Ahmed. Send a personalised re-engagement message.'),
  ('ar222222-2222-2222-2222-222222222222', 'c0c0c0c0-0000-0000-0000-000000000001',
   'The SQL Fundamentals module shows a 40% drop-off rate. Consider adding a 5-minute "SQL in 5 mins" recap video before the live session.'),
  ('ar333333-3333-3333-3333-333333333333', 'c0c0c0c0-0000-0000-0000-000000000001',
   'Top performers (Ahmed Malik, Amna Siddiqui, Ali Hassan) are ready for advanced projects — consider assigning the capstone challenge early.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- COURSE DEADLINES
-- ============================================================

INSERT INTO course_deadlines (id, course_id, title, due_at) VALUES
  ('cd111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Submit EDA Notebook (Module 7)', NOW() + INTERVAL '3 days'),
  ('cd222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Quiz: SQL Window Functions', NOW() + INTERVAL '5 days'),
  ('cd333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Week 2 Self-Assessment', NOW() + INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;
