import { NextRequest } from "next/server";
import { validateApiKey } from "~/server/api-auth";

export async function GET(request: NextRequest) {
  const authResult = await validateApiKey(request);
  if ("error" in authResult) {
    return Response.json({ error: authResult.error }, { status: authResult.status });
  }

  const { user } = authResult;

  return Response.json({
    tier: "pro",
    character_count: 10000 - user.credits,
    character_limit: 10000,
    can_extend_character_limit: true,
    allowed_to_extend_character_limit: true,
    next_character_count_reset_unix: Math.floor(Date.now() / 1000) + 86400 * 30,
    voice_limit: 50,
    max_voice_add_edits: 50,
    voice_add_edit_counter: 0,
    professional_voice_limit: 1,
    can_extend_voice_limit: false,
    status: "active",
  });
}
