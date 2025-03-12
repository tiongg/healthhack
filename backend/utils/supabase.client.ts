import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_KEY') || '';
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Please provide SUPABASE_URL and SUPABASE_KEY in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
