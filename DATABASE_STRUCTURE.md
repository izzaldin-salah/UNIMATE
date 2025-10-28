# Database Structure for UNIMATE - Dashboard & Progress Tracking

## Overview
This document outlines the recommended database structure for the UNIMATE learning platform, focusing on user progress tracking, course management, and dashboard analytics.

---

## Database Tables

### 1. **users**
Stores user account information and profile data.

```sql
users
├── id (UUID, Primary Key)
├── email (String, Unique, Required)
├── full_name (String, Required)
├── password_hash (String, Required)
├── avatar_url (String, Nullable)
├── university (String, Nullable)
├── major (String, Nullable)
├── year_of_study (Integer, Nullable)
├── bio (Text, Nullable)
├── learning_goals (Text, Nullable)
├── created_at (Timestamp)
├── updated_at (Timestamp)
└── last_login (Timestamp)
```

**Purpose**: Core user information and profile settings.

---

### 2. **subjects**
Defines all available subjects/courses in the platform.

```sql
subjects
├── id (UUID, Primary Key)
├── name (String, Required) - e.g., "Data Structures"
├── code (String, Unique) - e.g., "CS201"
├── description (Text)
├── category (String) - e.g., "Computer Science", "Mathematics"
├── difficulty_level (Enum) - "Beginner", "Intermediate", "Advanced"
├── estimated_hours (Integer) - Total hours to complete
├── icon_url (String, Nullable)
├── color (String) - For UI theme
├── is_active (Boolean)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

**Purpose**: Master list of all courses/subjects available.

---

### 3. **modules**
Breaks down subjects into smaller learning modules/chapters.

```sql
modules
├── id (UUID, Primary Key)
├── subject_id (UUID, Foreign Key -> subjects.id)
├── title (String, Required) - e.g., "Binary Trees"
├── description (Text)
├── order_index (Integer) - Order within the subject
├── estimated_hours (Integer)
├── content_type (Enum) - "Video", "Reading", "Interactive", "Quiz"
├── is_mandatory (Boolean)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

**Purpose**: Organize subjects into manageable learning units.

---

### 4. **lessons**
Individual lessons within each module.

```sql
lessons
├── id (UUID, Primary Key)
├── module_id (UUID, Foreign Key -> modules.id)
├── title (String, Required)
├── content (Text) - Lesson content/description
├── video_url (String, Nullable)
├── reading_material_url (String, Nullable)
├── order_index (Integer)
├── estimated_minutes (Integer)
├── difficulty (Enum) - "Easy", "Medium", "Hard"
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

**Purpose**: Detailed lesson content within modules.

---

### 5. **user_subjects**
Tracks which subjects users are enrolled in.

```sql
user_subjects
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key -> users.id)
├── subject_id (UUID, Foreign Key -> subjects.id)
├── enrollment_date (Timestamp)
├── status (Enum) - "Active", "Completed", "Paused", "Dropped"
├── completion_percentage (Float) - 0.0 to 100.0
├── target_completion_date (Date, Nullable)
├── hours_spent (Float) - Total hours spent
├── last_accessed (Timestamp)
├── started_at (Timestamp)
├── completed_at (Timestamp, Nullable)
└── created_at (Timestamp)
```

**Purpose**: Enrollment and high-level progress tracking per subject.

---

### 6. **user_module_progress**
Detailed progress tracking for each module.

```sql
user_module_progress
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key -> users.id)
├── module_id (UUID, Foreign Key -> modules.id)
├── subject_id (UUID, Foreign Key -> subjects.id)
├── status (Enum) - "Not Started", "In Progress", "Completed"
├── completion_percentage (Float) - 0.0 to 100.0
├── time_spent_minutes (Integer)
├── started_at (Timestamp, Nullable)
├── completed_at (Timestamp, Nullable)
├── last_accessed (Timestamp)
└── created_at (Timestamp)
```

**Purpose**: Track progress at the module level.

---

### 7. **user_lesson_progress**
Granular progress tracking for individual lessons.

```sql
user_lesson_progress
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key -> users.id)
├── lesson_id (UUID, Foreign Key -> lessons.id)
├── module_id (UUID, Foreign Key -> modules.id)
├── is_completed (Boolean)
├── time_spent_minutes (Integer)
├── video_progress_percentage (Float) - For video lessons
├── last_position (Integer) - Last video timestamp or reading position
├── notes (Text, Nullable) - User's notes
├── rating (Integer, Nullable) - 1-5 stars
├── started_at (Timestamp, Nullable)
├── completed_at (Timestamp, Nullable)
├── last_accessed (Timestamp)
└── created_at (Timestamp)
```

**Purpose**: Detailed tracking of individual lesson completion.

---

### 8. **quizzes**
Quiz/assessment definitions.

```sql
quizzes
├── id (UUID, Primary Key)
├── module_id (UUID, Foreign Key -> modules.id, Nullable)
├── subject_id (UUID, Foreign Key -> subjects.id)
├── title (String, Required)
├── description (Text)
├── quiz_type (Enum) - "Practice", "Assessment", "Final Exam"
├── passing_score (Integer) - Percentage to pass
├── time_limit_minutes (Integer, Nullable)
├── is_mandatory (Boolean)
├── order_index (Integer)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

