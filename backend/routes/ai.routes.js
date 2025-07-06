const express = require("express");
const router = express.Router();
const { generateResponse } = require("../controllers/ai.controller");

// Route to handle AI question responses
router.post("/ask", generateResponse);

module.exports = router;