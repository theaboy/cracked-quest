// Key Points Generator Edge Function
// Generates bullet-point key points from topic notes
// Deploy: supabase functions deploy key-points

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  // TODO: Implement key points generation via Claude API
  return new Response(JSON.stringify({ message: "key-points function stub" }), {
    headers: { "Content-Type": "application/json" },
  });
});
