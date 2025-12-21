import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit3, Loader2, X, MapPin, Briefcase, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  JobPosting,
  useAdminListJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "@/lib/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type JobFormState = {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirementsText: string;
  responsibilitiesText: string;
  is_active: boolean;
  order: number;
};

const defaultForm: JobFormState = {
  title: "",
  department: "",
  location: "",
  type: "",
  description: "",
  requirementsText: "",
  responsibilitiesText: "",
  is_active: true,
  order: 0,
};

const AdminCareers = () => {
  const { data, isLoading, isFetching, refetch } = useAdminListJobsQuery();
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [formData, setFormData] = useState<JobFormState>({ ...defaultForm });

  const openCreate = () => {
    setEditingJob(null);
    setFormData({ ...defaultForm });
    setIsModalOpen(true);
  };

  const openEdit = (job: JobPosting) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirementsText: (job.requirements || []).join("\n"),
      responsibilitiesText: (job.responsibilities || []).join("\n"),
      is_active: job.is_active ?? true,
      order: job.order ?? 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
    setFormData({ ...defaultForm });
  };

  const parseListField = (value: string) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requirements = parseListField(formData.requirementsText);
    const responsibilities = parseListField(formData.responsibilitiesText);

    if (!requirements.length || !responsibilities.length) {
      toast.error("Add at least one requirement and responsibility");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      department: formData.department.trim(),
      location: formData.location.trim(),
      type: formData.type.trim(),
      description: formData.description.trim(),
      requirements,
      responsibilities,
      is_active: formData.is_active,
      order: Number.isFinite(formData.order) ? Number(formData.order) : 0,
    };

    try {
      if (editingJob) {
        const res = await updateJob({ id: editingJob._id, data: payload }).unwrap();
        toast.success(res.message || "Job updated");
      } else {
        const res = await createJob(payload).unwrap();
        toast.success(res.message || "Job created");
      }
      closeModal();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to save job");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete job?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteJob(id).unwrap();
      toast.success("Job deleted");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to delete job");
    }
  };

  const jobs = data?.items || [];

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
                Career Opportunities
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Post and manage job openings
              </p>
            </div>
            <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          </div>
        </div>

        {(isLoading || isFetching) && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Loading jobs...
              </p>
            </div>
          </div>
        )}

        {!isLoading && !jobs.length && (
          <div className="crm-card rounded-xl p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                No job postings yet
              </p>
              <Button onClick={openCreate} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                Create your first job
              </Button>
            </div>
          </div>
        )}

        {!isLoading && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="crm-card rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        job.is_active === false 
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" 
                          : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                      }`}>
                        {job.is_active === false ? "Inactive" : "Active"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md font-medium">
                          {job.department}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => openEdit(job)}
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(job._id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete"
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="crm-card rounded-2xl w-full max-w-4xl my-8"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingJob ? "Edit Job" : "Post New Job"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Senior React Developer"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Department *
                    </label>
                    <Input
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Engineering"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <Input
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Remote / San Francisco"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Employment Type *
                    </label>
                    <Input
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="Full-time"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Short Description *
                  </label>
                  <Textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Give a quick overview of this role."
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Requirements (one per line) *
                    </label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.requirementsText}
                      onChange={(e) => setFormData({ ...formData, requirementsText: e.target.value })}
                      placeholder={"5+ years experience\nStrong with React\nGood communication"}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Responsibilities (one per line) *
                    </label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.responsibilitiesText}
                      onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })}
                      placeholder={"Build features\nReview code\nCollaborate with design"}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Order (lower shows first)
                    </label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 0 })}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <label
                      htmlFor="is_active"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Active
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button type="button" onClick={closeModal} variant="outline" className="flex-1 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isCreating || isUpdating}
                  >
                    {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {editingJob ? "Update Job" : "Create Job"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCareers;