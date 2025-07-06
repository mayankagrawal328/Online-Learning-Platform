import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileText, BookOpen, Calendar, Award, Search, Filter, Download, Upload, Check, Clock, X } from 'lucide-react';

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
    description: `This is a sample assignment description for ${dummyTitles[i % dummyTitles.length]}. Complete all questions and submit by the due date.`,
    dueDate: new Date(Date.now() + 86400000 * (i + 1)).toISOString().split('T')[0],
    subject: subjects[i % subjects.length],
    class: classes[i % classes.length],
    points: [50, 100, 75, 150, 200][i % 5],
    attachments: [
      { 
        id: uuidv4(),
        name: `assignment_${i + 1}.pdf`, 
        url: '#', 
        type: 'pdf',
        downloadCount: 0
      },
      ...(i % 3 === 0 ? [{ 
        id: uuidv4(),
        name: `resources_${i + 1}.zip`, 
        url: '#', 
        type: 'zip',
        downloadCount: 0
      }] : [])
    ],
    createdAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
    status: ['active', 'upcoming', 'overdue'][i % 3],
    submission: i % 2 === 0 ? {
      id: uuidv4(),
      submittedAt: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 3)).toISOString(),
      file: { 
        id: uuidv4(),
        name: `my_submission_${i + 1}.pdf`, 
        url: '#', 
        type: 'pdf',
        downloadCount: 0
      },
      grade: i % 4 === 0 ? Math.floor(Math.random() * 50) + 50 : null,
      feedback: i % 4 === 0 ? ['Good work!', 'Needs improvement', 'Excellent'][Math.floor(Math.random() * 3)] : null
    } : null
  }));
};

const StudentAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({});

  // Load dummy data on first render
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dummyAssignments = generateDummyAssignments();
        setAssignments(dummyAssignments);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        id: uuidv4(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.name.split('.').pop(),
        downloadCount: 0
      });
    }
  };

  const handleDownload = (assignmentId, fileId, isSubmission = false) => {
    // Simulate download progress
    setDownloadProgress(prev => ({ ...prev, [fileId]: 0 }));
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const newProgress = prev[fileId] + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Update download count
          updateDownloadCount(assignmentId, fileId, isSubmission);
          return { ...prev, [fileId]: 100 };
        }
        return { ...prev, [fileId]: newProgress };
      });
    }, 100);

    // Clear progress after completion
    setTimeout(() => {
      setDownloadProgress(prev => {
        const { [fileId]: _, ...rest } = prev;
        return rest;
      });
    }, 1500);
  };

  const updateDownloadCount = (assignmentId, fileId, isSubmission) => {
    setAssignments(prevAssignments => 
      prevAssignments.map(assignment => {
        if (assignment.id === assignmentId) {
          if (isSubmission) {
            // Update submission file download count
            return {
              ...assignment,
              submission: {
                ...assignment.submission,
                file: {
                  ...assignment.submission.file,
                  downloadCount: (assignment.submission.file.downloadCount || 0) + 1
                }
              }
            };
          } else {
            // Update assignment attachment download count
            const updatedAttachments = assignment.attachments.map(attachment => {
              if (attachment.id === fileId) {
                return { ...attachment, downloadCount: (attachment.downloadCount || 0) + 1 };
              }
              return attachment;
            });
            return { ...assignment, attachments: updatedAttachments };
          }
        }
        return assignment;
      })
    );

    // Also update selected assignment if it's the one being viewed
    if (selectedAssignment?.id === assignmentId) {
      setSelectedAssignment(prev => {
        if (isSubmission) {
          return {
            ...prev,
            submission: {
              ...prev.submission,
              file: {
                ...prev.submission.file,
                downloadCount: (prev.submission.file.downloadCount || 0) + 1
              }
            }
          };
        } else {
          const updatedAttachments = prev.attachments.map(attachment => {
            if (attachment.id === fileId) {
              return { ...attachment, downloadCount: (attachment.downloadCount || 0) + 1 };
            }
            return attachment;
          });
          return { ...prev, attachments: updatedAttachments };
        }
      });
    }
  };

  const handleSubmitAssignment = (assignmentId) => {
    if (!uploadedFile) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setAssignments(prevAssignments => 
        prevAssignments.map(a => {
          if (a.id === assignmentId) {
            return {
              ...a,
              submission: {
                id: uuidv4(),
                submittedAt: new Date().toISOString(),
                file: uploadedFile,
                grade: null,
                feedback: null
              },
              status: 'submitted'
            };
          }
          return a;
        })
      );
      
      // Update selected assignment if it's the one being viewed
      if (selectedAssignment?.id === assignmentId) {
        setSelectedAssignment({
          ...selectedAssignment,
          submission: {
            id: uuidv4(),
            submittedAt: new Date().toISOString(),
            file: uploadedFile,
            grade: null,
            feedback: null
          },
          status: 'submitted'
        });
      }
      
      setUploadedFile(null);
      setIsSubmitting(false);
    }, 1500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'submitted': return 'bg-blue-500';
      case 'graded': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'upcoming': return 'bg-yellow-500';
      case 'active': return 'bg-electricBlue';
      default: return 'bg-richblack-600';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'submitted': return 'Submitted';
      case 'graded': return 'Graded';
      case 'overdue': return 'Overdue';
      case 'upcoming': return 'Upcoming';
      case 'active': return 'Active';
      default: return status;
    }
  };

  const filteredAssignments = assignments.filter(a => {
    const searchMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = filterSubject === 'all' || a.subject === filterSubject;
    const statusMatch = filterStatus === 'all' || a.status === filterStatus;
    return searchMatch && subjectMatch && statusMatch;
  });

  return (
    <div className="min-h-screen px-4 md:px-6 py-8 bg-richblack-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-richblack-5">My Assignments</h1>
            <p className="text-richblack-300 mt-1">
              {`You have ${assignments.filter(a => a.status === 'active' || a.status === 'overdue').length} pending assignments`}
            </p>
          </div>
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
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-richblack-700 rounded-lg px-3 py-2 bg-richblack-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-electricBlue text-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electricBlue"></div>
          </div>
        ) : (
          <>
            {filteredAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map(a => (
                  <div 
                    key={a.id} 
                    className="bg-richblack-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-richblack-700 cursor-pointer"
                    onClick={() => setSelectedAssignment(a)}
                  >
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
                          {a.attachments.map((file) => (
                            <div key={file.id} className="flex items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(a.id, file.id);
                                }}
                                className="inline-flex items-center text-xs text-electricBlue hover:text-opacity-80"
                                disabled={downloadProgress[file.id] !== undefined}
                              >
                                <Download className="h-3 w-3 mr-1" /> {file.name}
                                {file.downloadCount > 0 && (
                                  <span className="text-xs text-richblack-400 ml-1">({file.downloadCount})</span>
                                )}
                              </button>
                              {downloadProgress[file.id] !== undefined && (
                                <span className="ml-2 text-xs text-richblack-300">
                                  {downloadProgress[file.id]}%
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {a.submission ? (
                      <div className="mb-2">
                        <p className="text-xs text-richblack-400 mb-1">Your submission:</p>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(a.id, a.submission.file.id, true);
                            }}
                            className="inline-flex items-center text-xs text-electricBlue hover:text-opacity-80"
                            disabled={downloadProgress[a.submission.file.id] !== undefined}
                          >
                            <Download className="h-3 w-3 mr-1" /> {a.submission.file.name}
                            {a.submission.file.downloadCount > 0 && (
                              <span className="text-xs text-richblack-400 ml-1">({a.submission.file.downloadCount})</span>
                            )}
                          </button>
                          {downloadProgress[a.submission.file.id] !== undefined && (
                            <span className="text-xs text-richblack-300">
                              {downloadProgress[a.submission.file.id]}%
                            </span>
                          )}
                          <span className="text-xs text-richblack-300">
                            {formatDate(a.submission.submittedAt)}
                          </span>
                        </div>
                        {a.submission.grade && (
                          <div className="mt-2">
                            <p className="text-xs text-richblack-400 mb-1">Grade:</p>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">
                                {a.submission.grade}/{a.points}
                              </span>
                              {a.submission.feedback && (
                                <span className="text-xs text-richblack-300 italic">
                                  "{a.submission.feedback}"
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssignment(a);
                        }}
                        className="w-full bg-electricBlue hover:bg-opacity-80 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Upload size={16} /> Submit Assignment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-richblack-400 mt-10 py-10 bg-richblack-800 rounded-xl border border-richblack-700">
                <p className="text-lg">No assignments found</p>
                <p className="mt-2">Try adjusting your search filters</p>
              </div>
            )}
          </>
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
                    onClick={() => {
                      setSelectedAssignment(null);
                      setUploadedFile(null);
                    }}
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
                    <h3 className="text-lg font-medium text-richblack-5">Assignment Files</h3>
                    <div className="mt-2 space-y-2">
                      {selectedAssignment.attachments.map((file) => (
                        <div key={file.id} className="flex items-center justify-between">
                          <button
                            onClick={() => handleDownload(selectedAssignment.id, file.id)}
                            className="flex items-center text-electricBlue hover:text-opacity-80"
                            disabled={downloadProgress[file.id] !== undefined}
                          >
                            <Download size={16} className="mr-2" /> {file.name}
                            {file.downloadCount > 0 && (
                              <span className="text-xs text-richblack-400 ml-1">({file.downloadCount})</span>
                            )}
                          </button>
                          {downloadProgress[file.id] !== undefined && (
                            <span className="text-xs text-richblack-300">
                              Downloading... {downloadProgress[file.id]}%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-richblack-5 mb-4">
                    {selectedAssignment.submission ? 'Your Submission' : 'Submit Assignment'}
                  </h3>
                  
                  {selectedAssignment.submission ? (
                    <div className="bg-richblack-700 rounded-lg p-4 border border-richblack-600">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FileText size={18} className="mr-2 text-electricBlue" />
                          <span>{selectedAssignment.submission.file.name}</span>
                          {selectedAssignment.submission.file.downloadCount > 0 && (
                            <span className="text-xs text-richblack-400 ml-1">({selectedAssignment.submission.file.downloadCount})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {downloadProgress[selectedAssignment.submission.file.id] !== undefined && (
                            <span className="text-xs text-richblack-300">
                              {downloadProgress[selectedAssignment.submission.file.id]}%
                            </span>
                          )}
                          <button
                            onClick={() => handleDownload(selectedAssignment.id, selectedAssignment.submission.file.id, true)}
                            className="text-electricBlue hover:text-opacity-80 text-sm flex items-center"
                            disabled={downloadProgress[selectedAssignment.submission.file.id] !== undefined}
                          >
                            <Download size={16} className="mr-1" /> Download
                          </button>
                        </div>
                        <span className="text-sm text-richblack-300">
                          Submitted: {formatDate(selectedAssignment.submission.submittedAt)}
                        </span>
                      </div>
                      
                      {selectedAssignment.submission.grade ? (
                        <div className="mt-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-richblack-50">Grade:</h4>
                            <span className="text-lg font-bold">
                              {selectedAssignment.submission.grade}/{selectedAssignment.points}
                            </span>
                          </div>
                          {selectedAssignment.submission.feedback && (
                            <div className="mt-2">
                              <h4 className="font-medium text-richblack-50">Feedback:</h4>
                              <p className="text-richblack-300 italic mt-1">
                                "{selectedAssignment.submission.feedback}"
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-4 text-yellow-500">
                          <Clock size={16} />
                          <span>Your submission is being reviewed</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-richblack-700 rounded-lg p-4 border border-richblack-600">
                      {!uploadedFile ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <label className="cursor-pointer bg-richblack-600 py-3 px-6 rounded-md shadow-sm text-sm leading-4 font-medium text-richblack-100 hover:bg-opacity-80 border border-dashed border-richblack-500 flex flex-col items-center">
                            <Upload size={24} className="mb-2" />
                            <span>Click to upload file</span>
                            <input 
                              type="file" 
                              onChange={handleFileUpload} 
                              className="sr-only" 
                            />
                          </label>
                          <p className="text-xs text-richblack-400 mt-2">
                            PDF, DOCX, PPTX (Max 10MB)
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <FileText size={18} className="mr-2 text-electricBlue" />
                              <span>{uploadedFile.name}</span>
                            </div>
                            <button 
                              onClick={() => setUploadedFile(null)}
                              className="text-red-500 hover:text-red-400 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <button
                            onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                            disabled={isSubmitting}
                            className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                              isSubmitting 
                                ? 'bg-richblack-600 text-richblack-300' 
                                : 'bg-electricBlue hover:bg-opacity-80 text-richblack-900'
                            }`}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="animate-spin">↻</span>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Check size={16} />
                                Submit Assignment
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignment;