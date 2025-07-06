import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBook, FiAward, FiTrendingUp, FiBarChart2, FiCheckCircle } from "react-icons/fi";

// Utility functions
const getColorClass = (score) => {
  if (score >= 85) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  if (score >= 60) return "text-orange-400";
  return "text-red-400";
};

const getMatchColor = (score) => {
  if (score >= 90) return "bg-gradient-to-r from-green-500 to-emerald-500";
  if (score >= 80) return "bg-gradient-to-r from-blue-500 to-cyan-500";
  if (score >= 70) return "bg-gradient-to-r from-yellow-500 to-amber-500";
  return "bg-gradient-to-r from-purple-500 to-pink-500";
};

const getMatchText = (score) => {
  if (score >= 90) return "Excellent Match";
  if (score >= 80) return "Great Match";
  if (score >= 70) return "Good Match";
  return "Fair Match";
};

const getFeedbackCategory = (score) => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 60) return "Average";
  return "Poor";
};

// Mock student data
const studentData = {
  name: "Rahul Sharma",
  performance: {
    overallScore: 78,
    strengths: ["Problem Solving", "Conceptual Understanding"],
    weaknesses: ["Time Management", "Advanced Algorithms"],
    completedCourses: [
      { name: "JavaScript Fundamentals", score: 85 },
      { name: "Data Structures Basics", score: 72 },
      { name: "React Introduction", score: 68 }
    ],
    recentQuizzes: [
      { subject: "Algorithms", score: 65 },
      { subject: "Web Development", score: 82 },
      { subject: "Database Systems", score: 74 }
    ]
  }
};

// Course data
const allCourses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    category: "Web Development",
    level: "Intermediate",
    duration: "6 weeks",
    rating: 4.8,
    matchScore: 92,
    description: "Master advanced React concepts like hooks, context API, and performance optimization.",
    whyRecommended: "Matches your strong performance in JavaScript and basic React"
  },
  // ... (other course objects remain the same)
];

