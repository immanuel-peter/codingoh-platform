import { createClient } from "@/utils/supabase/client";
import { cosineSimilarity } from "@/utils";

const supabase = createClient();

export const semanticSearch = async (query: string) => {
  // Retrieve all questions from the database
  const { data: allQuestions, error } = await supabase
    .from("questions")
    .select("id, created_at, asker, question, embedding");

  if (error) {
    throw error;
  }

  let updatedQuestions: any[] = [];
  if (allQuestions) {
    const askerIds = allQuestions.map((question) => question.asker);
    const { data: coders, error: codersError } = await supabase
      .from("coders")
      .select("id, first_name, last_name, auth_id")
      .in("id", askerIds);
    if (codersError) {
      throw codersError;
    }
    allQuestions.forEach((question) => {
      const asker = coders.find((coder) => coder.id === question.asker);
      if (asker) {
        question.asker = asker;
      }
    });

    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select("question, commenter");
    if (commentsError) {
      throw commentsError;
    }
    updatedQuestions = allQuestions.map((question) => {
      const asker = coders.find((coder) => coder.id === question.asker);
      // Get unique contributors for this question
      const contributorSet = new Set();
      comments
        .filter((comment) => comment.question === question.id)
        .forEach((comment) => {
          const contributorJson = JSON.stringify({
            user_id: coders.find((coder) => coder.id === comment.commenter),
            question_id: question,
          });
          contributorSet.add(contributorJson);
        });

      // Convert the set back to an array of unique contributors
      const contributors = Array.from(contributorSet).map((contributorJson) =>
        JSON.parse(contributorJson as string)
      );

      return {
        ...question,
        contributors,
      };
    });
  }

  // // Compute query embedding
  // const queryEmbeddingResponse = await openai.embeddings.create({
  //   input: query,
  //   model: "text-embedding-3-small",
  //   dimensions: 512,
  // });
  // const queryEmbedding = queryEmbeddingResponse.data[0].embedding;

  // // Calculate similarities and append them to allQuestions
  // updatedQuestions.forEach((question) => {
  //   const embedding = JSON.parse(question.embedding);
  //   const similarity = cosineSimilarity(queryEmbedding, embedding);
  //   question.similarity = similarity;
  // });

  // // Sort allQuestions based on similarity scores
  // const sortedQuestions = updatedQuestions.sort(
  //   (a, b) => b.similarity - a.similarity
  // );

  // return sortedQuestions;

  // Compute query embedding using Fetch API
  const queryEmbeddingResponse = await fetch(
    "https://api.openai.com/v1/embeddings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: query,
        model: "text-embedding-3-small",
        dimensions: 512,
      }),
    }
  );

  if (!queryEmbeddingResponse.ok) {
    const errorDetails = await queryEmbeddingResponse.json();
    throw new Error(
      `API request failed with status ${queryEmbeddingResponse.status}: ${errorDetails.message}`
    );
  }

  const queryEmbeddingData = await queryEmbeddingResponse.json();
  const queryEmbedding = queryEmbeddingData.data[0].embedding;

  // Calculate similarities and append them to allQuestions
  updatedQuestions.forEach((question) => {
    const embedding = JSON.parse(question.embedding);
    const similarity = cosineSimilarity(queryEmbedding, embedding);
    question.similarity = similarity;
  });

  // Sort allQuestions based on similarity scores
  const sortedQuestions = updatedQuestions.sort(
    (a, b) => b.similarity - a.similarity
  );

  return sortedQuestions;
};
