export const currentUser = {
  id: 'u1',
  full_name: 'Ahmed Malik',
  email: 'ahmed@atomcamp.com',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  role: 'student' as const,
  level: 'intermediate' as const,
  onboarding_completed: true,
  cohort_id: 'c1',
  streak: 12,
  total_hours: 47,
  modules_completed: 24,
  quizzes_passed: 11,
  overall_progress: 68,
}

export const courses = [
  {
    id: 'course-1',
    title: 'Data Analytics Bootcamp',
    description: 'Master data analysis with Python, SQL, and visualization tools. Build real-world dashboards and reports that drive business decisions.',
    level: 'beginner' as const,
    price_pkr: 50000,
    duration_weeks: 12,
    total_modules: 48,
    enrolled_count: 1240,
    instructor_name: 'Dr. Ayesha Khan',
    instructor_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    is_published: true,
    is_enrolled: true,
    progress: 45,
    rating: 4.8,
    skills: ['Python', 'SQL', 'Tableau', 'Statistics', 'Excel'],
    modules: [
      { id: 'm1', title: 'Python for Data Analysis', week: 1, completed: true, duration: 45 },
      { id: 'm2', title: 'SQL Fundamentals', week: 1, completed: true, duration: 50 },
      { id: 'm3', title: 'Data Cleaning with Pandas', week: 2, completed: true, duration: 60 },
      { id: 'm4', title: 'Exploratory Data Analysis', week: 2, completed: false, duration: 55, current: true },
      { id: 'm5', title: 'Data Visualization with Matplotlib', week: 3, completed: false, duration: 50, locked: true },
      { id: 'm6', title: 'Advanced SQL Queries', week: 3, completed: false, duration: 65, locked: true },
    ],
  },
  {
    id: 'course-2',
    title: 'AI Bootcamp',
    description: 'Go deep into machine learning and deep learning. Build neural networks, NLP models, and computer vision applications from scratch.',
    level: 'intermediate' as const,
    price_pkr: 75000,
    duration_weeks: 14,
    total_modules: 56,
    enrolled_count: 892,
    instructor_name: 'Dr. Omar Farooq',
    instructor_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop',
    is_published: true,
    is_enrolled: false,
    progress: 0,
    rating: 4.9,
    skills: ['ML', 'Deep Learning', 'PyTorch', 'NLP', 'Computer Vision'],
    modules: [],
  },
  {
    id: 'course-3',
    title: 'Automation with AI',
    description: 'Automate repetitive tasks using Python scripts, AI APIs, and workflow automation tools like n8n and Make.com.',
    level: 'intermediate' as const,
    price_pkr: 35000,
    duration_weeks: 6,
    total_modules: 24,
    enrolled_count: 534,
    instructor_name: 'Usman Tariq',
    instructor_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
    thumbnail_url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop',
    is_published: true,
    is_enrolled: false,
    progress: 0,
    rating: 4.7,
    skills: ['Python', 'APIs', 'n8n', 'Zapier', 'LLMs'],
    modules: [],
  },
  {
    id: 'course-4',
    title: 'AI Agents for Business',
    description: 'Design and deploy autonomous AI agents for business workflows. Build with LangChain, OpenAI, and vector databases.',
    level: 'advanced' as const,
    price_pkr: 60000,
    duration_weeks: 8,
    total_modules: 32,
    enrolled_count: 318,
    instructor_name: 'Sara Ahmed',
    instructor_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
    thumbnail_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
    is_published: true,
    is_enrolled: false,
    progress: 0,
    rating: 4.9,
    skills: ['LangChain', 'OpenAI API', 'Vector DBs', 'RAG', 'Agents'],
    modules: [],
  },
]

export const quizzes = [
  {
    id: 'q1',
    module_id: 'm4',
    title: 'EDA Fundamentals Quiz',
    questions: [
      {
        id: 'q1-1',
        body: 'Which Python library is primarily used for data manipulation and analysis?',
        options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
        correct_index: 1,
        explanation: 'Pandas provides DataFrame structures for data manipulation, cleaning, and analysis.',
      },
      {
        id: 'q1-2',
        body: 'What does EDA stand for in data science?',
        options: [
          'Exploratory Data Analysis',
          'Extended Data Algorithm',
          'Efficient Data Aggregation',
          'Experimental Design Approach',
        ],
        correct_index: 0,
        explanation: 'EDA (Exploratory Data Analysis) is the process of analyzing datasets to summarize their main characteristics.',
      },
      {
        id: 'q1-3',
        body: 'Which function in Pandas shows basic statistics like mean, std, and quartiles?',
        options: ['df.info()', 'df.head()', 'df.describe()', 'df.summary()'],
        correct_index: 2,
        explanation: 'df.describe() generates descriptive statistics for numerical columns.',
      },
    ],
  },
]

