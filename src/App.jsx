import { useState } from "react";
import "./App.css";
import { URL, API_KEY } from "./constant";
import { IoTrashBinSharp } from "react-icons/io5";
import Answers from "./components/Answers";
function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []);

  const handleAsk = async () => {
    if(!question) {
      return false;
    }
    if (localStorage.getItem("history")) {
      let history = JSON.parse(localStorage.getItem("history"));
      history = [question, ...history ];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    } else {
      localStorage.setItem("history", JSON.stringify([question]));
      setRecentHistory([question]);
    }

    if (!question.trim()) return;
    const currentQuestionText = question;

    const questionEntry = { type: "q", text: currentQuestionText };
    setAnswer((prevAnswers) => [questionEntry, ...prevAnswers]);
    setQuestion("");

    const payload = {
      contents: [
        {
          parts: [{ text: currentQuestionText }],
        },
      ],
    };
    try {
      const response = await fetch(`${URL}${API_KEY}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      let dataString = data.candidates[0].content.parts[0].text;
      dataString = dataString.split("* ");
      dataString = dataString.map((item) => item.trim());

      const answerEntry = { type: "a", text: dataString };

      setAnswer((prevAnswers) => {
        return [prevAnswers[0], answerEntry, ...prevAnswers.slice(1)];
      });
    } catch (error) {
      console.error("Error fetching answer:", error);
      const errorEntry = {
        type: "a",
        text: "Sorry, I couldn't get an answer. Please try again.",
      };
      setAnswer((prevAnswers) => {
        return [prevAnswers[0], errorEntry, ...prevAnswers.slice(1)];
      });
    }
  };
  console.log(answer);

  const handleDeleteHistory = (itemToDelete) => {
    const updatedHistory = recentHistory.filter(item => item !== itemToDelete);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setRecentHistory(updatedHistory);
  };

  return (
    <>
      <div className="grid md:grid-cols-5 h-screen text-white text-center">
        <div className="md:col-span-1 bg-zinc-800 md:h-screen overflow-y-auto hide-scrollbar">
          <div className="text-sm font-bold text-left p-4 flex flex-col md:max-w-xs h-full">
            <h1 className="text-lg font-bold text-white mb-4 text-center sticky top-0 bg-zinc-800 py-2">
              Recent History
            </h1>
            {recentHistory?.map((item, index) => {
              const displayText =
                item.length > 10 ? item.slice(0, 30) + "..." : item;
              return (
                <div
                  key={index}
                  className="flex justify-between items-center w-full mb-1"
                >
                  <li
                    className="text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md p-2 cursor-pointer truncate max-w-[calc(100%-2rem)] list-none"
                    title={item}
                  >
                    {displayText}
                  </li>
                  <button onClick={() => handleDeleteHistory(item)} className="text-zinc-400 hover:text-red-500">
                    <IoTrashBinSharp />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-4 p-4 md:p-10 flex flex-col h-full">
          <div className="container flex-grow overflow-y-auto border border-zinc-700 rounded-2xl p-4 mb-4 md:mb-10 bg-zinc-800 hide-scrollbar">
            <div className="text-zinc-300">
              {answer &&
                answer.map((item, index) => (
                  <div
                    key={index}
                    className={`flex mb-2 ${
                      item.type === "q" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {item.type === "q" ? (
                      <div className="bg-zinc-700 text-white p-3 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl max-w-xs sm:max-w-md text-right shadow-md">
                        {item.text}
                      </div>
                    ) : (
                      <div className="text-white p-3 rounded-xl text-left shadow-md max-w-xs sm:max-w-md">
                        {Array.isArray(item.text) ? (
                          item.text.map((line, i) => (
                            <p key={i} className="break-words">
                              {line}
                            </p>
                          ))
                        ) : (
                          <p className="break-words">{item.text}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-zinc-800 w-full md:w-3/4 lg:w-1/2 text-white m-auto p-1 pr-5 rounded-4xl border border-zinc-700 flex mt-auto">
            <input
              type="text"
              className="w-full h-full p-3 outline-none bg-transparent"
              placeholder="Ask me anything"
              value={question}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAsk();
                }
              }}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={() => handleAsk()}>Ask</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
