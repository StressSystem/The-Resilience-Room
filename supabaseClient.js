// supabaseClient.js
const SUPABASE_URL = "https://xbykuvelkvqnybqpxjvr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CGQ9dadIEmIxm9mOXLiooA_MRjePlCV";

window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
