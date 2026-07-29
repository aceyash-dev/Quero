import { createClient } from "@supabase/supabase-js";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Delete user data from Supabase
    await supabase.from("messages").delete().eq("user_id", userId);
    await supabase.from("chats").delete().eq("user_id", userId);
    await supabase.from("settings").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);

    // Delete Clerk account
    const clerk = await clerkClient();
    await clerk.users.deleteUser(userId);

    return res.status(200).json({
      success: true
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to delete account."
    });
  }
                                                }
