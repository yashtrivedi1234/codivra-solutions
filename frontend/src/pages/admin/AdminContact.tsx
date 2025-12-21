import { Button } from "@/components/ui/button";
import { Trash2, Eye, Loader2, Mail, MessageSquare, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useAdminListContactsQuery,
  useAdminDeleteContactMutation,
  useAdminToggleContactReadMutation,
  ContactSubmission,
} from "@/lib/api";

const AdminContact = () => {
  const { data, isLoading, isFetching, refetch } = useAdminListContactsQuery();
  const [deleteContact, { isLoading: isDeleting }] = useAdminDeleteContactMutation();
  const [toggleRead, { isLoading: isToggling }] = useAdminToggleContactReadMutation();

  const items: ContactSubmission[] = data?.items || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id).unwrap();
      refetch();
    } catch (err) {}
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await toggleRead(id).unwrap();
      refetch();
    } catch (err) {}
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0A0F1C] px-6 py-8">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            letter-spacing: -0.01em;
          }

          .crm-card {
            background: white;
            border: 1px solid #E5E7EB;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
            transition: all 0.2s ease;
          }

          .dark .crm-card {
            background: rgba(15, 23, 42, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(20px);
          }

          .crm-card:hover {
            box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);
            border-color: #D1D5DB;
          }

          .dark .crm-card:hover {
            border-color: rgba(255, 255, 255, 0.1);
          }
        `}</style>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Contact Submissions
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage and respond to customer inquiries
              </p>
            </div>
          </div>
        </div>

        {(isLoading || isFetching) && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Loading submissions...
              </p>
            </div>
          </div>
        )}

        {!isLoading && !items.length && (
          <div className="crm-card rounded-xl p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                No contact submissions yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Customer inquiries will appear here
              </p>
            </div>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="space-y-4">
            {items.map((submission, idx) => (
              <motion.div
                key={submission._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`crm-card rounded-xl p-6 ${!submission.read ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {submission.name}
                      </h3>
                      {!submission.read && (
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg">
                          New
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{submission.email}</span>
                      </div>
                      {submission.created_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(submission.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold">
                        <MessageSquare className="w-4 h-4" />
                        {submission.service}
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {submission.message}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleMarkAsRead(submission._id)}
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title={submission.read ? "Mark as unread" : "Mark as read"}
                      disabled={isToggling}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(submission._id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContact;