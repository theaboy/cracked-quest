// Award XP Edge Function
// Records a study session and awards XP to the user.
// Deploy: supabase functions deploy award_xp

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const XP_THRESHOLD_SECONDS = 20 * 60;
const XP_REWARD = 30;

Deno.serve(async (req) => {
  const body = await req.json();
  const { userId, topicId, mode, durationSeconds } = body;

  const xpEarned = durationSeconds >= XP_THRESHOLD_SECONDS ? XP_REWARD : 0;

  // TODO: Persist study_sessions row to Supabase DB
  // TODO: Persist xp_events row to Supabase DB
  // TODO: Update users.xp_total and recalculate rank_tier
  // TODO: Read real newXpTotal from DB after update

  console.log("award_xp called", { userId, topicId, mode, durationSeconds, xpEarned });

  return new Response(
    JSON.stringify({ success: true, xpEarned, newXpTotal: xpEarned }),
    { headers: { "Content-Type": "application/json" } }
  );
});
