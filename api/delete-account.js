import { createClerkClient, verifyToken } from "@clerk/backend";
import { createClient } from "@supabase/supabase-js";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Missing authorization token",
      });
    }

    const token = authHeader.substring(7);

    // Verify Clerk JWT
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const userId = payload.sub;

    if (!userId) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    // Delete user data from Supabase
    const tables = [
      "messages",
      "chats",
      "settings",
    ];

    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error(`Supabase delete failed (${table})`, error);
        throw error;
      }
    }

    // Delete Clerk user
    await clerk.users.deleteUser(userId);

    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error("Delete account error:", error);

    return res.status(500).json({
      error: error.message || "Failed to delete account",
    });
  }
}