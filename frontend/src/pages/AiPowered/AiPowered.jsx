import { useState, useRef, useEffect } from "react";
import { FaUserGraduate, FaRobot, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { apiConnector } from "../../services/apiConnector";
import { aiChatbotEndpoints } from "../../services/apis";

const AiPowered = () => {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMsg = { role: "student", content: question };
    setChat((prev) => [...prev, userMsg]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await apiConnector(
        "POST",
        aiChatbotEndpoints.AI_CHATBOT,
        { question },
        {
          "Content-Type": "application/json",
        }
      );

      if (response.data.success) {
        const aiMsg = { role: "ai", content: response.data.response };
        setChat((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(response.data.message || "Failed to get AI response");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = {
        role: "ai",
        content: "Sorry, I encountered an error. Please try again later.",
      };
      setChat((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F1A] to-[#1E1E2F] text-white flex flex-col items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8]">
          AI Doubt Assistant
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Get instant help with your study questions 24/7
        </p>

        <div className="w-full bg-[#1E1E2F] rounded-2xl shadow-2xl overflow-hidden border border-[#2A2A3C]">
          {/* Chat header */}
          <div className="bg-[#2A2A3C] p-4 flex items-center gap-3 border-b border-[#2A2A3C]">
            <div className="bg-[#2EC4B6]/20 p-2 rounded-lg">
              <FaRobot className="text-[#2EC4B6] text-xl" />
            </div>
            <div>
              <h2 className="font-semibold">StudyBot</h2>
              <p className="text-xs text-gray-400">AI-powered learning assistant</p>
            </div>
          </div>

          {/* Chat area */}
          <div className="h-[400px] overflow-y-auto p-4 scroll-smooth bg-gradient-to-b from-[#1E1E2F] to-[#0F0F1A]">
            <AnimatePresence>
              {chat.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500"
                >
                  <FaRobot className="text-4xl mb-4 text-[#2EC4B6] opacity-50" />
                  <h3 className="text-xl font-medium mb-2 text-gray-400">
                    Ask me anything about your studies
                  </h3>
                  <p className="max-w-md">
                    I can help explain concepts, solve problems, and guide you through difficult topics in your coursework.
                  </p>
                </motion.div>
              ) : (
                chat.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 mb-4 ${
                      msg.role === "student" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex-shrink-0 mt-1 bg-[#2EC4B6]/20 p-1.5 rounded-lg">
                        <FaRobot className="text-[#2EC4B6] text-lg" />
                      </div>
                    )}
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className={`max-w-[80%] p-3 rounded-xl whitespace-pre-wrap ${
                        msg.role === "student"
                          ? "bg-gradient-to-br from-[#38BDF8] to-[#2EC4B6] text-white rounded-br-none"
                          : "bg-[#2A2A3C] text-white rounded-bl-none border border-[#2A2A3C]"
                      }`}
                    >
                      {msg.content}
                    </motion.div>
                    {msg.role === "student" && (
                      <div className="flex-shrink-0 mt-1 bg-[#38BDF8]/20 p-1.5 rounded-lg">
                        <FaUserGraduate className="text-white text-lg" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 mb-4"
              >
                <div className="flex-shrink-0 mt-1 bg-[#2EC4B6]/20 p-1.5 rounded-lg">
                  <FaRobot className="text-[#2EC4B6] text-lg" />
                </div>
                <div className="bg-[#2A2A3C] text-white p-3 rounded-xl rounded-bl-none max-w-[80%] border border-[#2A2A3C]">
                  <div className="flex items-center gap-2">
                    <FaSpinner className="animate-spin text-[#2EC4B6]" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-[#2A2A3C] bg-[#1E1E2F]">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your doubt here..."
                  rows="1"
                  className="w-full rounded-xl bg-[#2A2A3C] text-white px-4 py-3 pr-12 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] resize-none"
                  style={{ minHeight: "50px", maxHeight: "150px" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!question.trim() || isLoading}
                  className={`absolute right-3 bottom-3 p-2 rounded-full transition ${
                    question.trim()
                      ? "bg-[#2EC4B6] text-white hover:bg-[#38BDF8]"
                      : "bg-[#1E1E2F] text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              StudyBot may produce inaccurate information. Always verify important facts.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AiPowered;