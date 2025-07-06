import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaChartLine, FaStar, FaChevronRight } from "react-icons/fa";
import { MdSchool, MdOutlineQuiz } from "react-icons/md";
import { RiFeedbackLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { getUserDetails, getUserEnrolledCourses } from "../../../../../services/operations/profileAPI"; 
import { Link } from "react-router-dom";

const OverviewCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
    className={`flex items-center gap-4 p-6 rounded-xl shadow-lg ${color} text-white`}
  >
    <div className="p-3 rounded-full bg-white bg-opacity-20">{icon}</div>
    <div>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-richblack-700 h-2.5 rounded-full mt-3">
    <div
      className="h-2.5 rounded-full bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8]"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const StudentDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    avgQuizScore: 0,
    courseRating: 0,
    learningStreak: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user details for additional stats
        const userDetails = await getUserDetails(token);
        
        // Fetch enrolled courses
        const courses = await getUserEnrolledCourses(token);
        
        if (courses) {
          setEnrolledCourses(courses);
          
          // Calculate average progress across all courses
          const totalProgress = courses.reduce((sum, course) => sum + (course.progress || 0), 0);
          const avgProgress = courses.length > 0 ? Math.round(totalProgress / courses.length) : 0;
          
          // Update stats
          setStats({
            avgQuizScore: userDetails?.additionalDetails?.avgQuizScore || 85,
            courseRating: userDetails?.additionalDetails?.courseRating || 4.8,
            learningStreak: userDetails?.additionalDetails?.learningStreak || 15,
            avgProgress
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 text-white px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="h-12 bg-richblack-800 rounded w-1/2 mb-8"></div>
            
            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-richblack-800 rounded-xl"></div>
              ))}
            </div>
            
            {/* Courses Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-richblack-800 rounded w-1/3"></div>
                <div className="grid md:grid-cols-2 gap-5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-40 bg-richblack-800 rounded-xl"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-richblack-800 rounded w-1/3"></div>
                <div className="h-64 bg-richblack-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get top 3 courses by progress for recommendations
  const recommendedCourses = [...enrolledCourses]
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-richblack-900 text-white px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-transparent bg-clip-text">
              Welcome Back, {user?.firstName || "Student"}!
            </h1>
            <p className="text-richblack-300 mt-2">
              {stats.avgProgress > 0 
                ? `You're ${stats.avgProgress}% through your learning journey` 
                : "Start your learning journey today"}
            </p>
          </div>
          <Link to="/dashboard/enrolled-courses">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] rounded-lg font-medium shadow-md"
            >
              View All Courses
            </motion.button>
          </Link>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <OverviewCard
            title="Quiz Avg. Score"
            value={`${stats.avgQuizScore}%`}
            icon={<MdOutlineQuiz size={24} />}
            color="bg-gradient-to-br from-purple-600 to-blue-500"
          />
          <OverviewCard
            title="Enrolled Courses"
            value={enrolledCourses.length}
            icon={<MdSchool size={24} />}
            color="bg-gradient-to-br from-pink-600 to-rose-500"
          />
          <OverviewCard
            title="Course Ratings"
            value={`${stats.courseRating}/5`}
            icon={<RiFeedbackLine size={24} />}
            color="bg-gradient-to-br from-amber-600 to-yellow-500"
          />
          <OverviewCard
            title="Learning Streak"
            value={`${stats.learningStreak} days`}
            icon={<FaBookOpen size={24} />}
            color="bg-gradient-to-br from-emerald-600 to-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="p-2 rounded-lg bg-richblack-800">
                  <MdSchool className="text-blue-400" />
                </span>
                Current Courses
              </h2>
              <Link to="/dashboard/enrolled-courses" className="text-blue-400 text-sm flex items-center gap-1 hover:underline">
                View all <FaChevronRight size={12} />
              </Link>
            </div>
            
            {enrolledCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-5">
                {enrolledCourses.slice(0, 4).map((course) => (
                  <motion.div
                    key={course._id}
                    whileHover={{ y: -5 }}
                    className="bg-richblack-800 p-5 rounded-xl shadow-sm border border-richblack-700 hover:border-blue-500 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs px-2 py-1 rounded-full bg-richblack-700 text-blue-300">
                          {course.category || "General"}
                        </span>
                        <h3 className="text-lg font-semibold mt-2 text-white">{course.courseName}</h3>
                      </div>
                      <span className="text-blue-400 font-bold">{course.progress || 0}%</span>
                    </div>
                    <ProgressBar progress={course.progress || 0} />
                    <div className="flex justify-between mt-3 text-xs text-richblack-400">
                      <span>Last accessed: {course.lastAccessed ? new Date(course.lastAccessed).toLocaleDateString() : "Never"}</span>
                      <Link 
                        to={`/course/${course._id}`} 
                        className="text-blue-400 hover:underline"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-richblack-800 p-8 rounded-xl text-center">
                <p className="text-richblack-200 mb-4">You're not enrolled in any courses yet</p>
                <Link
                  to="/dashboard/courses"
                  className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg font-medium hover:bg-yellow-100 transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>

          {/* Suggested Courses */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="p-2 rounded-lg bg-richblack-800">
                  <FaStar className="text-amber-400" />
                </span>
                Recommendations
              </h2>
            </div>
            
            <div className="bg-richblack-800 p-5 rounded-xl border border-richblack-700 shadow">
              <h3 className="font-medium text-white mb-4">
                {enrolledCourses.length > 0 ? "Continue Your Learning" : "Popular Courses"}
              </h3>
              <div className="space-y-4">
                {enrolledCourses.length > 0 ? (
                  recommendedCourses.map((course, idx) => (
                    <motion.div 
                      key={course._id}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-richblack-700 transition-colors"
                    >
                      <div className="mt-1 w-2 h-2 rounded-full bg-blue-400"></div>
                      <div>
                        <h4 className="font-medium text-white">{course.courseName}</h4>
                        <p className="text-sm text-richblack-400">
                          {course.progress}% completed • {course.category}
                        </p>
                        <Link 
                          to={`/course/${course._id}`}
                          className="text-xs text-blue-400 hover:underline mt-1 inline-block"
                        >
                          Continue Learning
                        </Link>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  [
                    { name: "Advanced React Patterns", reason: "Top-rated by students" },
                    { name: "Node.js Microservices", reason: "High completion rate" },
                    { name: "UI/UX Design Fundamentals", reason: "Growing demand" }
                  ].map((course, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-richblack-700 transition-colors"
                    >
                      <div className="mt-1 w-2 h-2 rounded-full bg-blue-400"></div>
                      <div>
                        <h4 className="font-medium text-white">{course.name}</h4>
                        <p className="text-sm text-richblack-400">{course.reason}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              <Link 
                to="/dashboard/enrolled-courses" 
                className="block w-full mt-4 py-2 text-sm bg-richblack-700 hover:bg-richblack-600 rounded-lg transition-colors text-center"
              >
                {enrolledCourses.length > 0 ? "Find More Courses" : "Browse All Courses"}
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10 bg-gradient-to-r from-richblack-800 to-richblack-700 p-6 rounded-xl border border-richblack-700 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500 bg-opacity-20">
              <FaChartLine className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Progress Summary</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Achievements</h3>
              <ul className="space-y-2 text-richblack-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Enrolled in {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Maintained {stats.avgQuizScore}% quiz average
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  {stats.learningStreak}-day learning streak
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Next Steps</h3>
              <ul className="space-y-2 text-richblack-300">
                {enrolledCourses.length > 0 ? (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Complete your current courses
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Try the advanced project challenges
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Join the weekly study group
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Enroll in your first course
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Explore beginner learning paths
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Complete the onboarding tutorial
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-richblack-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Weekly Goal</h3>
                <p className="text-sm text-richblack-400">
                  {enrolledCourses.length > 0 
                    ? "Complete 3 chapters this week" 
                    : "Enroll in your first course this week"}
                </p>
              </div>
              <div className="w-24 h-2 bg-richblack-700 rounded-full">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8]" 
                  style={{ width: `${enrolledCourses.length > 0 ? '60%' : '20%'}` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;