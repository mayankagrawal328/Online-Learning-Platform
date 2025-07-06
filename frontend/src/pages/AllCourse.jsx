import  { useState, useEffect } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { courseEndpoints } from '../services/apis';

const AllCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(courseEndpoints.GET_ALL_COURSE_API);

        if (response.data.success && Array.isArray(response.data.data)) {
          setCourses(response.data.data);
        } else {
          throw new Error('Invalid course data format');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to fetch courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCardClick = (courseId, e) => {
    if (e.target.closest('button')) return;
    navigate(`/course/${courseId}`);
  };

  const handleEnrollClick = (course, e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { from: '/courses' } });
      return;
    }
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  const confirmEnrollment = async () => {
    try {
      if (!selectedCourse) return;

      if (selectedCourse.price > 0) {
        navigate('/checkout', { state: { course: selectedCourse } });
      } else {
        const response = await axios.post(
          courseEndpoints.COURSE_PAYMENT_API,
          { courses: [selectedCourse._id] },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        if (response.data.success) {
          setShowEnrollModal(false);
          navigate(`/course/${selectedCourse._id}`);
        }
      }
    } catch (err) {
      console.error('Enrollment failed:', err);
      setError('Enrollment failed. Please try again.');
      setShowEnrollModal(false);
    }
  };

  const renderRatingStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-70" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-5 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-richblack-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-richblack-5 mb-2">Explore Our Courses</h1>
          <p className="text-lg text-richblack-300 max-w-2xl mx-auto">
            Master new skills with our expert-led courses. Start your learning journey today!
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 bg-richblack-800 rounded-xl shadow-inner">
            <h3 className="text-xl font-medium text-richblack-200 mb-2">No courses available</h3>
            <p className="text-richblack-400">Check back later for new course offerings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="bg-richblack-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group border border-richblack-700"
                onClick={(e) => handleCardClick(course._id, e)}
              >
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                    alt={course.courseName}
                    onError={(e) => { e.target.src = '/default-course.jpg'; }}
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-richblack-900 text-xs font-bold px-2 py-1 rounded">
                    {course.studentsEnrolled?.length || 0} Enrolled
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-richblack-5 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                      {course.courseName}
                    </h3>
                    <span className="bg-yellow-100 text-richblack-900 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                      {course.price > 0 ? `₹${course.price}` : 'FREE'}
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderRatingStars(4.5)}
                    </div>
                    <span className="text-sm text-richblack-400">
                      ({course.ratingAndReviews?.length || 0} reviews)
                    </span>
                  </div>

                  <p className="text-richblack-300 text-sm mb-4 line-clamp-3">
                    {course.courseDescription}
                  </p>

                  <div className="flex items-center mb-4">
                    <img 
                      src={course.instructor.image} 
                      className="w-8 h-8 rounded-full mr-2"
                      alt={course.instructor.firstName}
                    />
                    <span className="text-sm text-richblack-200">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleEnrollClick(course, e)}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-richblack-900 py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
                  >
                    <FiBookOpen className="mr-2" />
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourse;
