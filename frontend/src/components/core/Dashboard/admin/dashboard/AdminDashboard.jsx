import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    activeCourses: 0,
    totalEnrollments: 0,
    recentUsers: [],
    enrollmentTrend: [],
    roleDistribution: [],
    topInstructors: [],
    avgCoursesPerInstructor: 0,
    highestRatedInstructor: null,
    activeStudents: 0,
    avgCoursesPerStudent: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');

  // Color constants
  const COLORS = ['#00A1E4', '#2EC4B6', '#FFBB28', '#FF8042', '#8884D8'];
  const ACCENT_COLOR = '#00A1E4';
  const HIGHLIGHT_COLOR = '#2EC4B6';

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Simulated API call - replace with your actual API call
      const mockData = {
        success: true,
        data: {
          totalStudents: 1245,
          totalInstructors: 42,
          activeCourses: 87,
          totalEnrollments: 3562,
          recentUsers: Array(5).fill().map((_, i) => ({
            _id: `user${i}`,
            firstName: ['John', 'Jane', 'Robert', 'Emily', 'Michael'][i],
            lastName: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'][i],
            email: [`user${i}@example.com`],
            role: ['student', 'instructor', 'admin', 'student', 'instructor'][i],
            createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
          })),
          enrollmentTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
            name: day,
            students: Math.floor(Math.random() * 50) + 10,
            instructors: Math.floor(Math.random() * 10) + 2
          })),
          roleDistribution: [
            { name: 'Students', value: 1245 },
            { name: 'Instructors', value: 42 },
            { name: 'Admins', value: 5 }
          ],
          topInstructors: Array(3).fill().map((_, i) => ({
            _id: `instr${i}`,
            name: ['Alex Johnson', 'Maria Garcia', 'David Lee'][i],
            courseCount: [12, 9, 7][i],
            rating: [4.9, 4.8, 4.7][i]
          })),
          avgCoursesPerInstructor: 8.3,
          highestRatedInstructor: {
            name: 'Alex Johnson',
            rating: 4.9
          },
          activeStudents: 342,
          avgCoursesPerStudent: 2.8
        }
      };
      
      setTimeout(() => {
        setStats(mockData.data);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // Data for bar chart
  const renderEnrollmentChart = () => {
    return (
      <div className="bg-richblack-700 p-4 rounded-2xl border border-richblack-600 h-80">
        <h3 className="text-lg font-semibold mb-4 text-richblack-5">Enrollment Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.enrollmentTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#CBD5E1" />
            <YAxis stroke="#CBD5E1" />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1E293B',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#F8FAFC'
              }}
            />
            <Legend />
            <Bar dataKey="students" fill={ACCENT_COLOR} name="Students" />
            <Bar dataKey="instructors" fill={HIGHLIGHT_COLOR} name="Instructors" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Data for pie chart
  const renderRoleDistributionChart = () => {
    return (
      <div className="bg-richblack-700 p-4 rounded-2xl border border-richblack-600 h-80">
        <h3 className="text-lg font-semibold mb-4 text-richblack-5">User Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats.roleDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {stats.roleDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1E293B',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#F8FAFC'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Recent users table
  const renderRecentUsers = () => {
    return (
      <div className="bg-richblack-700 p-4 rounded-2xl border border-richblack-600">
        <h3 className="text-lg font-semibold mb-4 text-richblack-5">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-richblack-600">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-richblack-300 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-600">
              {stats.recentUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <span className="text-blue-400 font-medium">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-richblack-5">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-richblack-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'admin' ? 'bg-purple-900/20 text-purple-400' : 
                        user.role === 'instructor' ? `bg-[${ACCENT_COLOR}]/20 text-[${ACCENT_COLOR}]` : 
                        `bg-[${HIGHLIGHT_COLOR}]/20 text-[${HIGHLIGHT_COLOR}]`}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-richblack-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Stats cards
  const renderStatsCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Students */}
        <div className="bg-richblack-700 p-6 rounded-2xl border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-richblack-300">Total Students</p>
              <p className="text-2xl font-semibold text-richblack-5">{stats.totalStudents}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-richblack-400">+5.2% from last {timeRange}</p>
        </div>

        {/* Total Instructors */}
        <div className="bg-richblack-700 p-6 rounded-2xl border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-richblack-300">Total Instructors</p>
              <p className="text-2xl font-semibold text-richblack-5">{stats.totalInstructors}</p>
            </div>
            <div className="bg-teal-500/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-richblack-400">+3.1% from last {timeRange}</p>
        </div>

        {/* Active Courses */}
        <div className="bg-richblack-700 p-6 rounded-2xl border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-richblack-300">Active Courses</p>
              <p className="text-2xl font-semibold text-richblack-5">{stats.activeCourses}</p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-richblack-400">+12.7% from last {timeRange}</p>
        </div>

        {/* Total Enrollments */}
        <div className="bg-richblack-700 p-6 rounded-2xl border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-richblack-300">Total Enrollments</p>
              <p className="text-2xl font-semibold text-richblack-5">{stats.totalEnrollments}</p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-richblack-400">+8.4% from last {timeRange}</p>
        </div>
      </div>
    );
  };

  // Instructor overview
  const renderInstructorOverview = () => {
    return (
      <div className="bg-richblack-700 p-6 rounded-2xl border border-richblack-600">
        <h3 className="text-lg font-semibold mb-4 text-richblack-5">Instructor Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Instructors */}
          <div className="bg-richblack-800 p-4 rounded-lg">
            <h4 className="font-medium text-richblack-100 mb-3">Top Instructors</h4>
            {stats.topInstructors?.length > 0 ? (
              <ul className="space-y-3">
                {stats.topInstructors.map((instructor, index) => (
                  <li key={instructor._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`${
                        index === 0 ? 'bg-amber-500/20 text-amber-400' : 
                        index === 1 ? 'bg-slate-500/20 text-slate-400' : 
                        'bg-amber-900/20 text-amber-600'
                      } text-xs font-medium mr-3 px-2.5 py-0.5 rounded-full`}>
                        #{index + 1}
                      </span>
                      <span className="font-medium text-richblack-50">{instructor.name}</span>
                    </div>
                    <span className="text-sm text-richblack-300">{instructor.courseCount} courses</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-richblack-400">No instructor data available</p>
            )}
          </div>

          {/* Instructor Metrics */}
          <div className="bg-richblack-800 p-4 rounded-lg">
            <h4 className="font-medium text-richblack-100 mb-3">Metrics</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-richblack-300">Average Courses per Instructor</p>
                <p className="text-xl font-semibold text-richblack-5">{stats.avgCoursesPerInstructor || 0}</p>
              </div>
              <div>
                <p className="text-sm text-richblack-300">Highest Rated Instructor</p>
                <p className="text-xl font-semibold text-richblack-5">
                  {stats.highestRatedInstructor?.name || 'N/A'} 
                  {stats.highestRatedInstructor?.rating && (
                    <span className="ml-2 text-sm font-normal text-amber-400">
                      ({stats.highestRatedInstructor.rating.toFixed(1)}★)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Student overview
  const renderStudentOverview = () => {
    return (
      <div className="bg-richblack-700 p-6 rounded-2xl border border-richblack-600">
        <h3 className="text-lg font-semibold mb-4 text-richblack-5">Student Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Students */}
          <div className="bg-richblack-800 p-4 rounded-lg">
            <h4 className="font-medium text-richblack-100 mb-3">Activity</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-richblack-300">Active Students (last 30 days)</p>
                <p className="text-xl font-semibold text-richblack-5">{stats.activeStudents || 0}</p>
              </div>
              <div>
                <p className="text-sm text-richblack-300">Avg Courses per Student</p>
                <p className="text-xl font-semibold text-richblack-5">{stats.avgCoursesPerStudent?.toFixed(1) || 0}</p>
              </div>
            </div>
          </div>

          {/* Enrollment Trends */}
          <div className="bg-richblack-800 p-4 rounded-lg">
            <h4 className="font-medium text-richblack-100 mb-3">Enrollment Trends</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" stroke="#CBD5E1" />
                  <YAxis stroke="#CBD5E1" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#F8FAFC'
                    }}
                  />
                  <Bar dataKey="students" fill={ACCENT_COLOR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-richblack-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-richblack-5 font-boogaloo">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-richblack-300">Time Range:</span>
          <select
            className="border border-richblack-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-richblack-700 text-richblack-5"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-richblack-600 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview' 
                ? `border-blue-500 text-blue-400` 
                : `border-transparent text-richblack-300 hover:text-richblack-5 hover:border-richblack-400`
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'instructors' 
                ? `border-blue-500 text-blue-400` 
                : `border-transparent text-richblack-300 hover:text-richblack-5 hover:border-richblack-400`
            }`}
          >
            Instructors
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students' 
                ? `border-blue-500 text-blue-400` 
                : `border-transparent text-richblack-300 hover:text-richblack-5 hover:border-richblack-400`
            }`}
          >
            Students
          </button>
        </nav>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <>
              {renderStatsCards()}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {renderEnrollmentChart()}
                {renderRoleDistributionChart()}
              </div>
              {renderRecentUsers()}
            </>
          )}

          {activeTab === 'instructors' && (
            <>
              <div className="grid grid-cols-1 gap-6 mb-6">
                {renderInstructorOverview()}
              </div>
            </>
          )}

          {activeTab === 'students' && (
            <>
              <div className="grid grid-cols-1 gap-6 mb-6">
                {renderStudentOverview()}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;