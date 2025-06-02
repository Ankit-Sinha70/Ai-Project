import { useEffect, useRef, useState } from "react";
import "./App.css";
import { URL, API_KEY } from "./constant";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAnswer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAsk = async (isFromHistory = false) => {
    const query = isFromHistory ? selectedHistory : question;

    if (!query.trim()) return;

    if (!isFromHistory && question) {
      const newHistory = [question, ...recentHistory.filter(h => h !== question).slice(0, 30)]; // Keep latest 30, prevent duplicates
      localStorage.setItem("history", JSON.stringify(newHistory));
      setRecentHistory(newHistory);
    }
    
    const currentQuestionText = query;
    const questionEntry = { type: "q", text: currentQuestionText };
    
    setAnswer(prev => [...prev, questionEntry]);
    if (!isFromHistory) {
      setQuestion(""); // Clear input only for new questions
    }
    setIsLoading(true);
    
    setTimeout(() => { 
        if (scrollToAnswer.current) {
            scrollToAnswer.current.scrollTop = scrollToAnswer.current.scrollHeight;
        }
    }, 0);


    const payload = {
      contents: [ { parts: [{ text: currentQuestionText }] } ],
    };

    try {
      const response = await fetch(`${URL}${API_KEY}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      let dataString = data.candidates[0].content.parts[0].text;
      dataString = dataString.split("* ").map((item) => item.trim()).filter(item => item);


      setAnswer(prev => [...prev, { type: "a", text: dataString }]);

    } catch (error) {
      console.error("Error fetching answer:", error);
      const errorEntry = {
        type: "a",
        text: "Sorry, I couldn't get an answer. Please try again.",
      };
      setAnswer(prev => [...prev, errorEntry]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (scrollToAnswer.current) {
          scrollToAnswer.current.scrollTop = scrollToAnswer.current.scrollHeight;
        }
      }, 0);
    }
  };

  const handleDeleteHistory = (itemToDelete) => {
    const updatedHistory = recentHistory.filter(
      (item) => item !== itemToDelete
    );
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setRecentHistory(updatedHistory);
    if (selectedHistory === itemToDelete) {
        setSelectedHistory(""); // Clear selection if deleted
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (selectedHistory) {
      setQuestion(""); 
      handleAsk(true); 
      setSelectedHistory(""); 
    }
  }, [selectedHistory]); 
  
  // useEffect(() => {
  // }, []);


  return (
    <>
      <div className="grid md:grid-cols-5 h-screen text-white relative"> {/* Added relative for positioning context */}
        <Sidebar
          recentHistory={recentHistory}
          setSelectedHistory={setSelectedHistory}
          handleDeleteHistory={handleDeleteHistory}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="md:col-span-4 p-4 md:p-6 flex flex-col h-screen relative"> {/* Main content area, added relative for hamburger */}
          {/* Hamburger Menu Button - visible only on small screens (md:hidden) */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white absolute top-4 left-4 z-20"
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* ChatArea and ChatInput */}
          <ChatArea
            answer={answer}
            isLoading={isLoading}
            scrollToAnswer={scrollToAnswer}
          />
          <ChatInput
            question={question}
            setQuestion={setQuestion}
            handleAsk={() => handleAsk(false)} // Pass false for new questions
            isLoading={isLoading}
          />
        </div>
      </div>
      {/* Overlay for mobile when sidebar is open, closes sidebar on click */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true" 
        ></div>
      )}
    </>
  );
}

export default App;
