const KEY = "notifications";

export function getNotifications() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addNotification({ title, message }) {
  const list = getNotifications();
  const item = {
    id: Date.now(),
    title,
    message,
    date: new Date().toISOString(),
    read: false,
  };

  list.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  return item;
}

export function clearNotifications() {
  localStorage.removeItem(KEY);
}

export function markAllRead() {
  const list = getNotifications();
  const updated = list.map((n) => ({ ...n, read: true }));
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export default { getNotifications, addNotification, clearNotifications, markAllRead };
