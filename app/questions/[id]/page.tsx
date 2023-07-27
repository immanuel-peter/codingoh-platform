import React from "react";

import { questions, Question } from "@/dummy/questions";

const getQuestion = (userId: string): Question | undefined => {
  return questions.find((question) => question.id === Number(userId));
};

const QuestionPage = ({ params }: { params: { id: string } }) => {
  const question = getQuestion(params.id);

  return <div>ID: {question?.id}</div>;
};

export default QuestionPage;
