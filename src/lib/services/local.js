const SESSION_KEY = "petandvet_sessionid";

export function saveSessionId(id) {
    localStorage.setItem(SESSION_KEY, id);
}

export function getSessionId() {
    return localStorage.getItem(SESSION_KEY);
}

export function removeSessionId() {
    localStorage.removeItem(SESSION_KEY);
}