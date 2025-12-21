import AdminNotifications from "@/components/admin/AdminNotifications";

export default function NotificationsPage() {
  return (
    <div className="p-6" style={{ color: 'black' }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'black' }}>All Notifications</h1>
      <AdminNotifications showAllPage />
    </div>
  );
}
