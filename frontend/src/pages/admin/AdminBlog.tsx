import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit3, Loader2, X, Upload, Eye, Calendar, User, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useGetBlogQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  BlogPost,
} from "@/lib/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AdminBlog = () => {
  const { data, isLoading, refetch } = useGetBlogQuery();
  const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
    });
    setEditingPost(null);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
    });
    setImagePreview(post.image || null);
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
      formDataObj.append("excerpt", formData.excerpt);
      formDataObj.append("content", formData.content);
      formDataObj.append("author", formData.author);
      formDataObj.append("category", formData.category);

      if (imageFile) {
        formDataObj.append("image", imageFile);
      }

      if (editingPost) {
        const result = await updatePost({
          id: editingPost._id,
          data: formDataObj as any,
        }).unwrap();
        toast.success(result.message || "Blog post updated successfully");
      } else {
        const result = await createPost(formDataObj as any).unwrap();
        toast.success(result.message || "Blog post created successfully");
      }
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to save blog post");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Blog Post?",
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
      const response = await deletePost(id).unwrap();
      toast.success(response.message || "Blog post deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete blog post");
    }
  };

  const posts = data?.items || [];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0A0F1C] p-6">
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
            box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.3);
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-in {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Blog Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create and manage your blog posts
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={isCreating || isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="crm-card rounded-2xl max-w-3xl w-full my-8 animate-slide-in">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingPost ? "Edit Blog Post" : "Create Blog Post"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
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
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Author name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Technology, Design, etc."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                    placeholder="Brief summary of the post"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                    placeholder="Full post content"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Cover Image
                  </label>
                  {imagePreview && (
                    <div className="mb-3 relative rounded-xl overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {imageFile ? imageFile.name : "Click to upload image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 border-gray-200 dark:border-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {editingPost ? "Update" : "Create"} Post
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blog Posts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Loading posts...
              </p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="crm-card rounded-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Eye className="w-8 h-8 text-gray-400 dark:text-gray-600" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold mb-1">
                  No blog posts yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create your first post to get started
                </p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="crm-card rounded-xl overflow-hidden group"
              >
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(post.created_at || "").toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(post)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      disabled={isUpdating || isDeleting}
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(post._id)}
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

export default AdminBlog;