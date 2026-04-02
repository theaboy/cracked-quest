// Flashcard Generator Edge Function
// Generates flashcard pairs from uploaded resource content
// Deploy: supabase functions deploy flashcards

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  // TODO: Implement flashcard generation via Claude API
  return new Response(JSON.stringify({ message: "flashcards function stub" }), {
    headers: { "Content-Type": "application/json" },
  });
});
