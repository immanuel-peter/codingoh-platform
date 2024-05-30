"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiFillHeart, AiOutlineCheck, AiFillMessage } from "react-icons/ai";
import { Badge } from "antd";
import { Avatar, AvatarGroup } from "@mui/joy";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Contributor, Comment as CommentType, Coder, Question } from "@/types";
import avatar from "@/public/avatar.png";
import { RenderMd } from ".";

interface NestedComment extends Comment {
  replies?: NestedComment[];
  level?: number;
}

const convertToNestedComments = (comments: CommentType[]) => {
  const commentMap = new Map();
  comments.forEach((comment) => {
    comment.replies = [];
    commentMap.set(comment.id, comment);
  });

  const nestedComments: CommentType[] = [];
  comments.forEach((comment) => {
    if (comment.parent_comment === null) {
      nestedComments.push(comment);
    } else {
      const parent = commentMap.get(comment.parent_comment);
      if (parent) {
        parent.replies.push(comment);
      }
    }
  });

  return nestedComments;
};

const Comment = ({
  comment,
  onAddNestedComment,
}: {
  comment: CommentType;
  onAddNestedComment: (text: string, parentId: number) => void;
}) => {
  const router = useRouter();
  const supabase = createClient();
  const [coder, setCoder] = useState<Coder>();

  const [isChecked, setIsChecked] = useState<boolean>(comment.is_answer);
  const [likeCount, setLikeCount] = useState({
    count: comment.likes,
    disabled: false,
  });
  const [openNewComment, setOpenNewComment] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState<string>("");

  useEffect(() => {
    const fetchCoder = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (user) {
          const { data: coderData, error: coderError } = await supabase
            .from("coders")
            .select("*")
            .eq("auth_id", user.id)
            .single();

          if (coderError) {
            console.log(coderError);
          } else {
            setCoder(coderData);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoder();
  }, []);

  const currentDate: Date = new Date(comment.created_at);
  const year: string = currentDate.getFullYear().toString().slice(-2);
  const month: string = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day: string = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate: string = `${month}-${day}-${year}`;

  const handleCheck = async () => {
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);

    try {
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .update({ is_answer: newIsChecked })
        .eq("id", comment.id)
        .select();

      if (commentError) {
        console.log("Error updating comment:", commentError);
      } else {
        console.log("Comment updating:", commentData);
      }

      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .update({ answer: newIsChecked })
        .eq("id", comment.question.id)
        .select();

      if (questionError) {
        console.log("Error editing question:", questionError);
      } else {
        console.log("Question updated:", questionData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLike = async () => {
    const newCount = likeCount.count + (likeCount.disabled ? -1 : 1);

    setLikeCount({
      count: newCount,
      disabled: !likeCount.disabled,
    });

    try {
      const { data, error } = await supabase
        .from("comments")
        .update({ likes: newCount })
        .eq("id", comment.id)
        .select();

      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    const dbCommentText = newCommentText;

    onAddNestedComment(newCommentText, comment.id);
    setNewCommentText("");
    setOpenNewComment(false);

    const newCommentData = {
      commenter: coder?.id,
      question: comment.question.id,
      text: dbCommentText,
      parent_comment: comment.id,
    };

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert(newCommentData)
        .select();

      const { data: contribution, error: contributionError } = await supabase
        .from("contributors")
        .insert({ question_id: comment.question.id, user_id: coder?.id })
        .select();
      if (contributionError) {
        console.error(contributionError);
      } else {
        console.log("Contribution added:", contribution);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className={`flex justify-between border rounded shadow mb-4 ${
          isChecked ? "bg-green-100" : "bg-white"
        }`}
      >
        <RenderMd
          className="text-gray-800 basis-4/5 grow-0 items-center p-4"
          markdown={comment.text}
        />
        <div className="flex flex-col justify-between gap-8 p-4">
          <div className="flex flex-row justify-center items-center gap-3 text-4xl">
            {coder?.id === comment.question.asker.id && (
              <AiOutlineCheck
                onClick={handleCheck}
                className={`text-green-500/50 hover:text-green-600 cursor-pointer ${
                  isChecked && "text-green-600"
                }`}
              />
            )}

            <Badge count={likeCount.count}>
              <AiFillHeart
                onClick={handleAddLike}
                className={`text-red-500/50 cursor-pointer ${
                  !likeCount.disabled ? "hover:text-red-600" : "text-red-600"
                } text-4xl`}
              />
            </Badge>

            <AiFillMessage
              onClick={() => setOpenNewComment(!openNewComment)}
              className="text-blue-400/50 hover:text-blue-500 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Link
              href={`/users/${comment.commenter.auth_id}`}
              className="hover:underline hover:text-blue-500 hover:cursor-pointer"
            >
              {comment.commenter.first_name} {comment.commenter.last_name}
            </Link>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      {openNewComment && (
        <div className="flex justify-end m-3">
          <div className="w-5/6 flex justify-between items-end">
            <textarea
              className="w-11/12 min-h-[100px] rounded-lg border-gray-200 border-solid border-[1px] align-top shadow-sm"
              placeholder="Add a reply..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className={`p-2 px-4 rounded-md bg-blue-400 text-white ${
                newCommentText != ""
                  ? "hover:bg-blue-600 cursor-pointer"
                  : "bg-opacity-75 cursor-text"
              }`}
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const NestedComments = ({
  comments,
  onAddNestedComment,
}: {
  comments: CommentType[];
  onAddNestedComment: (text: string, parentId: number) => void;
}) => {
  return (
    <div className="ml-4 space-y-4">
      {comments.map((comment) => (
        <div key={comment.id}>
          <Comment comment={comment} onAddNestedComment={onAddNestedComment} />
          {comment.replies && comment.replies.length > 0 && (
            <NestedComments
              comments={comment.replies}
              onAddNestedComment={onAddNestedComment}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const Comments = ({
  coder,
  question,
  contributors,
}: {
  coder: Coder;
  question: Question;
  contributors: Contributor[];
}) => {
  const supabase = createClient();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentId, setCommentId] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  // console.log(comments);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data: comments, error } = await supabase
          .from("comments")
          .select("*")
          .eq("question", question.id);

        if (comments) {
          let commenterIds = comments.map((comment) => comment.commenter);
          const { data: commenters, error: commentersError } = await supabase
            .from("coders")
            .select("*")
            .in("id", commenterIds);
          for (const comment of comments) {
            comment.commenter = commenters?.find(
              (coder) => coder.id === comment.commenter
            );
            comment.question = question;
            comment.replies = comments.filter(
              (reply) => reply.parent_comment === comment.id
            );
          }
          const nestedComments = convertToNestedComments(comments);
          setComments(nestedComments);
          setCommentId(Math.max(...comments.map((item) => item.id)) + 1);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    const dbValue = inputValue;

    setComments([
      ...comments,
      {
        id: commentId,
        created_at: new Date().toISOString(),
        commenter: coder,
        question: question,
        parent_comment: null,
        text: inputValue,
        is_answer: false,
        likes: 0,
        replies: [],
      },
    ]);
    setCommentId(commentId + 1);
    setInputValue("");

    const newCommentData = {
      commenter: coder.id,
      question: question.id,
      text: dbValue,
    };

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert(newCommentData)
        .select();

      if (error) {
        console.error("Error adding comment", error);
      } else {
        console.log("Comment added:", data);
      }

      const { data: contribution, error: contributionError } = await supabase
        .from("contributors")
        .insert({ question_id: question.id, user_id: coder?.id })
        .select();

      if (contributionError) {
        console.error(contributionError);
      } else {
        console.log("Contribution added:", contribution);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNestedComment = (text: string, parentId: number) => {
    // Find the parent comment or nested comment based on parentId
    const findComment = (comments: CommentType[]): CommentType | undefined => {
      for (const comment of comments) {
        if (comment.id === parentId) {
          return comment;
        }
        if (comment.replies) {
          const nestedComment = findComment(comment.replies);
          if (nestedComment) {
            return nestedComment;
          }
        }
      }
      return undefined;
    };

    const parentComment = findComment(comments);

    if (parentComment) {
      if (!parentComment.replies) {
        parentComment.replies = [];
      }

      const newNestedCommentData: CommentType = {
        id: parentId,
        commenter: coder,
        question: question,
        text: text,
        parent_comment: comments.filter(
          (comment) => comment.id === parentId
        )[0],
        created_at: new Date().toISOString(),
        is_answer: false,
        likes: 0,
      };

      parentComment.replies.push(newNestedCommentData);

      setComments([...comments]);
      setCommentId(commentId + 1);
    }
  };

  const renderComments = (comments: CommentType[], level: number) => {
    return comments.map((comment) => {
      // Set the level property for this comment
      comment.level = level;

      return (
        <div key={comment.id}>
          <Comment
            comment={comment}
            onAddNestedComment={handleAddNestedComment}
          />
          {comment.replies && comment.replies.length > 0 && (
            <div
              className={`ml-4 space-y-4 ${
                comment.level > 0 ? "border-l-2 pl-4" : ""
              }`}
            >
              {renderComments(comment.replies, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <main className="mb-20">
        <div className="container mx-auto max-w-7xl mb-8">
          {/* Comment section */}
          {comments.length > 0 &&
            comments.map((comment) => (
              <div key={comment.id}>
                <Comment
                  comment={comment}
                  onAddNestedComment={handleAddNestedComment}
                />
                {comment.replies && comment.replies.length > 0 && (
                  <NestedComments
                    comments={comment.replies}
                    onAddNestedComment={handleAddNestedComment}
                  />
                )}
              </div>
            ))}
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="mt-4 flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold">Comments</h1>
            <div className="flex flex-row justify-between items-center">
              {contributors.length > 0 ? (
                <>
                  <span className="mr-2">Contributors</span>
                  <div className="flex -space-x-1 overflow-hidden">
                    {contributors.length < 5 ? (
                      contributors.map((contributor) => (
                        <>
                          {contributor.user_id.profile_image ? (
                            <Image
                              key={contributor.user_id.id}
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${contributor.user_id.auth_id}`}
                              alt="contributor"
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                              height={24}
                              width={24}
                            />
                          ) : (
                            <Avatar sx={{ "--Avatar-size": "24px" }}>
                              {contributor.user_id.first_name[0]}
                              {contributor.user_id.last_name[0]}
                            </Avatar>
                          )}
                        </>
                      ))
                    ) : (
                      <div className="px-2 flex items-center">
                        {contributors.slice(0, 4).map((contributor) => (
                          <>
                            {contributor.user_id.profile_image ? (
                              <Image
                                key={contributor.user_id.id}
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${contributor.user_id.auth_id}`}
                                alt="contributor"
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                height={24}
                                width={24}
                              />
                            ) : (
                              <Avatar sx={{ "--Avatar-size": "24px" }}>
                                {contributor.user_id.first_name[0]}
                                {contributor.user_id.last_name[0]}
                              </Avatar>
                            )}
                          </>
                        ))}
                        <div
                          key={5}
                          className="flex h-7 w-7 rounded-full bg-slate-200 ring-2 ring-white items-center justify-center text-center text-xs"
                        >
                          +{contributors.length - 4}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <hr className="border-solid border-black border-[1px]" />
          <textarea
            id="comments"
            className="mt-2 mb-2 min-w-full min-h-[100px] rounded-lg border-gray-200 border-solid border-[1px] align-top shadow-sm"
            placeholder="Type your comment in Markdown..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="flex items-end justify-end">
            <button
              className={`p-2 rounded-md bg-blue-400 text-white ${
                inputValue != ""
                  ? "hover:bg-blue-600 cursor-pointer"
                  : "bg-opacity-75 cursor-text"
              }`}
              onClick={handleAddComment}
            >
              Add Comment
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Comments;
