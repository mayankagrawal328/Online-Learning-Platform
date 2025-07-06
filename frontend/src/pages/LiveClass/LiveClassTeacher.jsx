import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiEdit, FiPlus, FiTrash2, FiUsers, FiLink } from "react-icons/fi";
import { liveClassEndpoints,adminEndpoints } from "../../services/apis";
const {
  CREATE_LIVE_CLASS_API,
  GET_TEACHER_LIVE_CLASSES_API, 
  UPDATE_LIVE_CLASS_API,   
  DELETE_LIVE_CLASS_API, 
} = liveClassEndpoints;

const {
  ALL_STUDENT,
} = adminEndpoints;

const LiveClassTeacher = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [classForm, setClassForm] = useState({ 
    title: "", 
    description: "", 
    startTime: "", 
    endTime: "", 
    meetingLink: "", 
    students: [] 
  });
  const [editingClass, setEditingClass] = useState(null);
  const navigate = useNavigate();

  // Helper function to fetch auth token
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

  // Fetch all students
  const fetchStudents = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get(ALL_STUDENT, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setStudentsList(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error(error.response?.data?.message || "Error fetching students");
    }
  };

  // Fetch teacher's live classes
  const fetchTeacherClasses = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get(GET_TEACHER_LIVE_CLASSES_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setLiveClasses(response.data.data || []);
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
        toast.error(error.response?.data?.message || "Error fetching live classes");
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, navigate]);

  useEffect(() => {
    fetchTeacherClasses();
    fetchStudents();
  }, [fetchTeacherClasses]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle student selection
  const handleStudentSelect = (studentId) => {
    setClassForm(prev => ({
      ...prev,
      students: prev.students.includes(studentId)
        ? prev.students.filter(id => id !== studentId)
        : [...prev.students, studentId]
    }));
  };

  // Handle class creation
  const handleCreateClass = async () => {
    const token = getAuthToken();
    if (!token) return;

    // Validate form
    if (!classForm.title || !classForm.startTime || !classForm.endTime || 
        !classForm.meetingLink || classForm.students.length === 0) {
      toast.error("Please fill all required fields including at least one student");
      return;
    }

    if (new Date(classForm.startTime) >= new Date(classForm.endTime)) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      const response = await axios.post(
        CREATE_LIVE_CLASS_API,
        classForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Live class created successfully!");
        resetForm();
        fetchTeacherClasses();
      } else {
        toast.error(response.data.message || "Failed to create live class");
      }
    } catch (error) {
      console.error("Create class error:", error);
      toast.error(error.response?.data?.message || "Failed to create class");
    }
  };

  // Handle class update
  const handleUpdateClass = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.put(
        UPDATE_LIVE_CLASS_API,
        {
          classId: editingClass._id,
          ...classForm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success("Live class updated successfully!");
        resetForm();
        fetchTeacherClasses();
      } else {
        toast.error(response.data.message || "Failed to update class");
      }
    } catch (error) {
      console.error("Update class error:", error);
      toast.error(error.response?.data?.message || "Failed to update class");
    }
  };

  // Handle class deletion
  const handleDeleteClass = async (classId) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.delete(
        DELETE_LIVE_CLASS_API,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            classId: classId,
          },
        }
      );      

      if (response.data.success) {
        toast.success("Live class deleted successfully!");
        fetchTeacherClasses();
      } else {
        toast.error(response.data.message || "Failed to delete class");
      }
    } catch (error) {
      console.error("Delete class error:", error);
      toast.error(error.response?.data?.message || "Failed to delete class");
    }
  };

  // Reset form
  const resetForm = () => {
    setClassForm({ 
      title: "", 
      description: "", 
      startTime: "", 
      endTime: "", 
      meetingLink: "", 
      students: [] 
    });
    setEditingClass(null);
    setIsCreating(false);
  };

  // Format date and time
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

  const formatTimeRange = (start, end) => {
    const startTime = new Date(start).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = new Date(end).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-richblack-700 to-richblack-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-richblack-5 sm:text-4xl">
            Manage Your Live Classes
          </h1>
          <p className="mt-3 text-lg text-richblack-300">
            Create, update, and view your scheduled live classes
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
            <p className="text-richblack-300">Loading your live classes...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveClasses.map((liveClass) => (
              <div
                key={liveClass._id}
                className="bg-richblack-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-richblack-600"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-richblack-5 line-clamp-2">
                      {liveClass.title}
                    </h2>
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
                      <span>{formatTimeRange(liveClass.startTime, liveClass.endTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <FiLink className="mr-2 text-richblack-400" />
                      <a 
                        href={liveClass.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Join Meeting
                      </a>
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="mr-2 text-richblack-400" />
                      <span>{liveClass.students.length} students enrolled</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => {
                        setEditingClass(liveClass);
                        setClassForm({
                          title: liveClass.title,
                          description: liveClass.description,
                          startTime: new Date(liveClass.startTime).toISOString().slice(0, 16),
                          endTime: new Date(liveClass.endTime).toISOString().slice(0, 16),
                          meetingLink: liveClass.meetingLink,
                          students: liveClass.students
                        });
                        setIsCreating(true);
                      }}
                      className="text-sm text-[#00A1E4] hover:text-[#0088c7]"
                    >
                      <FiEdit className="inline-block mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClass(liveClass._id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      <FiTrash2 className="inline-block mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingClass(null);
              setClassForm({ 
                title: "", 
                description: "", 
                startTime: "", 
                endTime: "", 
                meetingLink: "", 
                students: [] 
              });
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-[#00A1E4] hover:bg-[#0088c7] text-white focus:outline-none focus:ring-2 focus:ring-[#00A1E4] focus:ring-offset-2 transition-colors duration-200"
          >
            <FiPlus className="mr-2" />
            Create New Class
          </button>
        </div>

        {(isCreating || editingClass) && (
          <div className="mt-10 bg-richblack-800 rounded-xl shadow-md overflow-hidden border border-richblack-600 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-richblack-5">
              {editingClass ? "Update Live Class" : "Create Live Class"}
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-richblack-300 mb-1">
                  Class Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter class title"
                  value={classForm.title}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md text-sm bg-richblack-700 border border-richblack-600 text-richblack-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-richblack-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter class description"
                  value={classForm.description}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md text-sm bg-richblack-700 border border-richblack-600 text-richblack-100"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-richblack-300 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={classForm.startTime}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md text-sm bg-richblack-700 border border-richblack-600 text-richblack-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-richblack-300 mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={classForm.endTime}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md text-sm bg-richblack-700 border border-richblack-600 text-richblack-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-richblack-300 mb-1">
                  Meeting Link *
                </label>
                <input
                  type="url"
                  name="meetingLink"
                  placeholder="Enter meeting URL"
                  value={classForm.meetingLink}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md text-sm bg-richblack-700 border border-richblack-600 text-richblack-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-richblack-300 mb-1">
                  Select Students *
                </label>
                <div className="max-h-40 overflow-y-auto bg-richblack-700 rounded-md p-2 border border-richblack-600">
                  {studentsList.length > 0 ? (
                    studentsList.map(student => (
                      <div key={student._id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`student-${student._id}`}
                          checked={classForm.students.includes(student._id)}
                          onChange={() => handleStudentSelect(student._id)}
                          className="mr-2"
                        />
                        <label htmlFor={`student-${student._id}`} className="text-richblack-100">
                          {student.name || student.email}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-richblack-300 text-sm">No students available</p>
                  )}
                </div>
                {classForm.students.length > 0 && (
                  <p className="text-xs text-richblack-300 mt-1">
                    {classForm.students.length} student(s) selected
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-richblack-600 hover:bg-richblack-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={editingClass ? handleUpdateClass : handleCreateClass}
                className="px-6 py-2 bg-[#00A1E4] hover:bg-[#0088c7] text-white rounded-md"
              >
                {editingClass ? "Update Class" : "Create Class"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassTeacher;