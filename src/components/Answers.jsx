import React, { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStar } from "../helper";
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

  return (
    <div>
      {heading ? (
        <span className="text-lg font-bold">{answer}</span>
      ) : (
        <span className="text-sm ">{answerText}</span>
      )}
    </div>
  );
};

export default Answers;
