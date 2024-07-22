import { createClient } from "@/utils/supabase/client";
import { cosineSimilarity } from "@/utils";
import { Coder, Contributor, Question } from "@/types";

const supabase = createClient();

export const semanticSearch = async (query: string) => {
  // Retrieve all questions from the database
  const { data: allQuestions, error } = await supabase
    .from("questions")
    .select(
      `id, created_at, asker (id, first_name, last_name, auth_id), question, answer, embedding, contributors: comments(user_id: commenter(id, first_name, last_name, profile_image, auth_id))`
    );

  if (error) {
    throw error;
  }

  let updatedQuestions: Question[] = [];
  if (allQuestions) {
    updatedQuestions = allQuestions.map((q) => {
      const {
        id,
        created_at,
        asker,
        question,
        answer,
        embedding,
        contributors,
      } = q;

      let updatedAsker: Coder = {
        id: asker.id as number,
        first_name: asker.first_name as string,
        last_name: asker.last_name as string,
      };

      // Map the comments to contributors
      const updatedContributors: Contributor[] = contributors.map((c) => ({
        ...c,
        user_id: {
          id: c.user_id.id as number,
          first_name: c.user_id.first_name as string,
          last_name: c.user_id.last_name as string,
          profile_image: c.user_id.profile_image as boolean,
          auth_id: c.user_id.auth_id as string,
        },
      }));

      const uniqueContributors = (
        contributors: Contributor[]
      ): Contributor[] => {
        // Create a map to store unique contributors by auth_id
        const uniqueMap = new Map();

        // Iterate through the contributors array
        contributors.forEach((contributor) => {
          const authId = contributor.user_id?.auth_id;
          // If the auth_id is not already in the map, add it
          if (!uniqueMap.has(authId)) {
            uniqueMap.set(authId, contributor);
          }
        });

        // Convert the map values to an array
        return Array.from(uniqueMap.values());
      };

      // Return the transformed object
      return {
        id: id as number,
        created_at: created_at as string,
        asker: updatedAsker,
        question: question as string,
        answer: answer as boolean,
        embedding: embedding as string,
        contributors: uniqueContributors(updatedContributors),
      };
    });

    // const askerIds = allQuestions.map((question) => question.asker);
    // const { data: coders, error: codersError } = await supabase
    //   .from("coders")
    //   .select("id, first_name, last_name, auth_id")
    //   .in("id", askerIds);
    // if (codersError) {
    //   throw codersError;
    // }
    // allQuestions.forEach((question) => {
    //   const asker = coders.find((coder) => coder.id === question.asker);
    //   if (asker) {
    //     question.asker = asker;
    //   }
    // });

    // const { data: comments, error: commentsError } = await supabase
    //   .from("comments")
    //   .select("question, commenter");
    // if (commentsError) {
    //   throw commentsError;
    // }
    // updatedQuestions = allQuestions.map((question) => {
    //   const asker = coders.find((coder) => coder.id === question.asker);
    //   // Get unique contributors for this question
    //   const contributorSet = new Set();
    //   comments
    //     .filter((comment) => comment.question === question.id)
    //     .forEach((comment) => {
    //       const contributorJson = JSON.stringify({
    //         user_id: coders.find((coder) => coder.id === comment.commenter),
    //         question_id: question,
    //       });
    //       contributorSet.add(contributorJson);
    //     });

    //   // Convert the set back to an array of unique contributors
    //   const contributors = Array.from(contributorSet).map((contributorJson) =>
    //     JSON.parse(contributorJson as string)
    //   );

    //   return {
    //     ...question,
    //     contributors,
    //   };
    // });
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
    const embedding = JSON.parse(question.embedding ?? "");
    const similarity = cosineSimilarity(queryEmbedding, embedding);
    question.similarity = similarity;
  });

  // Sort allQuestions based on similarity scores
  const sortedQuestions = updatedQuestions.sort(
    (a, b) => (b.similarity ?? 0) - (a.similarity ?? 0)
  );

  return sortedQuestions;
};
