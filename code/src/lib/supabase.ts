import { createClient } from "../../utils/supabase/client"
import { createClient as createClientSS } from "../../utils/supabase/server";
// init with types later on
export const supabaseClient = createClient();
export const supabaseClientSS = createClientSS();