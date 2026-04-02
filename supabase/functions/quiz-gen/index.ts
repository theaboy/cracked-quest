// Quiz Generator Edge Function
// Generates a single MCQ from course material for study mode checkpoints
// Deploy: supabase functions deploy quiz-gen

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  // TODO: Implement quiz generation via Claude API
  return new Response(JSON.stringify({ message: "quiz-gen function stub" }), {
    headers: { "Content-Type": "application/json" },
  });
});
