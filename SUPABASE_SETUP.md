# 🔧 Supabase Setup Guide for UniMate

Your UniMate application is now configured to work with Supabase! Follow these steps to complete the setup:

## 📋 Prerequisites

1. **Create a Supabase Account**: Go to [supabase.com](https://supabase.com) and sign up
2. **Create a New Project**: Click "New Project" in your Supabase dashboard

## 🗄️ Database Schema Setup

Run these SQL commands in your Supabase SQL Editor to create the required tables:

### 1. Enable RLS (Row Level Security)
```sql
-- Enable RLS on auth.users (already enabled by default)
-- We'll create policies for our custom tables
```

### 2. Create Profiles Table
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  year TEXT,
  department TEXT,
  index_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 3. Create Courses Table
```sql
-- Create courses table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read courses
CREATE POLICY "All authenticated users can view courses" ON courses
  FOR SELECT TO authenticated USING (true);
```

### 4. Create User Progress Table
```sql
-- Create user progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

### 5. Create Sample Data (Optional)
```sql
-- Insert sample courses
INSERT INTO courses (name, description, department, year) VALUES
('Introduction to Programming', 'Learn the basics of programming with Python', 'Computer Science', '1'),
('Data Structures and Algorithms', 'Fundamental data structures and algorithms', 'Computer Science', '2'),
('Web Development', 'Build modern web applications', 'Computer Science', '2'),
('Database Systems', 'Design and manage databases', 'Computer Science', '3'),
('Calculus I', 'Differential and integral calculus', 'Mathematics', '1'),
('Linear Algebra', 'Vector spaces and linear transformations', 'Mathematics', '2'),
('Statistics', 'Probability and statistical analysis', 'Mathematics', '2'),
('Engineering Physics', 'Physics principles for engineers', 'Engineering', '1'),
('Circuit Analysis', 'Electrical circuit analysis', 'Engineering', '2'),
('Thermodynamics', 'Heat and energy systems', 'Engineering', '2');
```

## 🔐 Environment Variables Setup

1. **Get your Supabase credentials**:
   - Go to your Supabase project dashboard
   - Click on "Settings" → "API"
   - Copy your Project URL and anon public key

2. **Update your `.env` file**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Replace the placeholder values** in `.env` with your actual Supabase credentials

## 🚀 Authentication Setup

In your Supabase dashboard:

1. **Go to Authentication → Settings**
2. **Configure Email Templates** (optional)
3. **Set up Auth Providers** if you want social login
4. **Configure Site URL**: Add `http://localhost:5173` for development

## ✅ Testing the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test Registration**:
   - Try creating a new account
   - Check your Supabase Auth users table

3. **Test Login**:
   - Log in with your created account
   - Verify the profile data is created

## 🔧 Features Now Available

With Supabase connected, your UniMate app now supports:

- ✅ **User Registration** with email verification
- ✅ **User Authentication** with secure login/logout
- ✅ **Profile Management** with student information
- ✅ **Course Database** with department/year filtering
- ✅ **Progress Tracking** per course per user
- ✅ **Real-time Updates** (Supabase real-time subscriptions ready)

## 🛠️ Next Steps

1. **Add Type Generation** (optional):
   ```bash
   npx supabase gen types typescript --project-id your-project-id > src/lib/types/supabase.ts
   ```

2. **Add Real-time Features**:
   - Course progress updates
   - Live notifications
   - Collaborative features

3. **Enhanced Security**:
   - Add email verification flow
   - Implement password reset
   - Add role-based access control

## 📚 Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**🎉 Your UniMate application is now ready for production with Supabase!**

Start by setting up your Supabase project and database schema, then update your environment variables to begin testing the authentication flow.