import { useState } from "react";
import { Search, Loader2, Mail, Phone, Building2, FileText, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useAdminListInquiriesQuery,
  useAdminDeleteInquiryMutation,
  useAdminToggleInquiryReadMutation,
  InquirySubmission,
} from "@/lib/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const AdminInquiry = () => {
  const { data, isLoading, refetch } = useAdminListInquiriesQuery();
  const [deleteInquiry, { isLoading: isDeleting }] = useAdminDeleteInquiryMutation();
  const [toggleRead] = useAdminToggleInquiryReadMutation();
  const [searchQuery, setSearchQuery] = useState("");

  const items = data?.items || [];
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.company && item.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Inquiry?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteInquiry(id).unwrap();
      toast.success("Inquiry deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete inquiry");
    }
  };

  const handleToggleRead = async (id: string) => {
    try {
      await toggleRead(id).unwrap();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update inquiry status");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 -m-6 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Inquiry Submissions</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage customer inquiries and questions
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{filteredItems.length}</span>
              <span>inquiries</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-500 font-medium">
                Loading inquiries...
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !items.length && (
          <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-full">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No inquiries yet
              </p>
              <p className="text-sm text-gray-400">
                Customer inquiries will appear here
              </p>
            </div>
          </div>
        )}

        {/* Inquiries List */}
        {!isLoading && items.length > 0 && (
          <div className="space-y-4">
            {filteredItems.map((inquiry, idx) => (
              <motion.div
                key={inquiry._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`bg-white rounded-lg border border-gray-200 p-6 ${
                  !inquiry.read ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {inquiry.name}
                      </h3>
                      {!inquiry.read && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${inquiry.email}`} className="hover:text-blue-600">
                          {inquiry.email}
                        </a>
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a href={`tel:${inquiry.phone}`} className="hover:text-blue-600">
                            {inquiry.phone}
                          </a>
                        </div>
                      )}
                      {inquiry.company && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span>{inquiry.company}</span>
                        </div>
                      )}
                      {inquiry.service && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                            {inquiry.service}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Subject:</h4>
                      <p className="text-sm text-gray-900">{inquiry.subject}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Message:</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {inquiry.message}
                      </p>
                    </div>

                    {inquiry.created_at && (
                      <p className="text-xs text-gray-400 mt-4">
                        Received on {new Date(inquiry.created_at).toLocaleString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleRead(inquiry._id)}
                      className={`${
                        inquiry.read 
                          ? 'text-gray-600 hover:text-blue-600' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(inquiry._id)}
                      disabled={isDeleting}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && items.length > 0 && filteredItems.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No inquiries match your search</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInquiry;