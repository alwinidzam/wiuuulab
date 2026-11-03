import { NextRequest } from "next/server";
import { validateApiKey } from "~/server/api-auth";

export async function GET(request: NextRequest) {
  const authResult = await validateApiKey(request);
  if ("error" in authResult) {
    return Response.json({ error: authResult.error }, { status: authResult.status });
  }

  const { user, apiKey } = authResult;

  return Response.json({
    xi_api_key: apiKey.key,
    can_use_delayed_payment_methods: false,
    subscription: {
      tier: "unlimited_free",
      character_count: 0,
      character_limit: 999999999,
      can_extend_character_limit: true,
      allowed_to_extend_character_limit: true,
      next_character_count_reset_unix: Math.floor(Date.now() / 1000) + 86400 * 365,
      voice_limit: 1000,
      max_voice_add_edits: 1000,
      voice_add_edit_counter: 0,
      professional_voice_limit: 100,
      can_extend_voice_limit: true,
      status: "active",
    },
    is_new_user: false,
    first_name: user.name ?? "wiuuulab Creator",
  });
}
