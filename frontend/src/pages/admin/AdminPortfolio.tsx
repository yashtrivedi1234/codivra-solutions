import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit3, Loader2, X, Upload, ExternalLink, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useGetPortfolioQuery,
  useCreatePortfolioItemMutation,
  useUpdatePortfolioItemMutation,
  useDeletePortfolioItemMutation,
  PortfolioItem,
} from "@/lib/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AdminPortfolio = () => {
  const { data, isLoading, refetch } = useGetPortfolioQuery();
  const [createItem, { isLoading: isCreating }] = useCreatePortfolioItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdatePortfolioItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeletePortfolioItemMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      link: "",
    });
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      link: item.link || "",
    });
    setImagePreview(item.image || null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);
      formDataObj.append("category", formData.category);
      formDataObj.append("link", formData.link || "");

      if (imageFile) {
        formDataObj.append("image", imageFile);
      }

      if (editingItem) {
        const result = await updateItem({
          id: editingItem._id,
          data: formDataObj as any,
        }).unwrap();
        toast.success(result.message || "Portfolio item updated successfully");
      } else {
        const result = await createItem(formDataObj as any).unwrap();
        toast.success(result.message || "Portfolio item created successfully");
      }
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to save portfolio item");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Portfolio Item?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteItem(id).unwrap();
      toast.success(response.message || "Portfolio item deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete portfolio item");
    }
  };

  const items = data?.items || [];

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

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Portfolio Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Showcase your best work and projects
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={isCreating || isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="crm-card rounded-2xl max-w-3xl w-full my-8"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                    placeholder="Project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                    required
                    placeholder="Brief project description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                      required
                      placeholder="e.g., Web Design"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Project Image
                  </label>
                  {imagePreview && (
                    <div className="mb-3 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}
                  <label className="flex items-center gap-3 px-4 py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {imageFile ? imageFile.name : "Choose an image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {editingItem ? "Update" : "Create"} Item
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Loading projects...
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="crm-card rounded-xl p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                No portfolio items yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add your first project to showcase your work
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="crm-card rounded-xl overflow-hidden group"
              >
                {item.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                      {item.category}
                    </span>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(item)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-blue-600 dark:text-blue-400 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      disabled={isUpdating || isDeleting}
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item._id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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

export default AdminPortfolio;