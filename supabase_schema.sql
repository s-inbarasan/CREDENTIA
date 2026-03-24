-- Create users table (profile)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  profile_image TEXT,
  badges JSONB DEFAULT '[]'::jsonb,
  completed_topics JSONB DEFAULT '[]'::jsonb,
  quiz_scores JSONB DEFAULT '{}'::jsonb,
  simulation_scores JSONB DEFAULT '{}'::jsonb,
  stats JSONB DEFAULT '{"aiQueries": 0, "actionsTaken": 0, "strongPasswords": 0, "phishingDetected": 0, "threatsAnalyzed": 0, "toolsUsed": [], "simulationsCompleted": 0, "topicsCompleted": 0, "quizzesPassed": 0}'::jsonb,
  risk_score INTEGER DEFAULT 15,
  preferences JSONB DEFAULT '{"darkMode": true, "highContrast": false, "notifications": true, "soundEffects": true, "hapticFeedback": true}'::jsonb
);

-- Create chat_sessions table
CREATE TABLE public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb
);

-- Create recent_activity table
CREATE TABLE public.recent_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('topic', 'quiz', 'simulation', 'tool')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_activity ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chat sessions" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own recent activity" ON public.recent_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own recent activity" ON public.recent_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own recent activity" ON public.recent_activity FOR DELETE USING (auth.uid() = user_id);
