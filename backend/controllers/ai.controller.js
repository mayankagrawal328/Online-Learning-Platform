const model = require("../config/gemini.config");

const generateResponse = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Add context to make the AI respond as a tutor
    const prompt = `You are StudyBot, an AI-powered learning assistant designed to help students with their academic questions. 
    Your responses should be clear, concise, and educational. Break down complex concepts into simpler terms and provide examples when appropriate.
    
    Student's question: ${question}
    
    Please provide a helpful response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      response: text,
    });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({
      success: false,
      message: "Error generating AI response",
      error: error.message,
    });
  }
};

module.exports = {
  generateResponse,
};