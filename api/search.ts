import { questions, users } from "@/dummy/questions";
import { Proficiency, Question, User, Contributor } from "@/types";

export const rankSearchQuestions = async (question: string) => {
  const prompt = `
    Here is a user's question: ${question}
  
    Here are previously asked questions:
    ${questions.map((question) => question.question)}
  
    Your task is to rank which questions in order from most related to least related to the question above. Simply show the questions in the order specified, no extra words needed. Also, do not include the user's question in the ranking.
    `;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // Insert own OpenAI API key
      // Drop in API key in next.config.js
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: `${prompt}` }],
    }),
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    options
  );
  const data = await response.json();
  return data.choices[0].message.content;
};
