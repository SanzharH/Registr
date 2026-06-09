const SESSION_KEY = "kinotower.session";

export function useSession() {
  const session = useState("kinotower-session", () => null);
  const isAuthed = computed(() => Boolean(session.value?.token));

  function initSession() {
    if (!process.client || session.value) {
      return;
    }

    try {
      session.value = JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      session.value = null;
    }
  }

  function saveSession(nextSession) {
    session.value = nextSession;

    if (process.client) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    }
  }

  function clearSession() {
    session.value = null;

    if (process.client) {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  return {
    session,
    isAuthed,
    initSession,
    saveSession,
    clearSession,
  };
}
