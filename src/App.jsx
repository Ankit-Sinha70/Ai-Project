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

  const handleAsk = async (isFromHistory = false) => {
    const query = isFromHistory ? selectedHistory : question;

    if (!query.trim()) return;

    if (!isFromHistory && question) {
      const newHistory = [question, ...recentHistory.filter(h => h !== question).slice(0, 30)]; // Keep latest 20, prevent duplicates
      localStorage.setItem("history", JSON.stringify(newHistory));
      setRecentHistory(newHistory);
    }
    
    const currentQuestionText = query;
    const questionEntry = { type: "q", text: currentQuestionText };
    // Add Question immediately
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      let dataString = data.candidates[0].content.parts[0].text;
      dataString = dataString.split("* ").map((item) => item.trim()).filter(item => item);


      // Add Answer by finding the last question and updating the answer list
      // This might be complex if history items are re-asked.
      // The current structure from your code is to append Q, then append A.
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
      // Scroll after answer is loaded and DOM updated
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

  useEffect(() => {
    if (selectedHistory) {
      // When a history item is clicked, we want to ask it again.
      // We should clear the current input field.
      setQuestion(""); // Clear manual input
      handleAsk(true); // Pass a flag to indicate it's from history
      setSelectedHistory(""); // Reset after processing to allow re-clicks
    }
  }, [selectedHistory]); // Dependency on selectedHistory
  
  // Effect for initial load (optional, if you want to load last chat or something)
  // useEffect(() => {
  //   // Potentially load answers if they were persisted
  // }, []);


  return (
    <>
      <div className="grid md:grid-cols-5 h-screen text-white"> {/* Removed text-center */}
        <Sidebar
          recentHistory={recentHistory}
          setSelectedHistory={setSelectedHistory}
          handleDeleteHistory={handleDeleteHistory}
        />
        <div className="md:col-span-4 p-4 md:p-6 flex flex-col h-screen"> {/* Adjusted padding, h-screen for full height column */}
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
    </>
  );
}

export default App;
