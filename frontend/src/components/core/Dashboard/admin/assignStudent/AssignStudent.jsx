import { useState, useEffect, useCallback, useMemo } from "react";
import { settingsEndpoints, courseEndpoints } from "../../../../../services/apis";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const { ALL_STUDENT } = settingsEndpoints;
const { GET_ALL_COURSE_API, REMOVE_STUDENT_ADMIN, ADD_STUDENT_ADMIN } = courseEndpoints;

const AssignStudent = () => {
  const { token } = useSelector((state) => state.auth);

  const axiosInstance = useMemo(() => axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }), [token]);

  const [activeTab, setActiveTab] = useState("assign");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState({
    initial: true,
    assign: false,
    remove: null,
    enrolled: false
  });
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  // Fetch all necessary data
  const fetchData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, initial: true }));
      const [courseRes, studentRes] = await Promise.all([
        axiosInstance.get(GET_ALL_COURSE_API),
        axiosInstance.get(ALL_STUDENT),
      ]);

      if (courseRes.data.success) {
        setCourses(courseRes.data.data);
      }

      if (studentRes.data.success) {
        const filtered = studentRes.data.data.filter(
          (user) => user.accountType === "Student"
        );
        setStudents(filtered);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Fetch error:", error);
    } finally {
      setLoading(prev => ({ ...prev, initial: false }));
    }
  }, [axiosInstance]);

  // Fetch enrolled students from course data
  const fetchEnrolledStudents = useCallback(async (courseId) => {
    if (!courseId) return;
    
    try {
      setLoading(prev => ({ ...prev, enrolled: true }));
      
      // Option 1: If you have a direct endpoint for enrolled students
      // const res = await axiosInstance.get(`/api/v1/courses/${courseId}/students`);
      
      // Option 2: Get full course details which includes studentsEnrolled
      const res = await axiosInstance.get(`${GET_ALL_COURSE_API}/${courseId}`);
      
      if (res.data.success) {
        // Get the enrolled student IDs from the course
        const enrolledStudentIds = res.data.data.studentsEnrolled || [];
        
        // Match with full student data
        const enrolledWithData = students.filter(student => 
          enrolledStudentIds.includes(student._id)
        );
        
        setEnrolledStudents(enrolledWithData);
      }
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      toast.error("Failed to load enrolled students");
    } finally {
      setLoading(prev => ({ ...prev, enrolled: false }));
    }
  }, [axiosInstance, students]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch enrolled students when course changes in remove tab
  useEffect(() => {
    if (activeTab === "remove" && selectedCourse) {
      fetchEnrolledStudents(selectedCourse);
    }
  }, [selectedCourse, activeTab, fetchEnrolledStudents]);

  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(term);
    });
  }, [students, searchTerm]);

  const handleAssign = async () => {
    if (!selectedCourse || !selectedStudent) {
      toast.error("Please select both course and student");
      return;
    }

    const selected = students.find((s) => s._id === selectedStudent);
    if (!selected?.email) {
      toast.error("Student not found or email missing");
      return;
    }

    setLoading(prev => ({ ...prev, assign: true }));

    try {
      const payload = { courseId: selectedCourse, studentEmail: selected.email };
      const res = await axiosInstance.post(ADD_STUDENT_ADMIN, payload);

      if (res.data.success) {
        // Refresh the enrolled students list if we're on the remove tab
        if (activeTab === "remove") {
          await fetchEnrolledStudents(selectedCourse);
        }
        setSelectedStudent("");
        setSearchTerm("");
        toast.success("Student assigned successfully ✅");
      } else {
        toast.error(res.data.message || "Assignment failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign student");
    } finally {
      setLoading(prev => ({ ...prev, assign: false }));
    }
  };

  const handleRemove = async (studentId) => {
    const selected = students.find((s) => s._id === studentId);
    if (!selected) {
      toast.error("Student not found");
      return;
    }

    setLoading(prev => ({ ...prev, remove: studentId }));

    try {
      const payload = { courseId: selectedCourse, studentEmail: selected.email };
      const res = await axiosInstance.post(REMOVE_STUDENT_ADMIN, payload);

      if (res.data.success) {
        // Refresh the enrolled students list
        await fetchEnrolledStudents(selectedCourse);
        toast.success("Student removed successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove student");
    } finally {
      setLoading(prev => ({ ...prev, remove: null }));
    }
  };

  useEffect(() => {
    if (searchTerm && !filteredStudents.some((s) => s._id === selectedStudent)) {
      setSelectedStudent("");
    }
  }, [searchTerm, filteredStudents, selectedStudent]);

  if (loading.initial) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-richblack-800 min-h-[80vh] text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-yellow-400 mb-6 text-center">
        Assign Students to Course
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 justify-center">
        {["assign", "remove"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={loading.assign || loading.remove !== null}
            className={`px-4 py-2 rounded-full font-medium ${
              activeTab === tab
                ? "bg-yellow-400 text-richblack-900"
                : "bg-richblack-700"
            } ${(loading.assign || loading.remove !== null) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Course Dropdown */}
      <div className="mb-4">
        <label className="block mb-1 text-richblack-300">Select Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full p-2 rounded bg-richblack-700 text-white"
          disabled={loading.initial || loading.enrolled}
        >
          <option value="">-- Choose Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
        {loading.enrolled && (
          <div className="absolute right-3 top-9">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        )}
      </div>

      {/* Assign Tab */}
      {activeTab === "assign" && (
        <>
          <div className="mb-4">
            <label className="block mb-1 text-richblack-300">Search Student</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded bg-richblack-700 text-white"
              disabled={loading.assign}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-richblack-300">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-2 rounded bg-richblack-700 text-white"
              disabled={loading.assign || filteredStudents.length === 0}
            >
              <option value="">-- Choose Student --</option>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <option key={student._id} value={student._id}>
                    {`${student.firstName} ${student.lastName}`} - {student.email}
                  </option>
                ))
              ) : (
                <option disabled value="">
                  {searchTerm ? "No matching students" : "No students available"}
                </option>
              )}
            </select>
          </div>

          <button
            onClick={handleAssign}
            disabled={!selectedCourse || !selectedStudent || loading.assign}
            className={`bg-yellow-400 px-4 py-2 rounded text-richblack-900 font-semibold hover:bg-opacity-90 transition ${
              (!selectedCourse || !selectedStudent || loading.assign) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading.assign ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-richblack-900 mr-2"></span>
                Assigning...
              </span>
            ) : (
              "Assign Student"
            )}
          </button>
        </>
      )}

      {/* Remove Tab */}
      {activeTab === "remove" && (
        <div className="mt-4">
          {!selectedCourse ? (
            <p className="text-richblack-300">Please select a course to view enrolled students</p>
          ) : loading.enrolled ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : enrolledStudents.length === 0 ? (
            <p className="text-richblack-300">No students enrolled in this course</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left mt-4 border border-richblack-700">
                <thead>
                  <tr className="bg-richblack-700 text-yellow-400">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="border-t border-richblack-600 hover:bg-richblack-700 transition"
                    >
                      <td className="py-2 px-3">{`${student.firstName} ${student.lastName}`}</td>
                      <td className="py-2 px-3">{student.email}</td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleRemove(student._id)}
                          disabled={loading.remove === student._id}
                          className={`text-red-400 hover:text-red-500 font-medium ${
                            loading.remove === student._id ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading.remove === student._id ? "Removing..." : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignStudent;