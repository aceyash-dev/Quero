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

    // Step 1: Find the profile.id from clerk_id (since chats/keys reference profiles.id, not clerk_id)
    const { data: profile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (profileFetchError) {
      console.error("Failed to fetch profile:", profileFetchError);
      throw profileFetchError;
    }

    const profileId = profile?.id;
    if (!profileId) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    console.log(`Found profile ${profileId} for clerk_id ${userId}`);

    // Step 2: Delete user data from Supabase
    // Order: keys → chats → profiles
    // (messages cascade delete from chats via FK)
    // Note: keys.user_id references auth.users.id (which IS the Clerk userId)
    
    console.log(`Deleting keys where user_id = ${userId}`);
    const { error: keysError, count: keysCount } = await supabase
      .from("keys")
      .delete()
      .eq("user_id", userId);

    if (keysError) {
      console.error("Failed to delete keys:", keysError);
      throw keysError;
    }
    console.log(`Deleted ${keysCount} rows from keys`);

    console.log(`Deleting chats where user_id = ${profileId}`);
    const { error: chatsError, count: chatsCount } = await supabase
      .from("chats")
      .delete()
      .eq("user_id", profileId);

    if (chatsError) {
      console.error("Failed to delete chats:", chatsError);
      throw chatsError;
    }
    console.log(`Deleted ${chatsCount} rows from chats (messages cascade deleted)`);

    console.log(`Deleting profile where clerk_id = ${userId}`);
    const { error: profileError, count: profileCount } = await supabase
      .from("profiles")
      .delete()
      .eq("clerk_id", userId);

    if (profileError) {
      console.error("Failed to delete profile:", profileError);
      throw profileError;
    }
    console.log(`Deleted ${profileCount} rows from profiles`);

    // Delete Clerk user (do this LAST so if Supabase fails, user can still retry)
    console.log(`Deleting Clerk user ${userId}`);
    await clerk.users.deleteUser(userId);

    return res.status(200).json({
      success: true,
      message: "Account and all associated data permanently deleted",
      deletions: {
        keys: keysCount,
        chats: chatsCount,
        messages: "cascaded from chats",
        profiles: profileCount,
      },
    });

  } catch (error) {
    console.error("Delete account error:", error);

    return res.status(500).json({
      error: error.message || "Failed to delete account",
    });
  }
}