const CourseSuggestion = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [loading, setLoading] = useState(true);
  const topRecommendation = allCourses[0];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-richblack-900 to-richblack-800 text-white px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <motion.h1
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-transparent bg-clip-text"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Personalized Course Recommendations
            </motion.h1>
            <p className="text-richblack-300 mt-2">
              Based on your learning history and performance
            </p>
          </div>
          
          <div className="bg-richblack-700/50 rounded-xl p-4 border border-richblack-600 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <FiBarChart2 className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-richblack-300">Overall Performance</p>
                <p className="text-xl font-bold">
                  {studentData.performance.overallScore}%
                  <span className="text-sm ml-2 font-normal text-richblack-300">
                    ({getMatchText(studentData.performance.overallScore)})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-richblack-700 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "suggestions"
                ? "text-electricBlue border-b-2 border-electricBlue"
                : "text-richblack-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("suggestions")}
          >
            <FiBook /> Suggested Courses
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "performance"
                ? "text-electricBlue border-b-2 border-electricBlue"
                : "text-richblack-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("performance")}
          >
            <FiTrendingUp /> Performance Analysis
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electricBlue"></div>
          </div>
        ) : activeTab === "suggestions" ? (
          <>
            {/* Top Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-richblack-800 to-richblack-700 rounded-2xl p-6 mb-8 border border-richblack-600 shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMatchColor(topRecommendation.matchScore)}`}>
                      TOP PICK
                    </span>
                    <span className="text-sm text-richblack-300">
                      {getMatchText(topRecommendation.matchScore)} • {topRecommendation.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{topRecommendation.title}</h2>
                  <p className="text-richblack-300 mb-4">{topRecommendation.description}</p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="flex items-center gap-1 text-sm bg-richblack-700 px-3 py-1 rounded-full">
                      <FiAward className="text-yellow-400" /> {topRecommendation.level}
                    </span>
                    <span className="flex items-center gap-1 text-sm bg-richblack-700 px-3 py-1 rounded-full">
                      <FiCheckCircle className="text-green-400" /> {topRecommendation.duration}
                    </span>
                    <span className="flex items-center gap-1 text-sm bg-richblack-700 px-3 py-1 rounded-full">
                      ⭐ {topRecommendation.rating}/5.0
                    </span>
                  </div>
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition">
                    Enroll Now
                  </button>
                </div>
                <div className="md:w-1/3 bg-richblack-900/50 rounded-xl p-4 border border-richblack-700">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FiTrendingUp className="text-electricBlue" /> Why Recommended?
                  </h3>
                  <p className="text-sm text-richblack-300 mb-4">{topRecommendation.whyRecommended}</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Match Score</span>
                        <span>{topRecommendation.matchScore}%</span>
                      </div>
                      <div className="w-full bg-richblack-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getMatchColor(topRecommendation.matchScore)}`}
                          style={{ width: `${topRecommendation.matchScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Difficulty Match</span>
                        <span>89%</span>
                      </div>
                      <div className="w-full bg-richblack-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          style={{ width: `89%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Other Recommendations */}
            <h3 className="text-xl font-semibold mb-4">Other Recommended Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {allCourses.slice(1).map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + course.id * 0.1 }}
                  className="bg-richblack-800 rounded-xl overflow-hidden border border-richblack-700 hover:border-electricBlue/50 transition cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getMatchColor(course.matchScore)}`}>
                        {getMatchText(course.matchScore)}
                      </span>
                      <span className="text-xs bg-richblack-700 px-2 py-1 rounded">
                        {course.category}
                      </span>
                    </div>
                    <h4 className="font-bold mb-2">{course.title}</h4>
                    <p className="text-sm text-richblack-300 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1">
                        <FiAward className="text-yellow-400" /> {course.level}
                      </span>
                      <span className="text-sm flex items-center gap-1">
                        ⭐ {course.rating}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* Performance Analysis Tab */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-richblack-800 rounded-xl p-6 border border-green-900/50">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-green-400">
                  <FiTrendingUp /> Your Strengths
                </h3>
                <div className="space-y-3">
                  {studentData.performance.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center">
                        <FiCheckCircle className="text-green-400" />
                      </div>
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-richblack-800 rounded-xl p-6 border border-red-900/50">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-400">
                  <FiTrendingUp className="transform rotate-180" /> Areas to Improve
                </h3>
                <div className="space-y-3">
                  {studentData.performance.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center">
                        <div className="text-red-400">!</div>
                      </div>
                      <span>{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Completed Courses */}
            <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
              <h3 className="font-semibold mb-4">Completed Courses</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-richblack-300 border-b border-richblack-700">
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Score</th>
                      <th className="pb-3">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.performance.completedCourses.map((course, index) => (
                      <tr key={index} className="border-b border-richblack-700 hover:bg-richblack-700/50">
                        <td className="py-3">{course.name}</td>
                        <td className={`py-3 font-medium ${getColorClass(course.score)}`}>
                          {course.score}%
                        </td>
                        <td className="py-3">
                          <div className="w-full bg-richblack-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getMatchColor(course.score)}`}
                              style={{ width: `${course.score}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quiz Performance */}
            <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700">
              <h3 className="font-semibold mb-4">Recent Quiz Performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {studentData.performance.recentQuizzes.map((quiz, index) => (
                  <div key={index} className="bg-richblack-700/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">{quiz.subject}</h4>
                    <div className="flex items-center justify-between">
                      <span className={`text-xl font-bold ${getColorClass(quiz.score)}`}>
                        {quiz.score}%
                      </span>
                      <div className="w-16">
                        <div className="w-full bg-richblack-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getMatchColor(quiz.score)}`}
                            style={{ width: `${quiz.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-richblack-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-richblack-700"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getMatchColor(selectedCourse.matchScore)}`}>
                      {getMatchText(selectedCourse.matchScore)}
                    </span>
                    <span className="text-xs bg-richblack-700 px-2 py-1 rounded ml-2">
                      {selectedCourse.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-richblack-300 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                <p className="text-richblack-300 mb-6">{selectedCourse.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-richblack-700/50 rounded-lg p-3">
                    <p className="text-sm text-richblack-300">Level</p>
                    <p className="font-medium">{selectedCourse.level}</p>
                  </div>
                  <div className="bg-richblack-700/50 rounded-lg p-3">
                    <p className="text-sm text-richblack-300">Duration</p>
                    <p className="font-medium">{selectedCourse.duration}</p>
                  </div>
                  <div className="bg-richblack-700/50 rounded-lg p-3">
                    <p className="text-sm text-richblack-300">Rating</p>
                    <p className="font-medium">⭐ {selectedCourse.rating}/5.0</p>
                  </div>
                  <div className="bg-richblack-700/50 rounded-lg p-3">
                    <p className="text-sm text-richblack-300">Match Score</p>
                    <p className="font-medium">{selectedCourse.matchScore}%</p>
                  </div>
                </div>
                
                <div className="bg-richblack-900/50 rounded-xl p-4 mb-6 border border-richblack-700">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FiTrendingUp className="text-electricBlue" /> Why Recommended?
                  </h3>
                  <p className="text-richblack-300">{selectedCourse.whyRecommended}</p>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition">
                    Enroll Now
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="flex-1 bg-richblack-700 hover:bg-richblack-600 text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CourseSuggestion;