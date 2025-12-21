import { useState } from "react";
import { Plus, Trash2, Edit3, Loader2, X, Upload, Linkedin, Twitter, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useGetTeamQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  TeamMember,
} from "@/lib/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const AdminTeam = () => {
  const { data, isLoading, refetch } = useGetTeamQuery();
  const [createMember, { isLoading: isCreating }] = useCreateTeamMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateTeamMemberMutation();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteTeamMemberMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    social_links: {
      linkedin: "",
      twitter: "",
      github: "",
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      email: "",
      social_links: { linkedin: "", twitter: "", github: "" },
    });
    setEditingMember(null);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      email: member.email || "",
      social_links: {
        linkedin: member.social_links?.linkedin || "",
        twitter: member.social_links?.twitter || "",
        github: member.social_links?.github || "",
      },
    });
    setImagePreview(member.image || null);
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
      formDataObj.append("name", formData.name);
      formDataObj.append("role", formData.role);
      formDataObj.append("bio", formData.bio);
      formDataObj.append("email", formData.email);
      formDataObj.append("social_links", JSON.stringify(formData.social_links));

      if (imageFile) {
        formDataObj.append("image", imageFile);
      }

      if (editingMember) {
        const result = await updateMember({
          id: editingMember._id,
          data: formDataObj as any,
        }).unwrap();
        toast.success(result.message || "Team member updated successfully");
      } else {
        const result = await createMember(formDataObj as any).unwrap();
        toast.success(result.message || "Team member created successfully");
      }
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to save team member");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Team Member?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#0A0F1C",
      color: "#ffffff",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteMember(id).unwrap();
      toast.success(response.message || "Team member deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete team member");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Team Management
            </h1>
            <p className="text-white/60">
              Add and manage your team members
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white font-bold px-6 py-3 rounded-xl hover:shadow-[0_0_30px_rgba(0,217,255,0.5)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#00D9FF]" />
          </div>
        )}

        {/* Team Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items && data.items.length > 0 ? (
              data.items.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                    {member.image && (
                      <div className="relative mb-6 overflow-hidden rounded-xl">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-[#00D9FF] font-semibold text-sm mb-2">
                        {member.role}
                      </p>
                      {member.email && (
                        <p className="text-xs text-white/50">
                          {member.email}
                        </p>
                      )}
                    </div>
                    <p className="text-white/60 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {member.bio}
                    </p>
                    
                    {/* Social Links */}
                    {(member.social_links?.linkedin || member.social_links?.twitter || member.social_links?.github) && (
                      <div className="flex items-center gap-2 mb-6 pb-6 border-b border-white/10">
                        {member.social_links?.linkedin && (
                          <a href={member.social_links.linkedin} target="_blank" rel="noopener noreferrer" 
                            className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00D9FF]/20 transition-colors">
                            <Linkedin className="w-4 h-4 text-white/60" />
                          </a>
                        )}
                        {member.social_links?.twitter && (
                          <a href={member.social_links.twitter} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00D9FF]/20 transition-colors">
                            <Twitter className="w-4 h-4 text-white/60" />
                          </a>
                        )}
                        {member.social_links?.github && (
                          <a href={member.social_links.github} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00D9FF]/20 transition-colors">
                            <Github className="w-4 h-4 text-white/60" />
                          </a>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(member)}
                        className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member._id)}
                        disabled={isDeleting}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-white/50 text-lg">
                  No team members yet. Add one to get started!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#0A0F1C]/95 backdrop-blur-xl flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">
                      Role *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                      placeholder="Lead Developer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">
                    Bio *
                  </label>
                  <textarea
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all h-24 resize-none"
                    placeholder="Tell us about this team member..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white/70 mb-3 uppercase tracking-wider">
                    Profile Image
                  </label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border border-white/10"
                      />
                    )}
                    <label className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                      <Upload className="w-5 h-5 text-white/60" />
                      <span className="text-sm font-medium text-white/60">
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
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-white/70 mb-3 uppercase tracking-wider">
                    Social Links
                  </label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={formData.social_links.linkedin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social_links: { ...formData.social_links, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                      placeholder="LinkedIn URL"
                    />
                    <input
                      type="url"
                      value={formData.social_links.twitter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social_links: { ...formData.social_links, twitter: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                      placeholder="Twitter URL"
                    />
                    <input
                      type="url"
                      value={formData.social_links.github}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social_links: { ...formData.social_links, github: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                      placeholder="GitHub URL"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex-1 bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white font-bold hover:shadow-[0_0_30px_rgba(0,217,255,0.5)]"
                  >
                    {(isCreating || isUpdating) && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    {editingMember ? "Update" : "Create"} Member
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

export default AdminTeam;