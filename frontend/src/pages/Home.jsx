import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider";
import Course_Slider from "../components/core/Catalog/Course_Slider";

import { getCatalogPageData } from "../services/operations/pageAndComponentData";

import { MdOutlineRateReview } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";

import { motion } from "framer-motion";
import { fadeIn } from "./../components/common/motionFrameVarients";

import AllCourse from "./AllCourse";

// background random images
import backgroundImg1 from "../assets/Images/random bg img/coding bg1.jpg";
import backgroundImg2 from "../assets/Images/random bg img/coding bg2.jpg";
import backgroundImg3 from "../assets/Images/random bg img/coding bg3.jpg";
import backgroundImg4 from "../assets/Images/random bg img/coding bg4.jpg";
import backgroundImg5 from "../assets/Images/random bg img/coding bg5.jpg";
import backgroundImg6 from "../assets/Images/random bg img/coding bg6.jpeg";
import backgroundImg7 from "../assets/Images/random bg img/coding bg7.jpg";
import backgroundImg8 from "../assets/Images/random bg img/coding bg8.jpeg";
import backgroundImg9 from "../assets/Images/random bg img/coding bg9.jpg";
import backgroundImg10 from "../assets/Images/random bg img/coding bg10.jpg";
import backgroundImg111 from "../assets/Images/random bg img/coding bg11.jpg";

const randomImges = [
  backgroundImg1,
  backgroundImg2,
  backgroundImg3,
  backgroundImg4,
  backgroundImg5,
  backgroundImg6,
  backgroundImg7,
  backgroundImg8,
  backgroundImg9,
  backgroundImg10,
  backgroundImg111,
];

