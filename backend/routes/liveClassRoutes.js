const express = require("express");
const router = express.Router();

const {
  createLiveClass,
  getUpcomingLiveClasses,
  getLiveClassDetails,
  getTeacherLiveClasses,
  updateLiveClass,
  deleteLiveClass
} = require("../controllers/liveClassController");

const { auth, isInstructor, isStudent } = require("../middleware/auth");

// GET teacher's classes (Instructor Only)
router.get("/teacher", auth, isInstructor, getTeacherLiveClasses);

// CREATE a live class (Instructor Only)
router.post("/create", auth, isInstructor, createLiveClass);

// GET all upcoming classes (Student or Instructor)
router.get("/upcoming", auth, getUpcomingLiveClasses);

// JOIN a live class (Student Only, pass classId in query params)
router.get("/join", auth, isStudent, getLiveClassDetails);

// UPDATE a live class (Instructor Only)
router.put("/update", auth, isInstructor, updateLiveClass);

// DELETE a live class (Instructor Only)
router.delete("/delete", auth, isInstructor, deleteLiveClass);


module.exports = router;
