import { createClient } from "@supabase/supabase-js";
import config from "@/config";

const supabaseClient = createClient(config.supabaseUrl, config.supabaseKey, {
  persistSession: true,
});

export default supabaseClient;
