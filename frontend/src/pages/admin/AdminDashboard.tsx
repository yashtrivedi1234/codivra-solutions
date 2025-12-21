import { useNavigate } from "react-router-dom";
import {
  useGetJobApplicationsQuery,
  useDeleteJobApplicationMutation,
  useAdminListPagesQuery,
  useAdminUpsertPageSectionMutation,
  useAdminDeletePageSectionMutation,
  PageSection,
  useGetTeamQuery,
  useGetServicesQuery,
  useGetPortfolioQuery,
  useGetBlogQuery,
  useAdminListContactsQuery,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Briefcase,
  FileText,
  Plus,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Edit3,
  Mail,
  Phone,
  Eye,
  Download,
  Filter,
  Calendar,
  Tag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetJobApplicationsQuery();
  const [deleteApplication, { isLoading: isDeleting }] = useDeleteJobApplicationMutation();
  const { data: pagesData, isLoading: isLoadingPages, refetch: refetchPages } = useAdminListPagesQuery();
  const [upsertPage] = useAdminUpsertPageSectionMutation();
  const [deletePageSection, { isLoading: isDeletingSection }] = useAdminDeletePageSectionMutation();
  const { toast } = useToast();
  const [editing, setEditing] = useState<{
    id?: string;
    page: string;
    key: string;
    data: string;
  } | null>(null);
  
  const { data: teamData } = useGetTeamQuery();
  const { data: servicesData } = useGetServicesQuery();
  const { data: portfolioData } = useGetPortfolioQuery();
  const { data: blogData } = useGetBlogQuery();
  const { data: contactsData } = useAdminListContactsQuery();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      await deleteApplication(id).unwrap();
      toast({ title: "Deleted", description: "The application has been removed." });
      refetch();
    } catch (error) {
      toast({ title: "Delete failed", description: "Could not delete application.", variant: "destructive" });
    }
  };

  // Chart data
  const applicationData = (() => {
    if (!data?.items) return [];
    const byMonth = {};
    data.items.forEach(app => {
      if (!app.created_at) return;
      const month = new Date(app.created_at).toLocaleString('default', { month: 'short' });
      if (!byMonth[month]) byMonth[month] = { month, applications: 0, approved: 0 };
      byMonth[month].applications += 1;
    });
    return ["Jan","Feb","Mar","Apr","May","Jun"]
      .map(m => byMonth[m] || { month: m, applications: 0, approved: 0 });
  })();

  const pageViewsData = (() => {
    if (!contactsData?.items) return [];
    const byDay = {};
    contactsData.items.forEach(msg => {
      if (!msg.created_at) return;
      const day = new Date(msg.created_at).toLocaleString('en-US', { weekday: 'short' });
      if (!byDay[day]) byDay[day] = { date: day, views: 0, users: 0 };
      byDay[day].views += 1;
      byDay[day].users += 1;
    });
    return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
      .map(d => byDay[d] || { date: d, views: 0, users: 0 });
  })();

  const projectDistribution = [
    { name: 'In Progress', value: portfolioData?.items?.length || 0, color: '#3B82F6' },
    { name: 'Completed', value: (portfolioData?.items?.length || 0) * 2, color: '#10B981' },
    { name: 'Pending', value: Math.floor((portfolioData?.items?.length || 0) * 0.5), color: '#F59E0B' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 -m-6 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                +12%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{data?.items?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">+3 this week</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                +8%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamData?.items?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Active employees</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                +15%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{portfolioData?.items?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">In development</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                +23%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Blog Posts</p>
              <p className="text-2xl font-bold text-gray-900">{blogData?.items?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Published content</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Applications Trend */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Applications Trend</h3>
                <p className="text-sm text-gray-500 mt-1">Monthly submissions</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={applicationData}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorApplications)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Project Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Project Status</h3>
              <p className="text-sm text-gray-500 mt-1">Current distribution</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={projectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {projectDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Engagement */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Weekly Engagement</h3>
              <p className="text-sm text-gray-500 mt-1">User activity metrics</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={pageViewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
              <p className="text-sm text-gray-500 mt-1">Manage career applications</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-500">Loading applications...</p>
              </div>
            </div>
          )}
          
          {isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Failed to load applications</p>
                  <p className="text-sm text-red-700 mt-1">Please ensure backend is running.</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.items?.length ? (
                    data.items.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{app.job_title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-gray-200">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.name}`} />
                              <AvatarFallback className="text-xs bg-blue-50 text-blue-600">
                                {app.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{app.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span className="text-xs">{app.email}</span>
                            </div>
                            {app.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span className="text-xs">{app.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-sm text-gray-600">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            }) : "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(app._id)}
                              disabled={isDeleting}
                              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <Briefcase className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">No applications yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Content Management Section - Continued in next part */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>
              <p className="text-sm text-gray-500 mt-1">Manage page sections</p>
            </div>
            <Button
              size="sm"
              onClick={() =>
                setEditing({
                  page: "home",
                  key: "hero",
                  data: JSON.stringify({ title: "Your content here" }, null, 2),
                })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Section
            </Button>
          </div>

          {isLoadingPages && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-500">Loading content...</p>
              </div>
            </div>
          )}

          {!isLoadingPages && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pagesData?.sections?.length ? (
                    pagesData.sections.map((section: PageSection) => (
                      <tr key={section._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium text-sm">
                            <Tag className="w-3 h-3" />
                            {section.page}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{section.key}</span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-sm text-gray-600">
                            {section.updated_at ? new Date(section.updated_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            }) : "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                setEditing({
                                  id: section._id,
                                  page: section.page,
                                  key: section.key,
                                  data: JSON.stringify(section.data ?? {}, null, 2),
                                })
                              }
                              className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              disabled={isDeletingSection}
                              onClick={async () => {
                                if (!window.confirm("Delete this section?")) return;
                                try {
                                  await deletePageSection(section._id).unwrap();
                                  toast({ title: "Deleted", description: "Section removed." });
                                  refetchPages();
                                } catch (error) {
                                  toast({ title: "Delete failed", description: "Could not delete section.", variant: "destructive" });
                                }
                              }}
                              className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">No sections yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Recent Contacts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Recent Contacts</h3>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {(contactsData?.items || []).slice(0, 5).map(msg => (
                <div key={msg._id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${msg.name}`} />
                    <AvatarFallback className="text-xs bg-blue-50 text-blue-600">
                      {msg.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{msg.name}</p>
                    <p className="text-xs text-gray-500 truncate">{msg.email}</p>
                  </div>
                </div>
              ))}
              {(!contactsData?.items || contactsData.items.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No contacts yet</p>
              )}
            </div>
          </div>

          {/* Recent Blog Posts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Latest Posts</h3>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {(blogData?.items || []).slice(0, 5).map(post => (
                <div key={post._id} className="p-2 rounded-lg hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900 truncate mb-1">{post.title}</p>
                  <p className="text-xs text-gray-500">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </p>
                </div>
              ))}
              {(!blogData?.items || blogData.items.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No posts yet</p>
              )}
            </div>
          </div>

          {/* Portfolio Projects */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Portfolio</h3>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {(portfolioData?.items || []).slice(0, 5).map(item => (
                <div key={item._id} className="p-2 rounded-lg hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900 truncate mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </p>
                </div>
              ))}
              {(!portfolioData?.items || portfolioData.items.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No projects yet</p>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Team</h3>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {(teamData?.items || []).slice(0, 5).map(member => (
                <div key={member._id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                    <AvatarFallback className="text-xs bg-green-50 text-green-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 truncate">{member.role}</p>
                  </div>
                </div>
              ))}
              {(!teamData?.items || teamData.items.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No members yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {editing.id ? "Edit Section" : "Create Section"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Configure page content</p>
                </div>
                <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editing.page}
                    onChange={(e) => setEditing({ ...editing, page: e.target.value } as any)}
                    placeholder="home"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Key</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editing.key}
                    onChange={(e) => setEditing({ ...editing, key: e.target.value } as any)}
                    placeholder="hero"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">JSON Configuration</label>
                <textarea
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={editing.data}
                  onChange={(e) => setEditing({ ...editing, data: e.target.value } as any)}
                  placeholder='{\n  "title": "Your content"\n}'
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setEditing(null)} className="px-4">
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const parsed = JSON.parse(editing.data);
                      await upsertPage({ page: editing.page, key: editing.key, data: parsed }).unwrap();
                      toast({ title: "Saved", description: "Section updated successfully." });
                      setEditing(null);
                      refetchPages();
                    } catch (error: any) {
                      toast({ title: "Save Failed", description: error?.message || "Check JSON syntax.", variant: "destructive" });
                    }
                  }}
                  className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;