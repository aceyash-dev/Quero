import { createClerkClient } from "@clerk/backend";
import { createClient } from "@supabase/supabase-js";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.replace("Bearer ", "");

    try {
        // Verify Clerk JWT – `verifyToken()` is the correct method in @clerk/backend
        const payload = await clerk.verifyToken(token);
        const userId = payload.sub;

        // Delete Supabase rows (use an array for maintainability)
        const tables = ["messages", "chats", "settings"];
        for (const table of tables) {
            await supabase.from(table).delete().eq("user_id", userId);
        }

        // Delete Clerk user
        await clerk.users.deleteUser(userId);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Delete account error:", error);
        return res.status(500).json({ error: "Failed to delete account" });
    }
}