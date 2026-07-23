
-- AI conversations
CREATE TABLE public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New chat',
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversations TO authenticated;
GRANT ALL ON public.ai_conversations TO service_role;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own conv" ON public.ai_conversations FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE TRIGGER trg_ai_conv_updated BEFORE UPDATE ON public.ai_conversations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Saved plans (shared shape)
CREATE TABLE public.saved_skincare_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_skincare_plans TO authenticated;
GRANT ALL ON public.saved_skincare_plans TO service_role;
ALTER TABLE public.saved_skincare_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own skincare" ON public.saved_skincare_plans FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE TRIGGER trg_skincare_updated BEFORE UPDATE ON public.saved_skincare_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.saved_workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_workout_plans TO authenticated;
GRANT ALL ON public.saved_workout_plans TO service_role;
ALTER TABLE public.saved_workout_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own workout" ON public.saved_workout_plans FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE TRIGGER trg_workout_updated BEFORE UPDATE ON public.saved_workout_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.saved_nutrition_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_nutrition_plans TO authenticated;
GRANT ALL ON public.saved_nutrition_plans TO service_role;
ALTER TABLE public.saved_nutrition_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own nutrition" ON public.saved_nutrition_plans FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE TRIGGER trg_nutr_updated BEFORE UPDATE ON public.saved_nutrition_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.daily_glow_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  quests jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_glow_quests TO authenticated;
GRANT ALL ON public.daily_glow_quests TO service_role;
ALTER TABLE public.daily_glow_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own quests" ON public.daily_glow_quests FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE TRIGGER trg_quests_updated BEFORE UPDATE ON public.daily_glow_quests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.weekly_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_reviews TO authenticated;
GRANT ALL ON public.weekly_reviews TO service_role;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reviews" ON public.weekly_reviews FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE TRIGGER trg_reviews_updated BEFORE UPDATE ON public.weekly_reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
