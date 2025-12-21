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
  ChevronRight,
  Edit3,
  Mail,
  Phone,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  Tag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Zap,
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
  const [deleteApplication, { isLoading: isDeleting }] =
    useDeleteJobApplicationMutation();
  const {
    data: pagesData,
    isLoading: isLoadingPages,
    refetch: refetchPages,
  } = useAdminListPagesQuery();
  const [upsertPage] = useAdminUpsertPageSectionMutation();
  const [deletePageSection, { isLoading: isDeletingSection }] =
    useAdminDeletePageSectionMutation();
  const { toast } = useToast();
  const [editing, setEditing] = useState<{
    id?: string;
    page: string;
    key: string;
    data: string;
  } | null>(null);
  const { data: teamData, isLoading: isLoadingTeam } = useGetTeamQuery();
  const { data: servicesData, isLoading: isLoadingServices } = useGetServicesQuery();
  const { data: portfolioData, isLoading: isLoadingPortfolio } = useGetPortfolioQuery();
  const { data: blogData, isLoading: isLoadingBlog } = useGetBlogQuery();
  const { data: contactsData, isLoading: isLoadingContacts } = useAdminListContactsQuery();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      await deleteApplication(id).unwrap();
      toast({
        title: "Deleted",
        description: "The application has been removed.",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete application:", error);
      toast({
        title: "Delete failed",
        description: "Could not delete application. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Dynamic data for charts
  const applicationData = (() => {
    if (!data?.items) return [];
    const byMonth = {};
    data.items.forEach(app => {
      if (!app.created_at) return;
      const date = new Date(app.created_at);
      const month = date.toLocaleString('default', { month: 'short' });
      if (!byMonth[month]) byMonth[month] = { month, applications: 0, approved: 0 };
      byMonth[month].applications += 1;
      if ('status' in app && app.status === 'approved') byMonth[month].approved += 1;
    });
    const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return monthOrder
      .map(m => byMonth[m] || { month: m, applications: 0, approved: 0 })
      .slice(0, 6);
  })();

  const pageViewsData = (() => {
    if (!contactsData?.items) return [];
    const byDay = {};
    contactsData.items.forEach(msg => {
      if (!msg.created_at) return;
      const date = new Date(msg.created_at);
      const day = date.toLocaleString('en-US', { weekday: 'short' });
      if (!byDay[day]) byDay[day] = { date: day, views: 0, users: 0 };
      byDay[day].views += 1;
      byDay[day].users += 1;
    });
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    return days.map(d => byDay[d] || { date: d, views: 0, users: 0 });
  })();

  // Project distribution data for pie chart
  const projectDistribution = [
    { name: 'In Progress', value: portfolioData?.items?.length || 0, color: '#3B82F6' },
    { name: 'Completed', value: (portfolioData?.items?.length || 0) * 2, color: '#10B981' },
    { name: 'Pending', value: Math.floor((portfolioData?.items?.length || 0) * 0.5), color: '#F59E0B' },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0A0F1C] px-6 py-8">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
          
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            letter-spacing: -0.01em;
          }
          
          .mono {
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            letter-spacing: -0.02em;
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

          .stat-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            line-height: 1;
          }

          .stat-badge.positive {
            background: #ECFDF5;
            color: #059669;
          }

          .dark .stat-badge.positive {
            background: rgba(16, 185, 129, 0.1);
            color: #34D399;
          }

          .stat-badge.negative {
            background: #FEF2F2;
            color: #DC2626;
          }

          .dark .stat-badge.negative {
            background: rgba(220, 38, 38, 0.1);
            color: #F87171;
          }

          .metric-card {
            position: relative;
            overflow: hidden;
          }

          .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--color-start), var(--color-end));
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .metric-card:hover::before {
            opacity: 1;
          }

          .data-table {
            font-size: 14px;
          }

          .data-table th {
            font-weight: 600;
            color: #6B7280;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 12px 16px;
            background: #F9FAFB;
          }

          .dark .data-table th {
            background: rgba(255, 255, 255, 0.02);
            color: rgba(255, 255, 255, 0.5);
          }

          .data-table td {
            padding: 16px;
            border-bottom: 1px solid #F3F4F6;
          }

          .dark .data-table td {
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
          }

          .status-badge.active {
            background: #ECFDF5;
            color: #059669;
          }

          .status-badge.pending {
            background: #FEF3C7;
            color: #D97706;
          }

          .status-badge.inactive {
            background: #F3F4F6;
            color: #6B7280;
          }

          .dark .status-badge.active {
            background: rgba(16, 185, 129, 0.15);
            color: #34D399;
          }

          .dark .status-badge.pending {
            background: rgba(245, 158, 11, 0.15);
            color: #FBBF24;
          }

          .dark .status-badge.inactive {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.4);
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-in {
            animation: slideInUp 0.4s ease-out;
          }

          .chart-tooltip {
            background: white !important;
            border: 1px solid #E5E7EB !important;
            border-radius: 8px !important;
            padding: 12px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          }

          .dark .chart-tooltip {
            background: #1E293B !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
        `}</style>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last updated: Today, 2:45 PM</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Applications */}
          <div 
            className="crm-card metric-card rounded-xl p-6 animate-slide-in"
            style={{ '--color-start': '#3B82F6', '--color-end': '#8B5CF6', animationDelay: '0ms' } as any}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="stat-badge positive">
                <ArrowUpRight className="w-3 h-3" />
                12%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Applications
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {data?.items?.length || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                +3 this week
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div 
            className="crm-card metric-card rounded-xl p-6 animate-slide-in"
            style={{ '--color-start': '#10B981', '--color-end': '#059669', animationDelay: '100ms' } as any}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="stat-badge positive">
                <ArrowUpRight className="w-3 h-3" />
                8%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Team Members
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {isLoadingTeam ? "..." : teamData?.items?.length || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Active employees
              </p>
            </div>
          </div>

          {/* Active Projects */}
          <div 
            className="crm-card metric-card rounded-xl p-6 animate-slide-in"
            style={{ '--color-start': '#F59E0B', '--color-end': '#D97706', animationDelay: '200ms' } as any}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="stat-badge positive">
                <ArrowUpRight className="w-3 h-3" />
                15%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Active Projects
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {isLoadingPortfolio ? "..." : portfolioData?.items?.length || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                In development
              </p>
            </div>
          </div>

          {/* Revenue Growth */}
          <div 
            className="crm-card metric-card rounded-xl p-6 animate-slide-in"
            style={{ '--color-start': '#8B5CF6', '--color-end': '#7C3AED', animationDelay: '300ms' } as any}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="stat-badge positive">
                <ArrowUpRight className="w-3 h-3" />
                23%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Blog Posts
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {isLoadingBlog ? "..." : blogData?.items?.length || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Published content
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Applications Trend - Takes 2 columns */}
          <div className="lg:col-span-2 crm-card rounded-xl p-6 animate-slide-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Applications Trend
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Monthly application submissions and approvals
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  6M
                </button>
                <button className="px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                  1Y
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={applicationData}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '13px', fontWeight: 600, paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorApplications)"
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#colorApproved)"
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Project Distribution Pie Chart */}
          <div className="crm-card rounded-xl p-6 animate-slide-in" style={{ animationDelay: '500ms' }}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Project Status
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current project distribution
              </p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={projectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
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
            <div className="mt-4 space-y-3">
              {projectDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Metrics Chart */}
        <div className="crm-card rounded-xl p-6 mb-8 animate-slide-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Weekly Engagement
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                User interactions and activity metrics
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={pageViewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  padding: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 1 }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '13px', fontWeight: 600, paddingTop: '20px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Applications Table */}
        <div className="crm-card rounded-xl p-6 mb-8 animate-slide-in" style={{ animationDelay: '700ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Applications
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage and review career applications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
              >
                <Clock className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Loading applications...
                </p>
              </div>
            </div>
          )}
          
          {isError && (
            <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900 dark:text-red-400">
                    Failed to load applications
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-500 mt-1">
                    Please ensure you are logged in and the backend is running.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left">Position</th>
                    <th className="text-left">Candidate</th>
                    <th className="text-left hidden lg:table-cell">Contact</th>
                    <th className="text-left hidden lg:table-cell">Applied</th>
                    <th className="text-left hidden md:table-cell">Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.length ? (
                    data.items.map((app) => (
                      <tr
                        key={app._id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                      >
                        <td>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {app.job_title}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-gray-100 dark:border-gray-800">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.name}`}
                              />
                              <AvatarFallback className="text-sm font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                {app.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {app.name}
                            </span>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="w-4 h-4" />
                              <span className="mono text-xs">{app.email}</span>
                            </div>
                            {app.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Phone className="w-4 h-4" />
                                <span className="mono text-xs">{app.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {app.created_at
                              ? new Date(app.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : "—"}
                          </span>
                        </td>
                        <td className="hidden md:table-cell">
                          <span className="status-badge pending">
                            <Clock className="w-3 h-3" />
                            Under Review
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isDeleting}
                              onClick={() => handleDelete(app._id)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-16 text-center"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <Briefcase className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">
                            No applications submitted yet
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Content Management Section */}
        <div className="crm-card rounded-xl p-6 mb-8 animate-slide-in" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Content Management
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage page sections and configurations
              </p>
            </div>
            <Button
              size="sm"
              onClick={() =>
                setEditing({
                  page: "home",
                  key: "hero",
                  data: JSON.stringify(
                    {
                      title:
                        "Build Your Digital Future with <span class=\"text-gradient\">Codivra Solution</span>",
                      subtitle:
                        "We craft innovative web solutions, custom software, and digital strategies that drive business growth.",
                      badge: "Transforming Ideas into Digital Excellence",
                    },
                    null,
                    2
                  ),
                })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Section
            </Button>
          </div>

          {isLoadingPages && (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Loading content...
                </p>
              </div>
            </div>
          )}

          {!isLoadingPages && (
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left">Page</th>
                    <th className="text-left">Section Key</th>
                    <th className="text-left hidden md:table-cell">Last Updated</th>
                    <th className="text-left hidden lg:table-cell">Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagesData?.sections?.length ? (
                    pagesData.sections.map((section: PageSection) => (
                      <tr
                        key={section._id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                      >
                        <td>
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            <Tag className="w-3 h-3" />
                            {section.page}
                          </span>
                        </td>
                        <td>
                          <span className="mono text-sm font-medium text-gray-700 dark:text-gray-300">
                            {section.key}
                          </span>
                        </td>
                        <td className="hidden md:table-cell">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {section.updated_at
                              ? new Date(section.updated_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : "—"}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell">
                          <span className="status-badge active">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setEditing({
                                  id: section._id,
                                  page: section.page,
                                  key: section.key,
                                  data: JSON.stringify(
                                    section.data ?? {},
                                    null,
                                    2
                                  ),
                                })
                              }
                              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <Edit3 className="w-4 h-4 mr-1.5" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isDeletingSection}
                              onClick={async () => {
                                if (!window.confirm("Delete this section?")) return;
                                try {
                                  await deletePageSection(section._id).unwrap();
                                  toast({
                                    title: "Deleted",
                                    description: "Section has been removed.",
                                  });
                                  refetchPages();
                                } catch (error) {
                                  console.error("Failed to delete section:", error);
                                  toast({
                                    title: "Delete failed",
                                    description: "Could not delete section.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-16 text-center"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <FileText className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">
                            No page sections configured yet
                          </p>
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
          <div className="crm-card rounded-xl p-6 animate-slide-in" style={{ animationDelay: '900ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recent Contacts
              </h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            <div className="space-y-3">
              {(contactsData?.items || []).slice(0, 5).map(msg => (
                <div key={msg._id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${msg.name}`} />
                    <AvatarFallback className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      {msg.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {msg.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {msg.email}
                    </p>
                  </div>
                </div>
              ))}
              {(!contactsData?.items || contactsData.items.length === 0) && (
                <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">
                  No contacts yet
                </p>
              )}
            </div>
          </div>

          {/* Recent Blog Posts */}
          <div className="crm-card rounded-xl p-6 animate-slide-in" style={{ animationDelay: '1000ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Latest Blog Posts
              </h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            <div className="space-y-3">
              {(blogData?.items || []).slice(0, 5).map(post => (
                <div key={post._id} className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </p>
                </div>
              ))}
              {(!blogData?.items || blogData.items.length === 0) && (
                <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">
                  No blog posts yet
                </p>
              )}
            </div>
          </div>

          {/* Recent Portfolio */}
          <div className="crm-card rounded-xl p-6 animate-slide-in" style={{ animationDelay: '1100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Portfolio Projects
              </h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            <div className="space-y-3">
              {(portfolioData?.items || []).slice(0, 5).map(item => (
                <div key={item._id} className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </p>
                </div>
              ))}
              {(!portfolioData?.items || portfolioData.items.length === 0) && (
                <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">
                  No projects yet
                </p>
              )}
            </div>
          </div>

          {/* Team Activity */}
          <div className="crm-card rounded-xl p-6 animate-slide-in" style={{ animationDelay: '1200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Team Members
              </h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            <div className="space-y-3">
              {(teamData?.items || []).slice(0, 5).map(member => (
                <div key={member._id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                    <AvatarFallback className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
              {(!teamData?.items || teamData.items.length === 0) && (
                <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">
                  No team members yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              className="crm-card rounded-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto animate-slide-in"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editing.id ? "Edit Section" : "Create New Section"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Configure page content and metadata
                  </p>
                </div>
                <button
                  onClick={() => setEditing(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Page Name
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    value={editing.page}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        page: e.target.value,
                      } as any)
                    }
                    placeholder="home"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Section Key
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all mono"
                    value={editing.key}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        key: e.target.value,
                      } as any)
                    }
                    placeholder="hero"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  JSON Configuration
                </label>
                <textarea
                  className="w-full h-96 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                  value={editing.data}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      data: e.target.value,
                    } as any)
                  }
                  placeholder='{\n  "title": "Your content here"\n}'
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setEditing(null)}
                  className="px-6 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const parsed = JSON.parse(editing.data);
                      await upsertPage({
                        page: editing.page,
                        key: editing.key,
                        data: parsed,
                      }).unwrap();
                      toast({
                        title: "Saved Successfully",
                        description: "Section content has been updated.",
                      });
                      setEditing(null);
                      refetchPages();
                    } catch (error: any) {
                      console.error("Failed to save section:", error);
                      toast({
                        title: "Save Failed",
                        description:
                          error?.message || "Please check your JSON syntax.",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
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