export const students = [
  { id: 's1', name: 'Ali Hassan', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=60&h=60&fit=crop&crop=face', progress: 78, last_active: '2 hours ago', risk: 'low', risk_reason: 'On track. Consistent activity and above-average quiz scores.', modules_done: 22, quiz_avg: 84 },
  { id: 's2', name: 'Fatima Zahra', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face', progress: 34, last_active: '6 days ago', risk: 'high', risk_reason: 'Inactive for 6 days. Only 34% progress, 2 failed quiz attempts. Intervention needed.', modules_done: 9, quiz_avg: 41 },
  { id: 's3', name: 'Bilal Ahmed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', progress: 52, last_active: '3 days ago', risk: 'medium', risk_reason: 'Progress below cohort average (67%). No activity in 3 days. May need a check-in.', modules_done: 14, quiz_avg: 61 },
  { id: 's4', name: 'Amna Siddiqui', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face', progress: 91, last_active: '1 hour ago', risk: 'low', risk_reason: 'Excellent performance. Top 5% in cohort. Consider recommending advanced track.', modules_done: 35, quiz_avg: 92 },
  { id: 's5', name: 'Hassan Raza', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face', progress: 28, last_active: '8 days ago', risk: 'high', risk_reason: 'Critical: 8 days inactive. Module 2 quiz failed 3 times. High dropout probability.', modules_done: 7, quiz_avg: 38 },
  { id: 's6', name: 'Zara Khan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face', progress: 65, last_active: '1 day ago', risk: 'low', risk_reason: 'Good pace. Slightly below average in SQL modules but actively catching up.', modules_done: 19, quiz_avg: 74 },
  { id: 's7', name: 'Imran Malik', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&crop=face', progress: 43, last_active: '4 days ago', risk: 'medium', risk_reason: 'Moderate risk. 4 days since last login. Progress decelerated after week 3.', modules_done: 12, quiz_avg: 57 },
  { id: 's8', name: 'Sana Mir', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&crop=face', progress: 72, last_active: '5 hours ago', risk: 'low', risk_reason: 'Performing well. Active learner with consistent daily streaks.', modules_done: 21, quiz_avg: 79 },
]

export const insights = [
  {
    id: 'i1',
    type: 'recommendation' as const,
    text: "You're excelling at Python — consider attempting the bonus challenge in Module 5 before the live session.",
  },
  {
    id: 'i2',
    type: 'warning' as const,
    text: 'Your quiz performance in Statistics dropped 15% this week. Review the Probability Distributions video.',
  },
  {
    id: 'i3',
    type: 'encouragement' as const,
    text: "12-day streak! You're in the top 8% of your cohort. Keep up the momentum! 🔥",
  },
]

export const certificates = [
  {
    id: 'cert1',
    course_title: 'Python for Data Science',
    issued_at: '2024-03-15',
    verification_code: 'AC-2024-PDS-9823',
  },
  {
    id: 'cert2',
    course_title: 'SQL Mastery',
    issued_at: '2024-01-28',
    verification_code: 'AC-2024-SQL-4417',
  },
]

export const weeklyActivity = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.0 },
  { day: 'Wed', hours: 0 },
  { day: 'Thu', hours: 3.5 },
  { day: 'Fri', hours: 2.5 },
  { day: 'Sat', hours: 4.0 },
  { day: 'Sun', hours: 1.0 },
]

export const skillRadar = [
  { skill: 'Python', score: 72 },
  { skill: 'Statistics', score: 55 },
  { skill: 'ML', score: 48 },
  { skill: 'Deep Learning', score: 30 },
  { skill: 'Data Viz', score: 68 },
  { skill: 'SQL', score: 81 },
]

export const liveSessions = [
  {
    id: 'ls1',
    title: 'EDA Deep Dive Workshop',
    date: 'Today, 14:00',
    instructor: 'Dr. Ayesha Khan',
    participants: 14,
    is_today: true,
  },
  {
    id: 'ls2',
    title: 'ML Model Evaluation Masterclass',
    date: 'Tomorrow, 10:00',
    instructor: 'Dr. Omar Farooq',
    participants: 45,
    is_today: false,
  },
  {
    id: 'ls3',
    title: 'Python for Automation Q&A',
    date: 'Thu, 16:30',
    instructor: 'Usman Tariq',
    participants: 8,
    is_today: false,
  },
  {
    id: 'ls4',
    title: 'Career Prep: AI Job Market 2025',
    date: 'Fri, 18:00',
    instructor: 'Sara Ahmed',
    participants: 62,
    is_today: false,
  },
]

export const cohortCompletion = [
  { week: 'Wk 1', completion: 95 },
  { week: 'Wk 2', completion: 91 },
  { week: 'Wk 3', completion: 87 },
  { week: 'Wk 4', completion: 82 },
  { week: 'Wk 5', completion: 78 },
  { week: 'Wk 6', completion: 74 },
  { week: 'Wk 7', completion: 71 },
  { week: 'Wk 8', completion: 67 },
  { week: 'Wk 9', completion: 64 },
  { week: 'Wk 10', completion: 61 },
  { week: 'Wk 11', completion: 59 },
  { week: 'Wk 12', completion: 55 },
]

export const moduleDropOff = [
  { module: 'Intro to Python', drop_rate: 5 },
  { module: 'Data Structures', drop_rate: 12 },
  { module: 'Pandas Basics', drop_rate: 8 },
  { module: 'Statistics 101', drop_rate: 22 },
  { module: 'Visualization', drop_rate: 15 },
  { module: 'SQL Joins', drop_rate: 18 },
]

export const leaderboard = [
  { rank: 1, name: 'Amna Siddiqui', score: 2840, badge: '🥇' },
  { rank: 2, name: 'Ali Hassan', score: 2610, badge: '🥈' },
  { rank: 3, name: 'Ahmed Malik', score: 2340, badge: '🥉', is_me: true },
  { rank: 4, name: 'Zara Khan', score: 2180, badge: '' },
  { rank: 5, name: 'Sana Mir', score: 2050, badge: '' },
]
