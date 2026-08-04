(function() {
    // ── Supabase Client ─────────────────────────────
    const SUPABASE_URL = "https://ytrxzjknmfyrifcdupbc.supabase.co";      
    const SUPABASE_ANON_KEY = "sb_publishable_MhUiaPay9WMQyGNKSVZb5Q_kucCQGnk";                
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let currentProfile = null;

    // ── Clerk Initialisation ────────────────────────
    async function initAuth() {
        if (typeof Clerk === 'undefined') { showGuestUI(); return; }
        try {
            await Clerk.load();

            // 1. Ensure Clerk is truly ready
            if (!Clerk.loaded || !Clerk.isSignedIn) {
                showGuestUI();
                return;
            }

            // 2. Register listener once, inside loaded Clerk – no more "is not a function"
            if (!window.__clerkListenerAdded) {
                window.__clerkListenerAdded = true;
                Clerk.addListener(({ user }) => {
                    if (user) {
                        // Call initAuth again to refresh session/profile
                        initAuth();
                    } else {
                        showGuestUI();
                    }
                });
            }

            const clerkUser = Clerk.user;

            // 3. Show dashboard instantly using Clerk identity & cached profile (if any)
            //    This avoids waiting for Supabase and eliminates the infinite loop.
            let cachedProfile = null;
            try {
                const raw = sessionStorage.getItem('cachedProfile');
                if (raw) cachedProfile = JSON.parse(raw);
            } catch {
                sessionStorage.removeItem('cachedProfile');
            }

            // Immediately render with Clerk data + cached profile avatar override
            showDashboardWithClerkAndCache(clerkUser, cachedProfile);

            // 4. Now quietly refresh the profile from Supabase in the background
            await ensureProfile(clerkUser);
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("id, name, avatar")
                .eq("clerk_id", clerkUser.id)
                .single();

            if (error) console.error("Profile fetch error:", error);
            if (profile) {
                currentProfile = profile;
                // Cache for next visit
                sessionStorage.setItem('cachedProfile', JSON.stringify(profile));
                // Update UI if any custom values differ from Clerk
                showDashboardWithClerkAndCache(clerkUser, profile);
            }
        } catch (e) {
            console.error("Auth failed:", e);
            console.log("Session:", Clerk?.session);
            console.log("User:", Clerk?.user);
            showGuestUI();
        }
    }

    // ── Profile upsert (idempotent) ─────────────────
    async function ensureProfile(clerkUser) {
        // Use upsert to avoid race conditions (two simultaneous inserts)
        const { error } = await supabase
            .from("profiles")
            .upsert({
                clerk_id: clerkUser.id,
                name: clerkUser.fullName || clerkUser.firstName || clerkUser.username ||
                    (clerkUser.emailAddresses?.[0]?.emailAddress?.split('@')[0]) || 'there',
                email: clerkUser.primaryEmailAddress?.emailAddress ??
                       clerkUser.emailAddresses?.[0]?.emailAddress ?? "",
                avatar: clerkUser.imageUrl || null
            }, {
                onConflict: "clerk_id"
            });
        if (error) console.error("Profile upsert error:", error);
    }

    async function openSignIn() {
        if (!window.Clerk) return;
        await Clerk.load();
        await Clerk.redirectToSignIn({
            afterSignInUrl: "/app.html",
            afterSignUpUrl: "/app.html"
        });
    }

    // ── Unified UI rendering using Clerk as primary source ──
    function showDashboardWithClerkAndCache(clerkUser, profileOverride = null) {
        const displayName = clerkUser.fullName || clerkUser.firstName || 
                            (profileOverride?.name) || 'there';
        const avatarUrl = clerkUser.imageUrl || (profileOverride?.avatar) || null;

        document.getElementById('signInTopBtn').style.display = 'none';
        document.getElementById('profileAvatar').style.display = 'flex';

        const timeWord = getTimeGreeting();
        document.getElementById('greetingText').textContent = `${timeWord}, ${displayName}.`;
        document.getElementById('statusLine').textContent = 'Ready to start something new?';

        const avatarEl = document.getElementById('profileAvatar');
        if (avatarUrl) {
            avatarEl.innerHTML = `<img src="${avatarUrl}" alt="Profile" class="avatar-img" style="width:100%;height:100%;border-radius:50%;">`;
        } else {
            avatarEl.textContent = displayName.charAt(0).toUpperCase();
        }

        const sidebarAvatar = document.getElementById('sidebarAvatarSmall');
        const sidebarName = document.getElementById('sidebarUserName');
        const sidebarAction = document.getElementById('sidebarUserAction');
        if (avatarUrl) {
            sidebarAvatar.innerHTML = `<img src="${avatarUrl}" alt="Profile">`;
        } else {
            sidebarAvatar.textContent = displayName.charAt(0).toUpperCase();
        }
        sidebarName.textContent = displayName;
        sidebarAction.textContent = 'Manage profile →';
        sidebarAction.onclick = () => location.href = 'profile.html';

        // Only call createIcons once after all DOM updates
        lucide.createIcons();
    }

    function showGuestUI() {
        document.getElementById('signInTopBtn').style.display = 'inline-flex';
        document.getElementById('profileAvatar').style.display = 'none';

        document.getElementById('greetingText').textContent = `${getTimeGreeting()}, Querer.`;
        document.getElementById('statusLine').textContent = 'Your chats and uploaded files are temporary until you sign in.';

        const sidebarAvatar = document.getElementById('sidebarAvatarSmall');
        sidebarAvatar.innerHTML = '<i data-lucide="user-round"></i>';
        document.getElementById('sidebarUserName').textContent = 'Querer';
        document.getElementById('sidebarUserAction').textContent = 'Sign in to sync';
        document.getElementById('sidebarUserAction').onclick = openSignIn;
        lucide.createIcons();
    }

    function getTimeGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }

    // ── Relative Time ────────────────────────────────
    function formatRelativeTime(dateStr) {
        const now = new Date();
        const then = new Date(dateStr);
        const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            const diffHours = Math.floor((now - then) / (1000 * 60 * 60));
            if (diffHours < 1) return 'Just now';
            return `${diffHours}h ago`;
        }
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // ── Data Fetching ──────────────────────────────
    async function fetchRecentChats() {
        if (!currentProfile) return [];
        const { data, error } = await supabase
            .from("chats")
            .select("id, title, created_at")
            .eq("user_id", currentProfile.id)
            .order("created_at", { ascending: false })
            .limit(5);
        if (error) { console.error("Chats fetch error", error); return []; }
        return (data || []).map(chat => ({
            id: chat.id,
            title: chat.title || "New Chat",
            time: formatRelativeTime(chat.created_at)
        }));
    }

    // ── Render Functions ────────────────────────────
    function renderRecentChats(chats) {
        const container = document.getElementById('recentChatsContainer');
        const viewAll = document.getElementById('viewAllChatsLink');
        container.innerHTML = '';

        if (!chats.length) {
            const emptyDiv = createEmptyState('messages-square', 'No conversations yet', 'Start chatting', 'chat.html');
            container.appendChild(emptyDiv);
            viewAll.style.display = 'none';
            return;
        }

        const maxVisible = 5;
        const visibleChats = chats.slice(0, maxVisible);
        visibleChats.forEach(chat => {
            const a = document.createElement('a');
            a.href = `chat.html?id=${chat.id}`;
            a.className = 'chat-item';
            a.innerHTML = `<span class="chat-item-dot"></span>${chat.title}<span class="chat-item-meta">${chat.time}</span>`;
            container.appendChild(a);
        });
        viewAll.style.display = chats.length > maxVisible ? 'inline' : 'none';
    }

    function createEmptyState(iconName, message, actionText, actionLink) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', iconName);
        emptyDiv.appendChild(icon);
        const text = document.createElement('span');
        text.textContent = message;
        emptyDiv.appendChild(text);
        emptyDiv.appendChild(document.createElement('br'));
        const action = document.createElement('a');
        action.href = actionLink;
        action.className = 'empty-action';
        action.innerHTML = `<i data-lucide="arrow-right"></i> ${actionText}`;
        emptyDiv.appendChild(action);
        return emptyDiv;
    }

    // ── Sidebar Logic ────────────────────────────────
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const overlay = document.getElementById('sidebarOverlay');
    const mobileBtn = document.getElementById('mobileMenuBtn');

    function updateCollapseIcon() {
        const isCollapsed = sidebar.classList.contains('collapsed');
        collapseBtn.innerHTML = isCollapsed
            ? '<i data-lucide="panel-left-open"></i>'
            : '<i data-lucide="panel-left-close"></i>';
        lucide.createIcons();
    }

    collapseBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) { sidebar.classList.remove('mobile-open'); overlay.classList.remove('show'); }
        else { sidebar.classList.toggle('collapsed'); localStorage.setItem('quero-sidebar-collapsed', sidebar.classList.contains('collapsed')); updateCollapseIcon(); }
    });
    mobileBtn.addEventListener('click', () => { sidebar.classList.toggle('mobile-open'); overlay.classList.toggle('show'); });
    overlay.addEventListener('click', () => { sidebar.classList.remove('mobile-open'); overlay.classList.remove('show'); });
    window.addEventListener('resize', () => { if (window.innerWidth > 768) { sidebar.classList.remove('mobile-open'); overlay.classList.remove('show'); } });
    if (localStorage.getItem('quero-sidebar-collapsed') === 'true' && window.innerWidth > 768) { sidebar.classList.add('collapsed'); updateCollapseIcon(); }

    // ── Initialise ───────────────────────────────────
    async function initDashboard() {
        document.getElementById('greetingText').textContent = 'Loading…';
        document.getElementById('statusLine').textContent = '';
        document.getElementById('signInTopBtn').addEventListener('click', openSignIn);

        await initAuth();

        const chats = await fetchRecentChats();
        renderRecentChats(chats);
        // All icons are already created inside the rendering functions, no need to call again
        // Dispatch event for any waiting listeners
        window.__dashboardDataReady = true;
        document.dispatchEvent(new CustomEvent("dashboard-data-ready"));
    }

    initDashboard();
})();