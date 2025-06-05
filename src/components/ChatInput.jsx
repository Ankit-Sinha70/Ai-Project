import React from "react";

function ChatInput({ question, setQuestion, handleAsk, isLoading }) {
  return (
    <div className="dark:bg-zinc-800 w-full md:w-3/4 lg:w-1/2 dark:text-white text-zinc-900  m-auto p-1 pr-5 rounded-4xl border border-zinc-700 flex mt-auto">
      <input
        type="text"
        className="w-full h-full p-3 outline-none bg-transparent"
        placeholder="Ask me anything"
        value={question}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isLoading) {
            handleAsk();
          }
        }}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={isLoading}
      />
      <button onClick={() => !isLoading && handleAsk()} disabled={isLoading}>
        {isLoading ? "Thinking..." : "Ask"}
      </button>
    </div>
  );
}

export default ChatInput;
