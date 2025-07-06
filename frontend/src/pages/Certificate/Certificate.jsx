import React, { useRef } from "react";
import { FaDownload, FaAward, FaSignature, FaQrcode } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";

const Certificate = () => {
  const certificateRef = useRef();

  const handleDownload = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: "Course Certificate",
    pageStyle: `
      @page { 
        size: A4 landscape;
        margin: 0;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact;
        }
        .certificate-container {
          box-shadow: none !important;
        }
      }
    `,
  });

  const userData = {
    name: "Mayank Agrawal",
    course: "Full Stack Web Development",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    hours: "300",
    instructor: "Dr. Sarah Johnson",
    certificationId: `CERT-${Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase()}`,
    verificationUrl: "https://verify.abhiilearn.com",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F1A] via-[#1A1A2E] to-[#2D2D44] text-white flex flex-col items-center py-10 px-4">
      <motion.div
        className="w-full max-w-6xl flex flex-col items-center gap-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#2EC4B6] via-[#38BDF8] to-[#6366F1]">
            Course Completion Certificate
          </h1>
          <p className="text-lg text-gray-300">
            Your achievement, beautifully documented
          </p>
        </motion.div>

        {/* Certificate Preview */}
        <motion.div
          variants={itemVariants}
          className="w-full relative"
          whileHover={{ 
            scale: 1.01,
            boxShadow: "0 25px 50px -12px rgba(46, 196, 182, 0.25)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div
            ref={certificateRef}
            className="w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl border-4 border-[#2EC4B6] shadow-2xl px-10 py-12 relative overflow-hidden certificate-container"
            style={{
              backgroundImage:
                "radial-gradient(circle at 10% 20%, rgba(46, 196, 182, 0.1) 0%, rgba(56, 189, 248, 0.1) 90%)",
            }}
          >
            {/* Gold foil effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full opacity-5" style={{
                backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjE1LDAsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')"
              }}></div>
            </div>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <FaAward className="w-72 h-72 text-[#2EC4B6]" />
            </div>

            {/* Corner decoration */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[#2EC4B6] rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[#38BDF8] rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[#6366F1] rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[#2EC4B6] rounded-br-2xl"></div>

            {/* Embossed effect */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.1) 100%)",
              mixBlendMode: "overlay"
            }}></div>

            <div className="text-center relative z-10">
              <div className="mb-8">
                <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8]">
                  Certificate of Completion
                </h2>
                <p className="text-lg text-gray-300 mb-2">
                  This certificate is proudly presented to
                </p>
              </div>

              <div className="my-10">
                <motion.h3
                  className="text-5xl font-bold text-white mb-6 tracking-wide"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  {userData.name}
                </motion.h3>

                <p className="text-gray-300 mb-4 text-lg">
                  for successfully completing <span className="font-semibold text-[#2EC4B6]">{userData.hours} hours</span> of the
                  course
                </p>
                <h4 className="text-3xl font-bold text-white mb-8 italic">
                  "{userData.course}"
                </h4>

                <div className="flex justify-center gap-12 my-10">
                  <div className="text-center">
                    <p className="text-gray-300 text-sm uppercase tracking-wider mb-1">Date Completed</p>
                    <p className="font-semibold text-lg">{userData.date}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-sm uppercase tracking-wider mb-1">Certificate ID</p>
                    <p className="font-semibold text-lg tracking-wider">{userData.certificationId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature & Seal */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-16">
              <div className="flex flex-col items-center mb-6 md:mb-0">
                <div className="h-16 w-48 bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] opacity-20 mb-2"></div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaSignature className="text-[#2EC4B6] text-xl" />
                  <div className="border-t border-gray-300 pt-1">
                    <p className="font-cursive text-2xl" style={{ fontFamily: "'Dancing Script', cursive" }}>
                      Dr. Mayank Agrawal
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Chief Instructor</p>
              </div>

              {/* Verification QR Code */}
              <div className="flex flex-col items-center mb-6 md:mb-0">
                <div className="w-24 h-24 bg-white p-2 rounded flex items-center justify-center mb-2">
                  <FaQrcode className="w-full h-full text-gray-800" />
                </div>
                <p className="text-xs text-gray-400">Scan to verify</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg mx-auto mb-2 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-white opacity-10"></div>
                  </div>
                  <div className="text-center p-2 z-10">
                    <p className="text-xs tracking-wider">AbhiiLearn</p>
                    <div className="w-8 h-1 bg-white mx-auto my-1 opacity-50"></div>
                    <p className="text-[8px] tracking-widest">SEAL</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Official Verification</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleDownload}
            className="flex items-center gap-3 bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#6366F1] text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all hover:shadow-xl"
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(56, 189, 248, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload className="text-lg" />
            <span>Download Certificate (PDF)</span>
          </motion.button>
          
          <motion.button
            className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaQrcode className="text-lg" />
            <span>Verify Online</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Certificate;