import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, FileText, BookOpen, Calendar, Award, Search, Filter, Download } from 'lucide-react';

const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
const classes = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

const generateDummyAssignments = () => {
  const dummyTitles = [
    'Algebra Homework',
    'Science Project',
    'Essay Writing',
    'History Report',
    'Art Portfolio',
    'Physics Lab Report',
    'Book Review',
    'Math Quiz',
    'Chemistry Experiment',
    'Creative Writing'
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: uuidv4(),
    title: dummyTitles[i % dummyTitles.length],
    description: `This is a sample assignment description for ${dummyTitles[i % dummyTitles.length]}. Students should complete all questions and submit by the due date.`,
    dueDate: new Date(Date.now() + 86400000 * (i + 1)).toISOString().split('T')[0],
    subject: subjects[i % subjects.length],
    class: classes[i % classes.length],
    points: [50, 100, 75, 150, 200][i % 5],
    attachments: [
      { name: `assignment_${i + 1}.pdf`, url: '#', type: 'pdf' },
      ...(i % 3 === 0 ? [{ name: `resources_${i + 1}.zip`, url: '#', type: 'zip' }] : [])
    ],
    createdAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
    status: 'active',
    submissions: Array.from({ length: Math.floor(Math.random() * 10) }, () => ({
      studentId: uuidv4(),
      studentName: `Student ${Math.floor(Math.random() * 30) + 1}`,
      submittedAt: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 5)).toISOString(),
      file: { name: `submission_${Math.floor(Math.random() * 100)}.pdf`, url: '#', type: 'pdf' },
      grade: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 50 : null,
      feedback: Math.random() > 0.5 ? 'Good work! Keep it up.' : null
    }))
  }));
};

const TeacherAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    id: '',
    title: '',
    description: '',
    dueDate: '',
    subject: 'Mathematics',
    class: 'Grade 1',
    points: 100,
    attachments: []
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [formErrors, setFormErrors] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load dummy data on first render
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dummyAssignments = generateDummyAssignments();
        setAssignments(dummyAssignments);
        
        // Generate some history items
        const historyItems = dummyAssignments.slice(0, 5).map(a => ({
          ...a,
          status: ['completed', 'graded', 'archived'][Math.floor(Math.random() * 3)],
          updatedAt: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 30)).toISOString()
        }));
        setAssignmentHistory(historyItems);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!newAssignment.title.trim()) errors.title = 'Title is required';
    if (!newAssignment.description.trim()) errors.description = 'Description is required';
    if (!newAssignment.dueDate) errors.dueDate = 'Due date is required';
    if (newAssignment.points <= 0) errors.points = 'Points must be positive';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.name.split('.').pop()
    }));
    setFiles(uploadedFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const now = new Date().toISOString();
    
    if (isEditing) {
      // When editing, move the old version to history
      const oldAssignment = assignments.find(a => a.id === newAssignment.id);
      setAssignmentHistory([...assignmentHistory, { ...oldAssignment, status: 'updated', updatedAt: now }]);
      
      // Update the current assignment
      setAssignments(assignments.map(a => a.id === newAssignment.id ? 
        { ...newAssignment, updatedAt: now, attachments: files.length > 0 ? files : newAssignment.attachments } : a));
    } else {
      // Create new assignment
      const assignmentWithId = { 
        ...newAssignment, 
        id: uuidv4(),
        createdAt: now,
        status: 'active',
        attachments: files,
        submissions: []
      };
      setAssignments([...assignments, assignmentWithId]);
    }
    resetForm();
  };

  const handleEdit = (assignment) => {
    setNewAssignment(assignment);
    setIsEditing(true);
    setIsFormVisible(true);
    setFiles(assignment.attachments);
  };

  const handleDelete = (id) => {
    // Move to history before deleting
    const deletedAssignment = assignments.find(a => a.id === id);
    setAssignmentHistory([...assignmentHistory, { ...deletedAssignment, status: 'deleted', updatedAt: new Date().toISOString() }]);
    
    setAssignments(assignments.filter(a => a.id !== id));
    if (selectedAssignment?.id === id) setSelectedAssignment(null);
  };

  const handleArchive = (id) => {
    // Archive an assignment (move to history)
    const archivedAssignment = assignments.find(a => a.id === id);
    setAssignmentHistory([...assignmentHistory, { ...archivedAssignment, status: 'archived', updatedAt: new Date().toISOString() }]);
    
    setAssignments(assignments.filter(a => a.id !== id));
    if (selectedAssignment?.id === id) setSelectedAssignment(null);
  };

  const resetForm = () => {
    setNewAssignment({
      id: '', title: '', description: '', dueDate: '', subject: 'Mathematics', class: 'Grade 1', points: 100, attachments: []
    });
    setIsEditing(false);
    setIsFormVisible(false);
    setFiles([]);
    setFormErrors({});
  };

  const filteredAssignments = assignments.filter(a => {
    const searchMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = filterSubject === 'all' || a.subject === filterSubject;
    return searchMatch && subjectMatch;
  });

  const filteredHistory = assignmentHistory.filter(a => {
    const searchMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = filterSubject === 'all' || a.subject === filterSubject;
    return searchMatch && subjectMatch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'graded': return 'bg-blue-500';
      case 'archived': return 'bg-gray-500';
      case 'deleted': return 'bg-red-500';
      case 'updated': return 'bg-yellow-500';
      case 'active': return 'bg-electricBlue';
      default: return 'bg-richblack-600';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'graded': return 'Graded';
      case 'archived': return 'Archived';
      case 'deleted': return 'Deleted';
      case 'updated': return 'Updated';
      case 'active': return 'Active';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleGradeSubmission = (assignmentId, submissionId, grade) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        const updatedSubmissions = assignment.submissions.map(sub => {
          if (sub.studentId === submissionId) {
            return { ...sub, grade: parseInt(grade), feedback: 'Graded by teacher' };
          }
          return sub;
        });
        return { ...assignment, submissions: updatedSubmissions };
      }
      return assignment;
    }));
  };

  return (
    <div className="min-h-screen px-4 md:px-6 py-8 bg-richblack-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-richblack-5">Assignment Manager</h1>
            <p className="text-richblack-300 mt-1">
              {activeTab === 'current' 
                ? `Managing ${assignments.length} active assignments` 
                : `Viewing ${assignmentHistory.length} historical records`}
            </p>
          </div>
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-electricBlue hover:bg-opacity-80 transition px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <FileText size={18} /> New Assignment
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-richblack-700 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 font-medium ${activeTab === 'current' ? 'text-electricBlue border-b-2 border-electricBlue' : 'text-richblack-400'}`}
          >
            Current Assignments
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'text-electricBlue border-b-2 border-electricBlue' : 'text-richblack-400'}`}
          >
            Assignment History
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-richblack-400" />
            </div>
            <input
              type="text"
              placeholder="Search assignments..."
              className="block w-full pl-10 pr-3 py-2 border border-richblack-700 rounded-lg bg-richblack-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-electricBlue text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-richblack-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border border-richblack-700 rounded-lg px-3 py-2 bg-richblack-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-electricBlue text-white"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electricBlue"></div>
          </div>
        ) : (
          <>
            {/* Current Assignments Tab */}
            {activeTab === 'current' && (
              <>
                {filteredAssignments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssignments.map(a => (
                      <div key={a.id} className="bg-richblack-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-richblack-700">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h2 className="text-xl font-semibold text-richblack-5">{a.title}</h2>
                            <p className="text-richblack-300 text-sm flex items-center gap-1 mt-1">
                              <BookOpen size={14} /> {a.subject} • {a.class}
                            </p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(a.status)}`}>
                            {getStatusText(a.status)}
                          </span>
                        </div>
                        
                        <p className="text-richblack-400 text-sm line-clamp-3 mb-4">{a.description}</p>
                        
                        <div className="flex justify-between text-sm text-richblack-300 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> Due: {formatDate(a.dueDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award size={14} /> {a.points} pts
                          </span>
                        </div>
                        
                        {a.attachments?.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-richblack-400 mb-1">Attachments:</p>
                            <div className="flex flex-wrap gap-1">
                              {a.attachments.map((file, index) => (
                                <a 
                                  key={index} 
                                  href={file.url} 
                                  className="inline-flex items-center text-xs text-electricBlue hover:text-opacity-80"
                                  download
                                >
                                  <Download className="h-3 w-3 mr-1" /> {file.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-richblack-400 mb-4">
                          <span>
                            {a.submissions?.length || 0} / 30 submitted
                          </span>
                          <button 
                            onClick={() => setSelectedAssignment(a)}
                            className="text-electricBlue hover:text-opacity-80 text-sm"
                          >
                            View details
                          </button>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(a)} 
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg text-white text-sm flex items-center justify-center gap-1"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleArchive(a.id)} 
                            className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-white text-sm flex items-center justify-center gap-1"
                          >
                            Archive
                          </button>
                          <button 
                            onClick={() => handleDelete(a.id)} 
                            className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-lg text-white text-sm flex items-center justify-center gap-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-richblack-400 mt-10 py-10 bg-richblack-800 rounded-xl border border-richblack-700">
                    <p className="text-lg">No assignments found</p>
                    <p className="mt-2">Try adjusting your search or create a new assignment</p>
                    <button
                      onClick={() => setIsFormVisible(true)}
                      className="mt-4 bg-electricBlue hover:bg-opacity-80 transition px-4 py-2 rounded-lg font-semibold"
                    >
                      + Create Assignment
                    </button>
                  </div>
                )}
              </>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-richblack-800 rounded-xl overflow-hidden border border-richblack-700">
                {filteredHistory.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-richblack-700 text-richblack-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Title</th>
                        <th className="py-3 px-4 text-left">Subject</th>
                        <th className="py-3 px-4 text-left">Class</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map(a => (
                        <tr 
                          key={a.id} 
                          className="border-b border-richblack-700 hover:bg-richblack-750 cursor-pointer"
                          onClick={() => setSelectedAssignment(a)}
                        >
                          <td className="py-3 px-4">{a.title}</td>
                          <td className="py-3 px-4">{a.subject}</td>
                          <td className="py-3 px-4">{a.class}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(a.status)}`}>
                              {getStatusText(a.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-richblack-300">
                            {formatDate(a.updatedAt || a.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-richblack-400 p-10">
                    <p className="text-lg">No history records found</p>
                    <p className="mt-2">Assignment history will appear here</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Assignment Form Modal */}
        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-richblack-800 p-6 rounded-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto border border-richblack-700">
              <button onClick={resetForm} className="absolute top-4 right-4 text-richblack-400 hover:text-red-500">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-richblack-5 mb-4">
                {isEditing ? 'Edit Assignment' : 'Create Assignment'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-richblack-300 mb-1">Title*</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={newAssignment.title} 
                      onChange={handleInputChange} 
                      placeholder="Assignment title" 
                      className={`px-4 py-2 rounded-lg w-full ${formErrors.title ? 'bg-red-900/50 border border-red-500' : 'bg-richblack-700 border border-richblack-600'} text-white`} 
                    />
                    {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-richblack-300 mb-1">Subject*</label>
                    <select 
                      name="subject" 
                      value={newAssignment.subject} 
                      onChange={handleInputChange} 
                      className="px-4 py-2 rounded-lg w-full bg-richblack-700 border border-richblack-600 text-white"
                    >
                      {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-richblack-300 mb-1">Class*</label>
                    <select 
                      name="class" 
                      value={newAssignment.class} 
                      onChange={handleInputChange} 
                      className="px-4 py-2 rounded-lg w-full bg-richblack-700 border border-richblack-600 text-white"
                    >
                      {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-richblack-300 mb-1">Due Date*</label>
                    <input 
                      type="date" 
                      name="dueDate" 
                      value={newAssignment.dueDate} 
                      onChange={handleInputChange} 
                      className={`px-4 py-2 rounded-lg w-full ${formErrors.dueDate ? 'bg-red-900/50 border border-red-500' : 'bg-richblack-700 border border-richblack-600'} text-white`} 
                    />
                    {formErrors.dueDate && <p className="text-red-500 text-sm mt-1">{formErrors.dueDate}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-richblack-300 mb-1">Points*</label>
                    <input 
                      type="number" 
                      name="points" 
                      value={newAssignment.points} 
                      onChange={handleInputChange} 
                      className={`px-4 py-2 rounded-lg w-full ${formErrors.points ? 'bg-red-900/50 border border-red-500' : 'bg-richblack-700 border border-richblack-600'} text-white`} 
                      min="1"
                    />
                    {formErrors.points && <p className="text-red-500 text-sm mt-1">{formErrors.points}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-richblack-300 mb-1">Description*</label>
                  <textarea 
                    name="description" 
                    value={newAssignment.description} 
                    onChange={handleInputChange} 
                    placeholder="Detailed assignment description..." 
                    className={`w-full px-4 py-2 rounded-lg ${formErrors.description ? 'bg-red-900/50 border border-red-500' : 'bg-richblack-700 border border-richblack-600'} text-white`} 
                    rows="4"
                  ></textarea>
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-richblack-300 mb-1">Attachments (optional)</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-richblack-700 py-2 px-3 border border-richblack-600 rounded-md shadow-sm text-sm leading-4 font-medium text-richblack-100 hover:bg-opacity-80">
                      <span>Choose files</span>
                      <input 
                        type="file" 
                        multiple 
                        onChange={handleFileUpload} 
                        className="sr-only" 
                      />
                    </label>
                    <span className="text-sm text-richblack-400">
                      {files.length > 0 ? `${files.length} file(s) selected` : 'No files chosen'}
                    </span>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-richblack-400 mb-1">Selected files:</p>
                      <div className="flex flex-wrap gap-1">
                        {files.map((file, index) => (
                          <span key={index} className="text-xs text-richblack-300 bg-richblack-700 px-2 py-1 rounded">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={resetForm} 
                    className="px-4 py-2 bg-richblack-600 hover:bg-richblack-700 rounded-lg text-white border border-richblack-600"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-electricBlue hover:bg-opacity-80 rounded-lg text-richblack-900 font-bold"
                  >
                    {isEditing ? 'Update Assignment' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assignment Detail Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-richblack-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-richblack-700">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-richblack-5">{selectedAssignment.title}</h2>
                    <p className="text-sm text-richblack-300 mt-1 flex items-center gap-1">
                      <BookOpen size={14} /> {selectedAssignment.subject} • {selectedAssignment.class}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedAssignment(null)}
                    className="text-richblack-400 hover:text-richblack-300"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAssignment.status)}`}>
                    {getStatusText(selectedAssignment.status)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-richblack-700 text-richblack-100">
                    <Calendar size={14} className="mr-1" /> Due: {formatDate(selectedAssignment.dueDate)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-richblack-700 text-richblack-100">
                    <Award size={14} className="mr-1" /> {selectedAssignment.points} points
                  </span>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-richblack-5">Description</h3>
                  <p className="mt-2 text-richblack-300 whitespace-pre-line">{selectedAssignment.description}</p>
                </div>
                
                {selectedAssignment.attachments?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-richblack-5">Attachments</h3>
                    <div className="mt-2 space-y-2">
                      {selectedAssignment.attachments.map((file, index) => (
                        <a 
                          key={index} 
                          href={file.url} 
                          download
                          className="flex items-center text-electricBlue hover:text-opacity-80"
                        >
                          <Download size={16} className="mr-2" /> {file.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-richblack-5">Submissions</h3>
                    <span className="text-sm text-richblack-300">
                      {selectedAssignment.submissions?.length || 0} out of 30 students submitted
                    </span>
                  </div>
                  
                  {selectedAssignment.submissions?.length > 0 ? (
                    <div className="bg-richblack-700 rounded-lg overflow-hidden border border-richblack-600">
                      <table className="w-full">
                        <thead className="bg-richblack-600">
                          <tr>
                            <th className="py-2 px-4 text-left text-sm font-medium text-richblack-50">Student</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-richblack-50">Submission Date</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-richblack-50">File</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-richblack-50">Grade</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-richblack-50">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAssignment.submissions.map((submission, index) => (
                            <tr key={index} className="border-b border-richblack-600 hover:bg-richblack-750">
                              <td className="py-3 px-4 text-sm text-richblack-100">{submission.studentName}</td>
                              <td className="py-3 px-4 text-sm text-richblack-300">{formatDate(submission.submittedAt)}</td>
                              <td className="py-3 px-4 text-sm">
                                <a 
                                  href={submission.file.url} 
                                  download
                                  className="text-electricBlue hover:text-opacity-80 flex items-center"
                                >
                                  <Download size={14} className="mr-1" /> {submission.file.name}
                                </a>
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {submission.grade ? (
                                  <span className="font-medium">{submission.grade}/{selectedAssignment.points}</span>
                                ) : (
                                  <span className="text-richblack-400">Not graded</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {submission.grade ? (
                                  <button className="text-yellow-500 hover:text-yellow-400">
                                    Edit Grade
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="number" 
                                      min="0" 
                                      max={selectedAssignment.points}
                                      placeholder="Grade"
                                      className="w-16 px-2 py-1 rounded bg-richblack-600 border border-richblack-500 text-sm"
                                      onChange={(e) => handleGradeSubmission(selectedAssignment.id, submission.studentId, e.target.value)}
                                    />
                                    <button className="text-green-500 hover:text-green-400 text-sm">
                                      Save
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-richblack-700 rounded-lg p-4 text-center text-richblack-400 border border-richblack-600">
                      No submissions yet
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      handleEdit(selectedAssignment);
                      setSelectedAssignment(null);
                    }}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white"
                  >
                    Edit Assignment
                  </button>
                  <button
                    onClick={() => {
                      selectedAssignment.status === 'active' 
                        ? handleArchive(selectedAssignment.id) 
                        : handleDelete(selectedAssignment.id);
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                  >
                    {selectedAssignment.status === 'active' ? 'Archive' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignment;