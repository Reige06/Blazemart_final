import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xklhdfjkasnoblncmott.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbGhkZmprYXNub2JsbmNtb3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NjIzOTYsImV4cCI6MjA0OTIzODM5Nn0.JqfmqSbx9Cje-QISAAYDm1mpoM319Ihme7YjS0Nhuaw";

export const supabase = createClient(supabaseUrl, supabaseKey);