**Purpose**: Define quizzes and assessments.

---

### 9. **quiz_questions**
Individual questions within quizzes.

```sql
quiz_questions
├── id (UUID, Primary Key)
├── quiz_id (UUID, Foreign Key -> quizzes.id)
├── question_text (Text, Required)
├── question_type (Enum) - "Multiple Choice", "True/False", "Short Answer"
├── options (JSON) - Array of answer options
├── correct_answer (String/JSON)
├── explanation (Text)
├── points (Integer)
├── order_index (Integer)
└── created_at (Timestamp)
```

**Purpose**: Store quiz questions and answers.

---

### 10. **user_quiz_attempts**
Track user quiz attempts and scores.

```sql
user_quiz_attempts
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key -> users.id)
├── quiz_id (UUID, Foreign Key -> quizzes.id)
├── attempt_number (Integer)
├── score (Float) - Percentage score
├── total_questions (Integer)
├── correct_answers (Integer)
├── time_taken_minutes (Integer)
├── status (Enum) - "In Progress", "Completed", "Abandoned"
├── passed (Boolean)
├── answers (JSON) - User's answers to questions
├── started_at (Timestamp)
├── completed_at (Timestamp, Nullable)
└── created_at (Timestamp)
```

**Purpose**: Record quiz attempts and results.

---

### 11. **study_sessions**
Log individual study sessions for analytics.

```sql
study_sessions
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key -> users.id)
├── subject_id (UUID, Foreign Key -> subjects.id, Nullable)
├── module_id (UUID, Foreign Key -> modules.id, Nullable)
├── lesson_id (UUID, Foreign Key -> lessons.id, Nullable)
├── session_type (Enum) - "Study", "Quiz", "Review", "AI Chat"
├── duration_minutes (Integer)
├── started_at (Timestamp)
├── ended_at (Timestamp)
└── created_at (Timestamp)
```

**Purpose**: Track study time and patterns for analytics.

---

### 12. **user_achievements**
Track user achievements and milestones.

```sql
user_achievements
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key -> users.id)
├── achievement_type (Enum) - "First Lesson", "Subject Completed", "Streak", "Quiz Master"
├── achievement_name (String)
├── description (Text)
├── icon_url (String, Nullable)
├── points_earned (Integer)
├── earned_at (Timestamp)
└── created_at (Timestamp)
```

**Purpose**: Gamification and motivation tracking.

---

### 13. **study_streaks**
Track daily study streaks for engagement.

```sql
study_streaks
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key -> users.id)
├── current_streak (Integer) - Days
├── longest_streak (Integer) - Days
├── last_study_date (Date)
├── total_study_days (Integer)
└── updated_at (Timestamp)
```

**Purpose**: Encourage daily engagement through streaks.

---

### 14. **user_goals**
Personal learning goals and targets.

```sql
user_goals
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key -> users.id)
├── subject_id (UUID, Foreign Key -> subjects.id, Nullable)
├── goal_type (Enum) - "Daily Hours", "Weekly Lessons", "Complete Subject", "Maintain Streak"
├── target_value (Integer)
├── current_value (Integer)
├── target_date (Date, Nullable)
├── status (Enum) - "Active", "Completed", "Failed", "Abandoned"
├── created_at (Timestamp)
├── completed_at (Timestamp, Nullable)
└── updated_at (Timestamp)
```

**Purpose**: Personal goal setting and tracking.

---

### 15. **ai_chat_history**
Store AI chatbot conversations.

