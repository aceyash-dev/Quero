// /api/delete-account.js (or .ts)
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST() {
    const { userId } = await auth();
    if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all user data (customise tables as needed)
    await supabase.from("messages").delete().eq("user_id", userId);
    await supabase.from("chats").delete().eq("user_id", userId);
    await supabase.from("settings").delete().eq("user_id", userId);
    // … any other user‑related tables

    // Delete Clerk account
    const clerk = await clerkClient();
    await clerk.users.deleteUser(userId);

    return Response.json({ success: true });
}