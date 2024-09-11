"use client";

import React, { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import {
  AiFillHeart,
  AiOutlineCheck,
  AiFillMessage,
  AiFillDelete,
  AiFillEdit,
} from "react-icons/ai";
import { Badge, message, Avatar } from "antd";
import { Transition, Dialog } from "@headlessui/react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Contributor, Comment as CommentType, Coder, Question } from "@/types";
import avatar from "@/public/avatar.png";
import { RenderMd, TiptapRender, AddComment } from ".";
import { JSONContent } from "@tiptap/react";

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
  onDeleteComment,
}: {
  comment: CommentType;
  onAddNestedComment: (json: JSONContent, parentId: number) => void;
  onDeleteComment: (commentId: number) => void;
}) => {
  const router = useRouter();
  const supabase = createClient();
  const [coder, setCoder] = useState<Coder>();

  const [isChecked, setIsChecked] = useState<boolean>(
    comment.is_answer ?? false
  );
  const [likeCount, setLikeCount] = useState({
    count: comment.likes,
    disabled: false,
  });
  const [openNewComment, setOpenNewComment] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [deleteCommentOpen, setDeleteCommentOpen] = useState<boolean>(false);
  const [editCommentOpen, setEditCommentOpen] = useState<boolean>(false);
  const [editCommentText, setEditCommentText] = useState<string>(
    comment.text ?? ""
  );
  const [json, setJson] = useState<JSONContent>({});
  const [editCommentJson, setEditCommentJson] = useState<JSONContent>(
    comment.comment_json ?? {}
  );
  const [messageApi, contextHolder] = message.useMessage();

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

  const currentDate: Date = comment.created_at
    ? new Date(comment.created_at)
    : new Date();
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
        .eq("id", comment.question?.id)
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
    const newCount = (likeCount.count ?? 0) + (likeCount.disabled ? -1 : 1);

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

    onAddNestedComment(json, comment.id ?? 0);
    setNewCommentText("");
    setOpenNewComment(false);

    const newCommentData = {
      commenter: coder?.id,
      question: comment.question?.id,
      parent_comment: comment.id,
      comment_json: json,
    };

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert(newCommentData)
        .select();
      if (data) {
        messageApi.open({
          type: "success",
          content: "Successfully added comment",
          duration: 3,
        });
        const { data: d, error: e } = await supabase
          .from("notifications")
          .insert({
            event: "new_comment",
            coder_ref: coder?.id,
            question_ref: comment.question?.id,
            comment_ref: data[0].id,
          })
          .select();
        if (d) {
          console.log(d);
        } else {
          console.error(e);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .delete()
        .eq("id", comment.id)
        .select();

      if (commentError) {
        console.log("Error deleting comment:", commentError);
        messageApi.open({
          type: "error",
          content: "Error deleting comment",
          duration: 3,
        });
        return;
      } else {
        console.log("Comment deleted:", commentData);
        messageApi.open({
          type: "success",
          content: "Successfully deleted comment",
          duration: 3,
        });
        onDeleteComment(comment.id ?? 0);
        setDeleteCommentOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditComment = async () => {
    comment.comment_json = editCommentJson;

    try {
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .update({ comment_json: editCommentJson })
        .eq("id", comment.id)
        .select();

      if (commentError) {
        console.log("Error editing comment:", commentError);
        messageApi.open({
          type: "error",
          content: "Error editing comment",
          duration: 3,
        });
        return;
      } else {
        console.log("Comment edited:", commentData);
        messageApi.open({
          type: "success",
          content: "Successfully edited comment",
          duration: 3,
        });
        setEditCommentOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        className={`flex flex-col border rounded shadow mb-4 ${
          isChecked ? "bg-green-100" : "bg-white"
        }`}
      >
        <TiptapRender
          renderContent={comment.comment_json}
          style="text-gray-800 items-center p-4"
        />
        <div className="flex flex-row items-end justify-between gap-8 p-4">
          <div className="flex flex-row justify-center items-center gap-3 text-3xl">
            {coder?.id === comment.question?.asker?.id && (
              <AiOutlineCheck
                onClick={handleCheck}
                className={`text-green-500/50 hover:text-green-600 cursor-pointer ${
                  isChecked && "text-green-600"
                }`}
              />
            )}

            <Badge count={likeCount.count} size="small">
              <AiFillHeart
                onClick={handleAddLike}
                className={`text-red-500/50 cursor-pointer ${
                  !likeCount.disabled ? "hover:text-red-600" : "text-red-600"
                } text-3xl`}
              />
            </Badge>

            <AiFillMessage
              onClick={() => setOpenNewComment(!openNewComment)}
              className="text-blue-400/50 hover:text-blue-500 cursor-pointer"
            />

            {coder?.id === comment.commenter?.id && (
              <AiFillDelete
                onClick={() => setDeleteCommentOpen(true)}
                className="text-red-500/50 hover:text-red-500 cursor-pointer"
              />
            )}

            {coder?.id === comment.commenter?.id && (
              <AiFillEdit
                onClick={() => setEditCommentOpen(true)}
                className="text-blue-400/50 hover:text-blue-500 cursor-pointer"
              />
            )}
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Link
              href={`/users/${comment.commenter?.auth_id}`}
              className="hover:underline hover:text-blue-500 hover:cursor-pointer"
            >
              {comment.commenter?.first_name} {comment.commenter?.last_name}
            </Link>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      {openNewComment && (
        <AddComment
          type="nested"
          handleCommentClick={handleAddComment}
          onJsonChange={(Json) => setJson(Json)}
        />
      )}

      <Transition appear show={deleteCommentOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setDeleteCommentOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-black items-center justify-center"
                  >
                    Are you sure you want to delete your comment?
                  </Dialog.Title>
                  <div className="flex flex-row items-center justify-center gap-4 mt-3">
                    <div
                      onClick={() => setDeleteCommentOpen(false)}
                      className="cursor-pointer rounded-full border border-solid bg-slate-200 px-4 py-2 text-base font-medium text-black hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </div>
                    <div
                      onClick={handleDeleteComment}
                      className="cursor-pointer rounded-full border border-solid bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
                    >
                      Delete
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={editCommentOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setEditCommentOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-blue-600 inline-flex items-center gap-2"
                  >
                    Edit Your Comment <AiFillEdit />
                  </Dialog.Title>
                  {/* <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="mt-3 rounded-lg w-full"
                  />
                  <div
                    onClick={handleEditComment}
                    className="cursor-pointer w-fit rounded-lg border border-solid bg-blue-500 px-4 py-2 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    Edit Comment
                  </div> */}
                  <AddComment
                    type="edit"
                    handleCommentClick={handleEditComment}
                    onJsonChange={(Json) => setEditCommentJson(Json)}
                    renderCommentJson={editCommentJson}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const NestedComments = ({
  comments,
  onAddNestedComment,
  onDeleteComment,
}: {
  comments: CommentType[];
  onAddNestedComment: (json: JSONContent, parentId: number) => void;
  onDeleteComment: (commentId: number) => void;
}) => {
  return (
    <div className="ml-4 space-y-4">
      {comments.map((comment) => (
        <div key={comment.id}>
          <Comment
            comment={comment}
            onAddNestedComment={onAddNestedComment}
            onDeleteComment={onDeleteComment}
          />
          {comment.replies && comment.replies.length > 0 && (
            <NestedComments
              comments={comment.replies}
              onAddNestedComment={onAddNestedComment}
              onDeleteComment={onDeleteComment}
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
  const [json, setJson] = useState<JSONContent>({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data: comments, error } = await supabase
          .from("comments")
          .select("*")
          .eq("question", question.id)
          .order("created_at", { ascending: true });

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
    setComments([
      ...comments,
      {
        id: commentId,
        created_at: new Date().toISOString(),
        commenter: coder,
        question: question,
        parent_comment: null,
        is_answer: false,
        likes: 0,
        replies: [],
        comment_json: json,
      },
    ]);
    setCommentId(commentId + 1);
    setInputValue("");
    setJson({});

    const newCommentData = {
      _commenter: coder.id,
      _question: question.id,
      _comment_json: json,
    };

    try {
      const { error } = await supabase.rpc(
        "add_comment_and_notify",
        newCommentData
      );

      if (error) {
        console.error("Error adding comment and sending notifications", error);
        message.open({
          type: "error",
          content: "Error adding comment",
          duration: 3,
        });
      } else {
        console.log("Comment added and notifications sent successfully.");
        message.open({
          type: "success",
          content: "Comment added successfully",
          duration: 3,
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleAddAnswer = async () => {
    setComments([
      ...comments,
      {
        id: commentId,
        created_at: new Date().toISOString(),
        commenter: coder,
        question: question,
        parent_comment: null,
        is_answer: true,
        likes: 0,
        replies: [],
        comment_json: json,
      },
    ]);
    setCommentId(commentId + 1);
    setInputValue("");
    setJson({});

    const newCommentData = {
      _commenter: coder.id,
      _question: question.id,
      _comment_json: json,
    };

    try {
      const { error } = await supabase.rpc(
        "add_answer_and_notify",
        newCommentData
      );

      if (error) {
        console.error("Error adding answer and sending notifications", error);
        message.open({
          type: "error",
          content: "Error adding answer",
          duration: 3,
        });
      } else {
        console.log("Answer added and notifications sent successfully.");
        message.open({
          type: "success",
          content: "Answer added successfully",
          duration: 3,
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleAddNestedComment = (json: JSONContent, parentId: number) => {
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
        comment_json: json,
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

  const handleDeleteComment = (commentId: number) => {
    const deleteComment = (
      comments: CommentType[],
      commentId: number
    ): CommentType[] => {
      return comments
        .filter((comment) => comment.id !== commentId)
        .map((comment) => ({
          ...comment,
          replies: deleteComment(comment.replies || [], commentId),
        }));
    };
    setComments(deleteComment(comments, commentId));
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
            onDeleteComment={handleDeleteComment}
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
                  onDeleteComment={handleDeleteComment}
                />
                {comment.replies && comment.replies.length > 0 && (
                  <NestedComments
                    comments={comment.replies}
                    onAddNestedComment={handleAddNestedComment}
                    onDeleteComment={handleDeleteComment}
                  />
                )}
              </div>
            ))}
        </div>

        {coder && (
          <>
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
                              {contributor.user_id?.profile_image ? (
                                <Image
                                  key={contributor.user_id?.id}
                                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${contributor.user_id.auth_id}`}
                                  alt="contributor"
                                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                  height={24}
                                  width={24}
                                />
                              ) : (
                                <Avatar size={24}>
                                  {contributor.user_id?.first_name
                                    ? contributor.user_id.first_name[0]
                                    : ""}
                                  {contributor.user_id?.last_name
                                    ? contributor.user_id.last_name[0]
                                    : ""}
                                </Avatar>
                              )}
                            </>
                          ))
                        ) : (
                          <div className="px-2 flex items-center">
                            {contributors.slice(0, 4).map((contributor) => (
                              <>
                                {contributor.user_id?.profile_image ? (
                                  <Image
                                    key={contributor.user_id?.id}
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${contributor.user_id.auth_id}`}
                                    alt="contributor"
                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                    height={24}
                                    width={24}
                                  />
                                ) : (
                                  <Avatar size={24}>
                                    {contributor.user_id?.first_name
                                      ? contributor.user_id.first_name[0]
                                      : ""}
                                    {contributor.user_id?.last_name
                                      ? contributor.user_id.last_name[0]
                                      : ""}
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
              <AddComment
                type="parent"
                handleCommentClick={handleAddComment}
                onJsonChange={(Json) => setJson(Json)}
                handleAnswerClick={handleAddAnswer}
                canAnswer={coder.id === question.asker?.id}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Comments;
