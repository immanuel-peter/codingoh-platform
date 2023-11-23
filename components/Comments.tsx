"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AiFillHeart, AiOutlineCheck, AiFillMessage } from "react-icons/ai";
import { Badge } from "antd";
import { Avatar, AvatarGroup } from "@mui/joy";

import { Contributor } from "@/types";
import avatar from "@/public/avatar.png";
import { RenderMd } from ".";

interface Comment {
  id: number;
  text: string;
  replies?: NestedComment[];
  level?: number;
}

interface NestedComment extends Comment {
  replies?: NestedComment[];
  level?: number;
}

const Comment = ({
  comment,
  onAddNestedComment,
}: {
  comment: Comment;
  onAddNestedComment: (text: string, parentId: number) => void;
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [likeCount, setLikeCount] = useState({ count: 0, disabled: false });
  const originalLikeCount = 1;
  const [openNewComment, setOpenNewComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddLike = () => {
    likeCount.count < originalLikeCount
      ? setLikeCount({
          ...likeCount,
          count: likeCount.count + 1,
          disabled: true,
        })
      : setLikeCount({
          ...likeCount,
          count: likeCount.count - 1,
          disabled: false,
        });
  };

  const handleAddComment = () => {
    onAddNestedComment(newCommentText, comment.id);
    setNewCommentText("");
    setOpenNewComment(false);
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${month}-${day}-${year}`;

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
          <div className="flex flex-row justify-between items-center text-4xl">
            <AiOutlineCheck
              onClick={() => setIsChecked(!isChecked)}
              className={`text-green-500/50 hover:text-green-600 cursor-pointer ${
                isChecked && "text-green-600"
              }`}
            />

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
            <span>John Doe</span>
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
  comments: NestedComment[];
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

const commentsData = [
  {
    id: 1,
    text: "This is the first comment.",
    replies: [
      {
        id: 2,
        text: "Reply to the first comment.",
      },
      {
        id: 3,
        text: "Another reply to the first comment.",
        replies: [
          {
            id: 4,
            text: "Nested reply to the first comment.",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    text: "This is the second comment.",
  },
];

// const CommentsSection = () => {
//   return (
//     <div className="container mx-auto mt-4 px-4">
//       <h2 className="text-2xl font-bold mb-4">Comments</h2>
//       {commentsData.map((comment) => (
//         <div key={comment.id}>
//           <Comment comment={comment} />
//           {comment.replies && comment.replies.length > 0 && (
//             <NestedComments comments={comment.replies} />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

const Comments = ({ contributors }: { contributors: Contributor[] }) => {
  const [commentId, setCommentId] = useState<number>(0);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddComment = () => {
    setPostComments([
      ...postComments,
      {
        id: commentId,
        text: inputValue,
        replies: [],
      },
    ]);
    setCommentId(commentId + 1);
    setInputValue("");
  };

  const handleAddNestedComment = (text: string, parentId: number) => {
    // Find the parent comment or nested comment based on parentId
    const findComment = (comments: Comment[]): Comment | undefined => {
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

    const parentComment = findComment(postComments);

    if (parentComment) {
      if (!parentComment.replies) {
        parentComment.replies = [];
      }

      const newNestedComment: Comment = {
        id: commentId,
        text: text,
        replies: [],
      };

      parentComment.replies.push(newNestedComment);

      setPostComments([...postComments]);
      setCommentId(commentId + 1);
    }
  };

  const renderComments = (comments: Comment[], level: number) => {
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
          {postComments.length > 0 &&
            postComments.map((comment) => (
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
                        <Image
                          key={contributor.user.id}
                          src={avatar}
                          alt="contributor"
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        />
                      ))
                    ) : (
                      <div className="px-2 flex items-center">
                        <Image
                          key={1}
                          src={avatar}
                          alt="contributor"
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                        />
                        <Image
                          key={2}
                          src={avatar}
                          alt="contributor"
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                        />
                        <Image
                          key={3}
                          src={avatar}
                          alt="contributor"
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                        />
                        <Image
                          key={4}
                          src={avatar}
                          alt="contributor"
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                        />
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

/*

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}

.container {
  max-width: 1200px;
  width: calc(100vw - 4rem);
  margin: 2rem auto;
}

button {
  font-size: inherit;
  font-family: inherit;
}

.error-msg {
  color: hsl(0, 100%, 67%);
}

.comments-title {
  margin-bottom: .5rem;
}

.comment-form-row {
  display: flex;
  gap: .5rem;
}

.message-input {
  flex-grow: 1;
  resize: none;
  height: 70px;
  border-radius: .5em;
  padding: .5em;
  font-size: inherit;
  font-family: inherit;
  border: 2px solid hsl(235, 50%, 74%);
  line-height: 1.4;
}

.message-input:focus {
  border-color: hsl(235, 100%, 67%);
  outline: none;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-1 {
  margin-top: .25rem;
}

.comment-stack {
  margin: .5rem 0;
}

.comment-stack:last-child {
  margin-bottom: 0;
}

.nested-comments {
  padding-left: .5rem;
  flex-grow: 1;
}

.nested-comments-stack {
  display: flex;
}

.collapse-line {
  border: none;
  background: none;
  padding: 0;
  width: 15px;
  margin-top: .5rem;
  position: relative;
  cursor: pointer;
  outline: none;
  transform: translateX(-50%);
}

.collapse-line:hover::before,
.collapse-line:focus-visible::before {
  background-color: hsl(235, 100%, 60%);
}

.collapse-line::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background-color: hsl(235, 50%, 74%);
  transition: background-color 100ms ease-in-out;
}

.hide {
  display: none;
}

.btn {
  --hue: 235;
  --color: hsl(var(--hue), 100%, 67%);
  padding: .5em 1em;
  background: var(--color);
  border: none;
  color: white;
  border-radius: .5em;
  font-size: .75em;
  cursor: pointer;
}

.btn:hover,
.btn:focus-visible {
  --color: hsl(var(--hue), 100%, 74%);
}

.btn.icon-btn {
  background: none;
  color: var(--color);
  padding: .25em;
  display: flex;
  align-items: center;
}

.mr-1 {
  margin-right: .25em;
}

.icon-btn:hover,
.icon-btn:focus-visible {
  --color: hsl(var(--hue), 100%, 74%);
}

.icon-btn-active,
.icon-btn.danger {
  --hue: 0;
}

.icon-btn-active {
  position: relative;
}

.icon-btn-active::before {
  content: "\00D7";
  position: absolute;
  font-size: .75em;
  width: 1em;
  height: 1em;
  color: white;
  background-color: var(--color);
  border-radius: 50%;
  bottom: .1em;
  right: .1em;
}

.comment {
  padding: .5rem;
  border: 1px solid hsl(235, 100%, 90%);
  border-radius: .5rem;
}

.comment .header {
  color: hsl(235, 50%, 67%);
  display: flex;
  justify-content: space-between;
  margin-bottom: .25rem;
  font-size: .75em;
}

.comment .header .name {
  font-weight: bold;
}

.comment .message {
  white-space: pre-wrap;
  margin-left: .5rem;
  margin-right: .5rem;
}

.comment .footer {
  display: flex;
  gap: .5rem;
  margin-top: .5rem;
}

.ml-3 {
  margin-left: 1.5rem;
}

.btn[disabled] {
  --color: hsl(var(--hue), 20%, 74%);
}

*/
