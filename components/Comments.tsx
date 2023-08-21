"use client";

import React, { useState } from "react";
import Image from "next/image";

import { Contributor } from "@/types";
import Avatar from "@/public/avatar.png";
import { RenderMd } from ".";

interface Comment {
  id: number;
  text: string;
  replies?: NestedComment[];
}

interface NestedComment extends Comment {
  replies?: NestedComment[];
}

const Comment = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex justify-between items-end p-4 bg-white border rounded shadow mb-4">
      <RenderMd className="text-gray-800 basis-4/5" markdown={comment.text} />
      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
        <span>John Doe</span>
        <span>08-19-23</span>
      </div>
    </div>
  );
};

const NestedComments = ({ comments }: { comments: NestedComment[] }) => {
  return (
    <div className="ml-4 space-y-4">
      {comments.map((comment) => (
        <div key={comment.id}>
          <Comment comment={comment} />
          {comment.replies && comment.replies.length > 0 && (
            <NestedComments comments={comment.replies} />
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

const CommentsSection = () => {
  return (
    <div className="container mx-auto mt-4 px-4">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {commentsData.map((comment) => (
        <div key={comment.id}>
          <Comment comment={comment} />
          {comment.replies && comment.replies.length > 0 && (
            <NestedComments comments={comment.replies} />
          )}
        </div>
      ))}
    </div>
  );
};

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

  return (
    <>
      <main>
        <div className="mx-auto max-w-7xl">
          <div className="mt-4 flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold">Comments</h1>
            <div className="flex flex-row justify-between items-center">
              {contributors.length > 0 ? (
                <>
                  <span className="mr-2">Contributors</span>
                  <div className="flex -space-x-1 overflow-hidden">
                    {contributors.map((contributor) => (
                      <Image
                        key={contributor.user.id}
                        src={Avatar}
                        alt="contributor"
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                      />
                    ))}
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
              className="p-2 rounded-md bg-blue-400 hover:bg-blue-600 text-white"
              onClick={handleAddComment}
            >
              Add Comment
            </button>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl mt-8">
          {/* Comment section */}
          {postComments.length > 0 &&
            postComments.map((comment) => (
              <div key={comment.id}>
                <Comment comment={comment} />
                {comment.replies && comment.replies.length > 0 && (
                  <NestedComments comments={comment.replies} />
                )}
              </div>
            ))}
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
