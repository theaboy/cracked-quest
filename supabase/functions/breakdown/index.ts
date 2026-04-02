// Assignment Breakdown Edge Function
// Calls Claude to generate a structured task list for an assignment
// Deploy: supabase functions deploy breakdown

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  // TODO: Implement assignment breakdown via Claude API
  return new Response(JSON.stringify({ message: "breakdown function stub" }), {
    headers: { "Content-Type": "application/json" },
  });
});