```sql
ai_chat_history
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key -> users.id)
├── subject_id (UUID, Foreign Key -> subjects.id, Nullable)
├── session_id (UUID) - Groups messages in one conversation
├── message (Text)
├── sender (Enum) - "User", "AI"
├── helpful_rating (Integer, Nullable) - 1-5 stars
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

**Purpose**: Save chat history for reference and AI improvement.

---

## Database Relationships

### One-to-Many Relationships
- `users` → `user_subjects` (One user has many subject enrollments)
- `subjects` → `modules` (One subject has many modules)
- `modules` → `lessons` (One module has many lessons)
- `users` → `study_sessions` (One user has many study sessions)
- `users` → `user_achievements` (One user has many achievements)
- `quizzes` → `quiz_questions` (One quiz has many questions)
- `users` → `user_quiz_attempts` (One user has many quiz attempts)

### Many-to-Many Relationships
- `users` ↔ `subjects` (through `user_subjects`)
- `users` ↔ `modules` (through `user_module_progress`)
- `users` ↔ `lessons` (through `user_lesson_progress`)

---

## Key Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);

-- Progress queries
CREATE INDEX idx_user_subjects_user_id ON user_subjects(user_id);
CREATE INDEX idx_user_subjects_status ON user_subjects(user_id, status);
CREATE INDEX idx_user_module_progress_user_id ON user_module_progress(user_id);
CREATE INDEX idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);

-- Subject/Module relationships
CREATE INDEX idx_modules_subject_id ON modules(subject_id);
CREATE INDEX idx_lessons_module_id ON lessons(module_id);

-- Study sessions
CREATE INDEX idx_study_sessions_user_date ON study_sessions(user_id, created_at);

-- Quiz tracking
CREATE INDEX idx_user_quiz_attempts_user_quiz ON user_quiz_attempts(user_id, quiz_id);
```

---

## Dashboard Queries Examples

### 1. **Overall User Progress**
```sql
SELECT 
    s.name,
    us.completion_percentage,
    us.hours_spent,
    us.status,
    us.last_accessed
FROM user_subjects us
JOIN subjects s ON us.subject_id = s.id
WHERE us.user_id = '<user_id>'
ORDER BY us.last_accessed DESC;
```

### 2. **Recent Study Activity**
```sql
SELECT 
    ss.session_type,
    s.name as subject_name,
    ss.duration_minutes,
    ss.started_at
FROM study_sessions ss
LEFT JOIN subjects s ON ss.subject_id = s.id
WHERE ss.user_id = '<user_id>'
ORDER BY ss.started_at DESC
LIMIT 10;
```

### 3. **Subject Progress Details**
```sql
SELECT 
    m.title as module_name,
    ump.completion_percentage,
    ump.status,
    ump.time_spent_minutes
FROM user_module_progress ump
JOIN modules m ON ump.module_id = m.id
WHERE ump.user_id = '<user_id>' 
    AND ump.subject_id = '<subject_id>'
ORDER BY m.order_index;
```

### 4. **Weekly Study Statistics**
```sql
SELECT 
    DATE(started_at) as study_date,
    SUM(duration_minutes) as total_minutes,
    COUNT(*) as session_count
FROM study_sessions
WHERE user_id = '<user_id>'
    AND started_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(started_at)
ORDER BY study_date;
```

### 5. **Quiz Performance**
```sql
SELECT 
    q.title,
    uqa.score,
    uqa.passed,
    uqa.attempt_number,
    uqa.completed_at
FROM user_quiz_attempts uqa
JOIN quizzes q ON uqa.quiz_id = q.id
WHERE uqa.user_id = '<user_id>'
ORDER BY uqa.completed_at DESC;
```

---

## Supabase Specific Considerations

### Row Level Security (RLS) Policies

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own data"
ON user_subjects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
ON user_subjects FOR UPDATE
USING (auth.uid() = user_id);

-- Public read access to subjects and content
CREATE POLICY "Anyone can view subjects"
ON subjects FOR SELECT
TO authenticated
USING (is_active = true);
```

### Real-time Subscriptions

Enable real-time updates for:
- `user_subjects` - Live progress updates
- `study_sessions` - Active study tracking
- `ai_chat_history` - Real-time chat messages

### Storage Buckets

- `avatars` - User profile pictures
- `course-materials` - Videos, PDFs, resources
- `certificates` - Generated completion certificates

---

## Implementation with Supabase

1. **Create tables in Supabase Dashboard** or use migrations
2. **Enable RLS** on all tables containing user data
3. **Set up foreign key constraints** for data integrity
4. **Create database functions** for complex calculations (e.g., progress percentage)
5. **Set up triggers** for automatic updates (e.g., update completion_percentage when lessons are marked complete)

---

## Next Steps

1. Create these tables in your Supabase project
2. Update `src/lib/types/database.ts` with TypeScript types
3. Create helper functions in `src/lib/` for database operations
4. Implement API calls in your components
5. Add real-time subscriptions where needed

---

## Additional Features to Consider

- **Notifications table** - For push notifications and reminders
- **Discussion forums** - For peer learning
- **Resources/bookmarks** - Save favorite lessons
- **Study groups** - Collaborative learning
- **Leaderboards** - Competitive rankings
- **Certificates** - Track earned certificates

---

This structure provides a solid foundation for tracking student progress, managing courses, and powering a comprehensive dashboard!
