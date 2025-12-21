import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAdminListContactsQuery, useGetJobApplicationsQuery } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminNotifications({ showAllPage = false }: { showAllPage?: boolean }) {
  const { data: contactData, isLoading: contactLoading } = useAdminListContactsQuery();
  const { data: careerData, isLoading: careerLoading } = useGetJobApplicationsQuery();
  const contactSubmissions = contactData?.items || [];
  const careerApplications = careerData?.items || [];

  // Contact notifications
  const unreadContacts = contactSubmissions.filter((c) => !c.read);
  const contactNotifications = unreadContacts.map((c) => ({
    id: c._id,
    type: "contact",
    title: "New Contact Submission",
    message: `${c.name} filled the contact form`,
    time: c.created_at ? new Date(c.created_at).toLocaleString() : "",
    read: false,
    email: c.email,
    service: c.service,
    messageText: c.message,
  }));

  // Career notifications
  const careerNotifications = careerApplications.map((a) => ({
    id: a._id,
    type: "career",
    title: "New Career Application",
    message: `${a.name} applied for ${a.job_title}`,
    time: a.created_at ? new Date(a.created_at).toLocaleString() : "",
    read: false,
    email: a.email,
    jobTitle: a.job_title,
    messageText: a.cover_letter,
  }));

  // Combine and sort all notifications
  const allNotifications = [...contactNotifications, ...careerNotifications]
    .sort((a, b) => (b.time > a.time ? 1 : -1));

  const [showAll, setShowAll] = useState(showAllPage);
  const latestNotifications = allNotifications.slice(0, 3);
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setShowAll(false)}
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {allNotifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-sm font-semibold">Notifications</span>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
            {allNotifications.length} New
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {(contactLoading || careerLoading) ? (
            <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
          ) : (showAll ? (
            allNotifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No notifications.</div>
            ) : allNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all hover:bg-gray-50 ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? "bg-transparent" : "bg-blue-500"}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {notification.title}
                      {notification.type === "career" && (
                        <span className="ml-1 text-xs text-green-600 font-medium">(Career)</span>
                      )}
                      {notification.type === "contact" && (
                        <span className="ml-1 text-xs text-blue-600 font-medium">(Contact)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            latestNotifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No new notifications.</div>
            ) : latestNotifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all hover:bg-gray-50 bg-blue-50"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {notification.title}
                      {notification.type === "career" && (
                        <span className="ml-1 text-xs text-green-600 font-medium">(Career)</span>
                      )}
                      {notification.type === "contact" && (
                        <span className="ml-1 text-xs text-blue-600 font-medium">(Contact)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ))}
        </div>
        <DropdownMenuSeparator />
        {!showAllPage && (
          <button
            className="w-full text-center px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/admin/notifications")}
          >
            View All Notifications
          </button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}