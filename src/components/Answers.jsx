import React, { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStar } from "../helper";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
const Answers = ({ answer }) => {
  const [heading, setHeading] = useState(false);
  const [answerText, setAnswerText] = useState(answer);

  useEffect(() => {
    if (checkHeading(answer)) {
      setHeading(true);
      setAnswerText(replaceHeadingStar(answer));
    }
  }, []);

  //   function checkHeading(dataString) {
  //     const regex = /^(\*)(\*)(.*)\*$/;
  //     return regex.test(dataString);
  //   }

  const renderer = {
    code({ className, children, inline, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, "")}
          language={match[1]}
          style={dark}
          PreTag="div"
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div>
      {heading ? (
        <span className="text-lg font-bold">
          <ReactMarkdown components={renderer}>{answer}</ReactMarkdown>
        </span>
      ) : (
        <span className="text-sm ">{answerText}</span>
      )}
    </div>
  );
};

export default Answers;
