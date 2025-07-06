import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCreditCard, FaMoneyBillWaveAlt, FaCheckCircle, FaLock, FaBookOpen } from "react-icons/fa";
import { SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";
import { BsCreditCard2Back } from "react-icons/bs";

const dummyCourses = [
  { id: 1, name: "React for Beginners", price: 49.99, category: "Frontend", duration: "8 weeks" },
  { id: 2, name: "Data Structures in Java", price: 39.99, category: "Algorithms", duration: "6 weeks" },
  { id: 3, name: "MongoDB Mastery", price: 29.99, category: "Database", duration: "4 weeks" },
  { id: 4, name: "Node.js for Developers", price: 59.99, category: "Backend", duration: "10 weeks" },
];

const dummyPaymentHistory = [
  { id: 1, date: "2023-09-15", course: "React for Beginners", amount: 49.99, status: "Completed", method: "VISA •••• 4242" },
  { id: 2, date: "2023-08-20", course: "Node.js for Developers", amount: 59.99, status: "Completed", method: "Mastercard •••• 5555" },
];

const Payment = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [paymentHistory, setPaymentHistory] = useState(dummyPaymentHistory);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("card");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }
    
    // Format expiry date with slash
    if (name === "expiry" && value.length === 2 && !paymentDetails.expiry.includes("/")) {
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: value + "/",
      }));
      return;
    }

    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (!paymentDetails.name || !paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
      alert("Please fill in all payment details.");
      return;
    }

    if (selectedCourses.length === 0) {
      alert("Please select at least one course.");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const newPayment = {
        id: paymentHistory.length + 1,
        date: new Date().toISOString().split("T")[0],
        course: selectedCourses.map((id) => dummyCourses.find((course) => course.id === id).name).join(", "),
        amount: selectedCourses.reduce(
          (total, id) => total + dummyCourses.find(course => course.id === id).price,
          0
        ),
        status: "Completed",
        method: "VISA •••• " + paymentDetails.cardNumber.slice(-4),
      };
      
      setPaymentHistory((prev) => [newPayment, ...prev]);
      setIsProcessing(false);
      setShowSuccess(true);
      setSelectedCourses([]);
      setPaymentDetails({
        name: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
      });
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const totalAmount = selectedCourses.reduce(
    (sum, id) => sum + dummyCourses.find(course => course.id === id).price,
    0
  );

  return (
    <div className="min-h-screen bg-richblack-900 text-white px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-transparent bg-clip-text">
            Course Enrollment
          </h1>
          <p className="text-center text-richblack-400 mt-2">
            Select your courses and complete payment to get started
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Selection */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-richblack-800">
                    <FaBookOpen className="text-blue-400" />
                  </span>
                  Available Courses
                </h2>
                <span className="text-sm text-richblack-400">
                  {selectedCourses.length} selected
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {dummyCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCourses.includes(course.id)
                        ? "border-blue-500 bg-blue-500 bg-opacity-10"
                        : "border-richblack-700 bg-richblack-800 hover:border-blue-400"
                    }`}
                    onClick={() => handleSelectCourse(course.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs px-2 py-1 rounded-full bg-richblack-700 text-blue-300">
                          {course.category}
                        </span>
                        <h3 className="text-lg font-semibold mt-2">{course.name}</h3>
                        <p className="text-sm text-richblack-400">{course.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-400">${course.price.toFixed(2)}</p>
                        {selectedCourses.includes(course.id) && (
                          <FaCheckCircle className="ml-auto mt-1 text-green-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-richblack-800">
                  <FaCreditCard className="text-blue-400" />
                </span>
                Payment Method
              </h2>
              
              <div className="bg-richblack-800 rounded-xl overflow-hidden shadow-lg">
                {/* Payment Tabs */}
                <div className="flex border-b border-richblack-700">
                  <button
                    className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${
                      activeTab === "card" ? "text-blue-400 border-b-2 border-blue-400" : "text-richblack-400"
                    }`}
                    onClick={() => setActiveTab("card")}
                  >
                    <FaCreditCard /> Credit Card
                  </button>
                  <button
                    className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${
                      activeTab === "bank" ? "text-blue-400 border-b-2 border-blue-400" : "text-richblack-400"
                    }`}
                    onClick={() => setActiveTab("bank")}
                  >
                    <FaMoneyBillWaveAlt /> Bank Transfer
                  </button>
                </div>
                
                {/* Card Payment Form */}
                <AnimatePresence mode="wait">
                  {activeTab === "card" && (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handlePaymentSubmit}
                      className="p-6"
                    >
                      <div className="mb-5">
                        <label className="block text-richblack-300 mb-2 text-sm font-medium">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={paymentDetails.name}
                          onChange={handlePaymentChange}
                          placeholder="John Smith"
                          className="w-full p-3 bg-richblack-700 text-white rounded-lg border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="mb-5">
                        <label className="block text-richblack-300 mb-2 text-sm font-medium">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentDetails.cardNumber}
                            onChange={handlePaymentChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full p-3 bg-richblack-700 text-white rounded-lg border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                          />
                          <div className="absolute left-3 top-3 flex gap-2">
                            <SiVisa className="text-xl text-richblack-400" />
                            <SiMastercard className="text-xl text-richblack-400" />
                            <SiAmericanexpress className="text-xl text-richblack-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                          <label className="block text-richblack-300 mb-2 text-sm font-medium">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            value={paymentDetails.expiry}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full p-3 bg-richblack-700 text-white rounded-lg border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-richblack-300 mb-2 text-sm font-medium">
                            CVV
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="cvv"
                              value={paymentDetails.cvv}
                              onChange={handlePaymentChange}
                              placeholder="•••"
                              maxLength={3}
                              className="w-full p-3 bg-richblack-700 text-white rounded-lg border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <BsCreditCard2Back className="absolute right-3 top-3 text-richblack-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-richblack-400 text-sm mb-6">
                        <FaLock />
                        <span>Your payment is secured with 256-bit encryption</span>
                      </div>
                      
                      <motion.button
                        type="submit"
                        disabled={selectedCourses.length === 0 || isProcessing}
                        whileHover={!isProcessing && selectedCourses.length > 0 ? { scale: 1.02 } : {}}
                        whileTap={!isProcessing && selectedCourses.length > 0 ? { scale: 0.98 } : {}}
                        className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                          isProcessing
                            ? "bg-blue-700 cursor-not-allowed"
                            : selectedCourses.length === 0
                            ? "bg-richblack-700 text-richblack-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        }`}
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            Pay ${totalAmount.toFixed(2)}
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
                
                {/* Bank Transfer Form */}
                <AnimatePresence mode="wait">
                  {activeTab === "bank" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6 text-center"
                    >
                      <div className="bg-richblack-700 rounded-lg p-6 mb-4">
                        <h3 className="font-medium mb-2">Bank Transfer Details</h3>
                        <div className="text-left space-y-3 text-sm text-richblack-300">
                          <p><strong>Bank Name:</strong> International Learning Bank</p>
                          <p><strong>Account Name:</strong> CodeMaster Academy</p>
                          <p><strong>Account Number:</strong> 1234567890</p>
                          <p><strong>SWIFT/BIC:</strong> ILBKENYAXXX</p>
                          <p><strong>Reference:</strong> Your student ID</p>
                        </div>
                      </div>
                      <p className="text-richblack-400 text-sm">
                        Please send the exact amount of <strong>${totalAmount.toFixed(2)}</strong> and include your student ID as reference.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Order Summary & History */}
          <div>
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-richblack-800 rounded-xl shadow-lg p-6 mb-8 sticky top-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-blue-400" />
                Order Summary
              </h2>
              
              {selectedCourses.length > 0 ? (
                <>
                  <div className="mb-4 space-y-3">
                    {selectedCourses.map((id) => {
                      const course = dummyCourses.find(c => c.id === id);
                      return (
                        <div key={id} className="flex justify-between items-center">
                          <span className="text-richblack-300">{course.name}</span>
                          <span className="font-medium">${course.price.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-richblack-700 pt-4 mb-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-richblack-400">
                    <p>By completing your purchase, you agree to our Terms of Service.</p>
                  </div>
                </>
              ) : (
                <p className="text-richblack-400 text-center py-4">
                  No courses selected yet
                </p>
              )}
            </motion.div>

            {/* Payment History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMoneyBillWaveAlt className="text-blue-400" />
                Payment History
              </h2>
              
              {paymentHistory.length > 0 ? (
                <div className="bg-richblack-800 rounded-xl shadow-lg overflow-hidden">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="border-b border-richblack-700 last:border-0">
                      <div className="p-4 hover:bg-richblack-700 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium">{payment.course}</h3>
                          <span className="font-bold">${payment.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-richblack-400">
                          <span>{payment.date}</span>
                          <span className="text-xs">{payment.method}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-green-900 text-green-300">
                            {payment.status}
                          </span>
                          <button className="text-xs text-blue-400 hover:underline">
                            View receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-richblack-400 text-center py-6 bg-richblack-800 rounded-xl">
                  No payment history yet
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50"
          >
            <FaCheckCircle className="text-xl" />
            <div>
              <p className="font-medium">Payment Successful!</p>
              <p className="text-sm opacity-90">Your courses have been enrolled</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payment;