const Home = () => {
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [CatalogPageData, setCatalogPageData] = useState(null);
  const categoryID = "6506c9dff191d7ffdb4a3fe2"; // hard coded
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("html");
  const [codeOutput, setCodeOutput] = useState("");

  useEffect(() => {
    const bg = randomImges[Math.floor(Math.random() * randomImges.length)];
    setBackgroundImg(bg);
  }, []);

  useEffect(() => {
    const fetchCatalogPageData = async () => {
      const result = await getCatalogPageData(categoryID, dispatch);
      setCatalogPageData(result);
    };
    if (categoryID) {
      fetchCatalogPageData();
    }
  }, [categoryID]);

  // Interactive code examples
  const codeExamples = {
    html: {
      code: `<!DOCTYPE html>
<html>
<head>
  <title>AbhiiLearn</title>
  <style>
    body { font-family: Arial; }
    .container { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to AbhiiLearn!</h1>
    <p>Start your learning journey with us today.</p>
  </div>
</body>
</html>`,
      output:
        '<div class="container"><h1>Welcome to AbhiiLearn!</h1><p>Start your learning journey with us today.</p></div>',
    },
    javascript: {
      code: `// JavaScript example for AbhiiLearn
function greetLearner(name) {
  return 'Hello, ' + name + '! Welcome to AbhiiLearn!';
}

// Interactive result
const result = greetLearner('Student');
console.log(result);`,
      output: "Hello, Student! Welcome to AbhiiLearn!",
    },
    react: {
      code: `import React from 'react';

function AbhiiLearnApp() {
  const [lessonsCompleted, setLessonsCompleted] = useState(0);

  return (
    <div className="abhii-learn-app">
      <h1>Progress: {lessonsCompleted} lessons</h1>
      <button onClick={() => setLessonsCompleted(lessonsCompleted + 1)}>
        Complete Lesson
      </button>
    </div>
  );
}

export default AbhiiLearnApp;`,
      output:
        '<div class="abhii-learn-app"><h1>Progress: 0 lessons</h1><button>Complete Lesson</button></div>',
    },
  };

  const runCode = () => {
    setCodeOutput(codeExamples[activeTab].output);
  };

  return (
    <React.Fragment>
      {/* background random image */}
      <div>
        <div className="w-full h-[450px] md:h-[650px] absolute top-0 left-0 opacity-[0.3] overflow-hidden object-cover ">
          <img
            src={backgroundImg}
            alt="Background"
            className="w-full h-full object-cover "
          />

          <div className="absolute left-0 bottom-0 w-full h-[250px] opacity_layer_bg "></div>
        </div>
      </div>

      <div className=" ">
        {/*Section1  */}
        <div className="relative h-[450px] md:h-[550px] justify-center mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white ">
          <Link to={"/signup"}>
            <div
              className="z-0 group p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                                        transition-all duration-200 hover:scale-95 w-fit"
            >
              <div
                className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                              transition-all duration-200 group-hover:bg-richblack-900"
              >
                <p>Become an Instructor</p>
                <FaArrowRight />
              </div>
            </div>
          </Link>

          <motion.div
            variants={fadeIn("left", 0.1)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            className="text-center text-3xl lg:text-4xl font-semibold mt-7  "
          >
            Empower Your Future with
            <HighlightText text={"AbhiiLearn"} />
          </motion.div>

          <motion.div
            variants={fadeIn("right", 0.1)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            className=" mt-4 w-[90%] text-center text-base lg:text-lg font-bold text-richblack-300"
          >
            With AbhiiLearn's online courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors.
          </motion.div>

          <div className="flex flex-row gap-7 mt-8">
            <CTAButton active={true} linkto={"/signup"}>
              Start Learning
            </CTAButton>

            <CTAButton active={false} linkto={"/login"}>
              Book a Demo
            </CTAButton>
          </div>
        </div>

        {/* Interactive Code Playground Section */}
        <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-richblack-800 rounded-xl overflow-hidden shadow-2xl mb-16"
          >
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Interactive <HighlightText text="Learning Experience" />
              </h2>

              <div className="flex space-x-2 mb-4">
                {["html", "javascript", "react"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 rounded-md font-medium transition-all ${
                      activeTab === lang
                        ? "bg-yellow-500 text-richblack-900"
                        : "bg-richblack-700 hover:bg-richblack-600"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-richblack-900 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-mono text-sm text-richblack-300">
                      Code Editor
                    </h3>
                    <button
                      onClick={runCode}
                      className="px-3 py-1 bg-yellow-500 text-richblack-900 rounded-md hover:bg-yellow-400 transition-colors"
                    >
                      Run Code
                    </button>
                  </div>
                  <pre className="p-4 bg-richblack-950 rounded-md overflow-x-auto text-sm">
                    <code className={`language-${activeTab}`}>
                      {codeExamples[activeTab].code}
                    </code>
                  </pre>
                </div>

                <div className="bg-richblack-900 p-4 rounded-lg">
                  <h3 className="font-mono text-sm text-richblack-300 mb-2">
                    Output
                  </h3>
                  <div className="p-4 bg-richblack-950 rounded-md h-full min-h-[200px]">
                    {codeOutput ? (
                      <div
                        className="output-container"
                        dangerouslySetInnerHTML={{ __html: codeOutput }}
                      />
                    ) : (
                      <p className="text-richblack-400 italic">
                        Click "Run Code" to see the output
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-richblack-300 mb-4">
                  Try editing the code above and see real-time results!
                </p>
                <CTAButton active={true} linkto={"/signup"}>
                  Join AbhiiLearn Now
                </CTAButton>
              </div>
            </div>
          </motion.div>

          {/* course slider */}

          <AllCourse/>
          <ExploreMore />
        </div>

        {/* Rest of your existing sections... */}
        <div className="bg-pure-greys-5 text-richblack-700 ">
          <div className="homepage_bg h-[310px]">
            <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto">
              <div className="h-[150px]"></div>
              <div className="flex flex-row gap-7 text-white ">
                <CTAButton active={true} linkto={"/signup"}>
                  <div className="flex items-center gap-3">
                    Explore Full Catalog
                    <FaArrowRight />
                  </div>
                </CTAButton>
                <CTAButton active={false} linkto={"/signup"}>
                  <div>Learn more</div>
                </CTAButton>
              </div>
            </div>
          </div>

          <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
            <div className="flex flex-col lg:flex-row gap-5 mb-10 mt-[95px]">
              <div className="text-3xl lg:text-4xl font-semibold w-full lg:w-[45%]">
                Get the Skills you need for a
                <HighlightText text={"Job that is in demand"} />
              </div>

              <div className="flex flex-col gap-10 w-full lg:w-[40%] items-start">
                <div className="text-[16px]">
                  The modern AbhiiLearn platform helps you gain the skills needed
                  to be competitive in today's job market. We go beyond just
                  professional skills to provide comprehensive learning.
                </div>
                <CTAButton active={true} linkto={"/signup"}>
                  <div>Learn more</div>
                </CTAButton>
              </div>
            </div>

            <TimelineSection />
            <LearningLanguageSection />
          </div>
        </div>

        <div className="mt-14 w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">
          <InstructorSection />

          <h1 className="text-center text-3xl lg:text-4xl font-semibold mt-8 flex justify-center items-center gap-x-3">
            Reviews from other learners{" "}
            <MdOutlineRateReview className="text-yellow-25" />
          </h1>
          <ReviewSlider />
        </div>

        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Home;