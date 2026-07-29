// Code Commenter
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
            const clerkUser = Clerk.user;
            if (!clerkUser) { showGuestUI(); return; }
            await ensureProfile(clerkUser);
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("id, name, avatar")
                .eq("clerk_id", clerkUser.id)
                .single();
            if (error || !profile) { showGuestUI(); return; }
            currentProfile = profile;
            showAuthenticatedUI(profile);
        } catch (e) {
            console.error("Auth error", e);
            showGuestUI();
        }
    }

    async function ensureProfile(clerkUser) {
        const { data } = await supabase
            .from("profiles")
            .select("id")
            .eq("clerk_id", clerkUser.id)
            .maybeSingle();
        if (!data) {
            await supabase.from("profiles").insert({
                clerk_id: clerkUser.id,
                name: clerkUser.firstName || clerkUser.username ||
                    (clerkUser.emailAddresses?.[0]?.emailAddress?.split('@')[0]) || 'there',
                email: clerkUser.primaryEmailAddress?.emailAddress || '',
                avatar: clerkUser.imageUrl || null
            });
        }
    }

    async function openSignIn() {
        if (!window.Clerk) return;
        await Clerk.load();
        await Clerk.redirectToSignIn({
            afterSignInUrl: location.origin + "/app.html",
            afterSignUpUrl: location.origin + "/app.html"
        });
    }

    // ── UI Rendering ─────────────────────────────────
    function showAuthenticatedUI(profile) {
        document.getElementById('signInTopBtn').style.display = 'none';
        document.getElementById('profileAvatar').style.display = 'flex';

        const timeWord = getTimeGreeting();
        document.getElementById('greetingText').textContent = `${timeWord}, ${profile.name}.`;
        document.getElementById('statusLine').textContent = 'Ready to start something new?';

        const avatarEl = document.getElementById('profileAvatar');
        if (profile.avatar) {
            avatarEl.innerHTML = `<img src="${profile.avatar}" alt="Profile" class="avatar-img" style="width:100%;height:100%;border-radius:50%;">`;
        } else {
            avatarEl.textContent = (profile.name || 'A').charAt(0).toUpperCase();
        }

        const sidebarAvatar = document.getElementById('sidebarAvatarSmall');
        const sidebarName = document.getElementById('sidebarUserName');
        const sidebarAction = document.getElementById('sidebarUserAction');
        if (profile.avatar) {
            sidebarAvatar.innerHTML = `<img src="${profile.avatar}" alt="Profile">`;
        } else {
            sidebarAvatar.textContent = (profile.name || 'A').charAt(0).toUpperCase();
        }
        sidebarName.textContent = profile.name;
        sidebarAction.textContent = 'Manage profile →';
        sidebarAction.onclick = () => location.href = 'profile.html';
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
            lucide.createIcons();
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
        lucide.createIcons();
    }

    initDashboard();
})();