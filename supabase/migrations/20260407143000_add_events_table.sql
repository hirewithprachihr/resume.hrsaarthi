-- Lightweight product analytics events

CREATE TABLE IF NOT EXISTS public.events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  payload    JSONB NOT NULL DEFAULT '{}'::jsonb,
  page_path  TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own events (or anonymous/null user_id events)
DROP POLICY IF EXISTS "Users insert own events" ON public.events;
CREATE POLICY "Users insert own events"
  ON public.events FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Users can read only their own events
DROP POLICY IF EXISTS "Users read own events" ON public.events;
CREATE POLICY "Users read own events"
  ON public.events FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all events
DROP POLICY IF EXISTS "Admins read all events" ON public.events;
CREATE POLICY "Admins read all events"
  ON public.events FOR SELECT
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS events_event_name_idx ON public.events (event_name);
CREATE INDEX IF NOT EXISTS events_user_id_idx ON public.events (user_id);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON public.events (created_at DESC);

