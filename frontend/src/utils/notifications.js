import api from "../api/axios";

export async function fetchNotifications() {
  const res = await api.get("/notifications/");
  return {
    notifications: res.data.notifications || [],
    unreadCount: res.data.unread_count || 0,
  };
}

export async function markNotificationRead(id) {
  await api.put(`/notifications/${id}/read`);
}

export async function markAllRead() {
  await api.put("/notifications/read-all");
}

export async function clearNotifications() {
  await api.delete("/notifications/");
}
