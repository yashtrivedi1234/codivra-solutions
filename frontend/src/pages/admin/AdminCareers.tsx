import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit3, Loader2, X, MapPin, Briefcase, Clock, Search } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

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
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
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
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 -m-6 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Career Opportunities</h1>
              <p className="text-sm text-gray-500 mt-1">
                Post and manage job openings
              </p>
            </div>
            <Button 
              onClick={openCreate} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{filteredJobs.length}</span>
              <span>jobs</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {(isLoading || isFetching) && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredJobs.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No jobs found" : "No job postings yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "Try adjusting your search" : "Create your first job posting"}
            </p>
            {!searchQuery && (
              <Button 
                onClick={openCreate} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            )}
          </div>
        )}

        {/* Jobs List */}
        {!isLoading && filteredJobs.length > 0 && (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        job.is_active === false 
                          ? "bg-gray-100 text-gray-600" 
                          : "bg-green-100 text-green-600"
                      }`}>
                        {job.is_active === false ? "Inactive" : "Active"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-medium">
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
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEdit(job)}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 rounded"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingJob ? "Edit Job" : "Post New Job"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Senior React Developer"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Engineering"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Remote / San Francisco"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="Full-time"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Quick overview of this role..."
                    className="text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Requirements (one per line) <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      required
                      rows={4}
                      value={formData.requirementsText}
                      onChange={(e) => setFormData({ ...formData, requirementsText: e.target.value })}
                      placeholder={"5+ years experience\nStrong with React\nGood communication"}
                      className="text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Responsibilities (one per line) <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      required
                      rows={4}
                      value={formData.responsibilitiesText}
                      onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })}
                      placeholder={"Build features\nReview code\nCollaborate with design"}
                      className="text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Order
                    </label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 0 })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-xs font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <Button 
                    type="button" 
                    onClick={closeModal} 
                    className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium"
                    disabled={isCreating || isUpdating}
                  >
                    {(isCreating || isUpdating) && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                    {editingJob ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCareers;