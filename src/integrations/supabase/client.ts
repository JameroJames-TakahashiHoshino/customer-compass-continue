// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://duvlzkygcnirobzghjzq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dmx6a3lnY25pcm9iemdoanpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDgxNjQsImV4cCI6MjA1OTIyNDE2NH0.o9nKCEKuCV7v-3Gaa6LQN6Rj8Z5TvAViJGrMi-gTLlw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);