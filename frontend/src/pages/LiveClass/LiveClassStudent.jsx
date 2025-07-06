import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiUser, FiLoader, FiAlertCircle, FiExternalLink } from "react-icons/fi";
import { liveClassEndpoints } from "../../services/apis";

const {
  GET_UPCOMING_LIVE_CLASSES_API,
  GET_LIVE_CLASS_DETAILS_API, 
} = liveClassEndpoints;

const LiveClassStudent = () => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [joiningClassId, setJoiningClassId] = useState(null);
  const navigate = useNavigate();

  const getAuthToken = useCallback(() => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        toast.error("Please login to access live classes");
        navigate("/login");
        return null;
      }
      return token;
    } catch (error) {
      toast.error("Authentication error. Please login again.");
      navigate("/login");
      return null;
    }
  }, [navigate]);

  const fetchUpcomingClasses = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get(
        GET_UPCOMING_LIVE_CLASSES_API,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setUpcomingClasses(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch classes");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Error fetching live classes"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, navigate]);

  useEffect(() => {
    fetchUpcomingClasses();
  }, [fetchUpcomingClasses]);

  const joinClass = async (classId) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setJoiningClassId(classId);
      const response = await axios.get(
        `${GET_LIVE_CLASS_DETAILS_API}?classId=${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setClassDetails(response.data.data);
        toast.success("Class joined successfully!");

        if (response.data.data?.meetingLink) {
          window.open(response.data.data.meetingLink, "_blank");
        }
      } else {
        toast.error(response.data.message || "Failed to join class");
      }
    } catch (error) {
      console.error("Join error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to join class");
      }
    } finally {
      setJoiningClassId(null);
    }
  };

  const formatClassTime = (dateString) => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTimeOnly = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getClassStatus = (startTime) => {
    const now = new Date();
    const classTime = new Date(startTime);
    const timeDiff = classTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 0) {
      return { text: "Live Now", color: "bg-red-600 text-white" };
    } else if (hoursDiff < 1) {
      return { text: "Starting Soon", color: "bg-yellow-400 text-black" };
    } else if (hoursDiff < 24) {
      return { text: "Today", color: "bg-[#00A1E4] text-white" };
    } else {
      return { text: "Upcoming", color: "bg-emerald-500 text-white" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-richblack-700 to-richblack-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-richblack-5 sm:text-4xl">
            Upcoming Live Classes
          </h1>
          <p className="mt-3 text-lg text-richblack-300">
            Join your scheduled virtual classrooms
          </p>
        </div>

        {loading && upcomingClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
            <p className="text-richblack-300">Loading upcoming classes...</p>
          </div>
        ) : upcomingClasses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingClasses.map((liveClass) => {
              const status = getClassStatus(liveClass.startTime);
              
              return (
                <div
                  key={liveClass._id}
                  className="bg-richblack-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-richblack-600"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-richblack-5 line-clamp-2">
                        {liveClass.title}
                      </h2>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    
                    <p className="mt-3 text-richblack-300 line-clamp-3">
                      {liveClass.description || "No description available"}
                    </p>
                    
                    <div className="mt-4 space-y-2 text-sm text-richblack-300">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2 text-richblack-400" />
                        <span>{formatClassTime(liveClass.startTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-2 text-richblack-400" />
                        <span>{formatTimeOnly(liveClass.startTime)}</span>
                      </div>
                      {liveClass.instructor && (
                        <div className="flex items-center">
                          <FiUser className="mr-2 text-richblack-400" />
                          <span>
                            {liveClass.instructor.firstName} {liveClass.instructor.lastName}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => joinClass(liveClass._id)}
                      disabled={joiningClassId === liveClass._id}
                      className={`mt-6 w-full flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium ${
                        joiningClassId === liveClass._id
                          ? "bg-yellow-300 cursor-not-allowed text-black"
                          : "bg-[#00A1E4] hover:bg-[#0088c7] text-white focus:outline-none focus:ring-2 focus:ring-[#00A1E4] focus:ring-offset-2 transition-colors duration-200"
                      }`}
                    >
                      {joiningClassId === liveClass._id ? (
                        <>
                          <FiLoader className="animate-spin mr-2" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <FiExternalLink className="mr-2" />
                          Join Class
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-richblack-800 rounded-xl shadow-sm overflow-hidden text-center py-16 border border-richblack-600">
            <FiAlertCircle className="mx-auto h-12 w-12 text-richblack-400" />
            <h3 className="mt-4 text-lg font-medium text-richblack-5">No upcoming classes</h3>
            <p className="mt-2 text-sm text-richblack-300">
              There are currently no scheduled live classes available.
            </p>
            <div className="mt-6">
              <button
                onClick={fetchUpcomingClasses}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-[#00A1E4] hover:bg-[#0088c7] text-white focus:outline-none focus:ring-2 focus:ring-[#00A1E4] focus:ring-offset-2 transition-colors duration-200"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {classDetails && (
          <div className="mt-10 bg-richblack-800 rounded-xl shadow-md overflow-hidden border border-richblack-600">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-richblack-5">
                  {classDetails.title}
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              
              <p className="mt-3 text-richblack-300">
                {classDetails.description}
              </p>
              
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-richblack-700 p-4 rounded-lg border border-richblack-600">
                  <p className="text-sm font-medium text-richblack-400">Date</p>
                  <p className="mt-1 text-sm text-richblack-5">
                    {formatClassTime(classDetails.startTime)}
                  </p>
                </div>
                
                <div className="bg-richblack-700 p-4 rounded-lg border border-richblack-600">
                  <p className="text-sm font-medium text-richblack-400">Time</p>
                  <p className="mt-1 text-sm text-richblack-5">
                    {formatTimeOnly(classDetails.startTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassStudent;