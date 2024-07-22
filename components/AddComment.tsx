"use client";

import React, { useState } from "react";
import Image from "next/image";

import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";

import { Tooltip, Input, Button, Divider } from "antd";

import {
  FaCode,
  FaLink,
  FaLinkSlash,
  FaImage,
  FaCamera,
  FaFileCode,
  FaCheck,
} from "react-icons/fa6";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
  AiOutlineStrikethrough,
  AiOutlineHighlight,
} from "react-icons/ai";
import {
  TbClearFormatting,
  TbBlockquote,
  TbSubscript,
  TbSuperscript,
} from "react-icons/tb";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";
import { HiOutlineListBullet } from "react-icons/hi2";
import { GoListOrdered } from "react-icons/go";
import { IoColorPalette } from "react-icons/io5";

const NestedCommentInput = ({
  handleCommentClick,
  onJsonChange,
}: {
  handleCommentClick: () => void;
  onJsonChange: (json: JSONContent) => void;
}) => {
  const [jsonContent, setJsonContent] = useState<JSONContent>({});
  console.log(jsonContent);

  const tiptapExtensions = [
    StarterKit.configure({
      codeBlock: false,
    }),
    Color,
    ListItem,
    TextStyle,
    Underline,
    CodeBlockLowlight.configure({
      lowlight: createLowlight(common),
      HTMLAttributes: {
        class: "bg-slate-300 p-2 rounded-md",
      },
    }),
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: "p-1 rounded-lg",
      },
    }),
    Subscript,
    Superscript,
    Link.configure({
      openOnClick: true,
    }),
    TiptapImage.configure({
      allowBase64: true,
    }),
    Typography,
    Placeholder.configure({
      placeholder: "Add your reply...",
    }),
  ];

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: "",
    onUpdate: ({ editor }) => {
      // Call onJsonChange when editor content updates
      const json: JSONContent = editor.getJSON();
      setJsonContent(json); // Update state with JSON content
      if (onJsonChange) {
        onJsonChange(json); // Call prop function with JSON content
      }
    },
  });

  if (!editor) {
    return null;
  }

  editor.setOptions({
    editorProps: {
      attributes: {
        class:
          "w-full h-[100px] overflow-y-auto p-2 text-sm border border-solid border-gray-200 rounded-b-md",
      },
    },
  });

  const ColorInput = () => {
    return (
      <div className="flex flex-row items-center justify-center gap-2">
        <div
          onClick={() => editor.chain().focus().setColor("#000").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-black cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#000" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#ef4444").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-red-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#ef4444" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#ea580c").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-orange-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#ea580c" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#eab308").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-yellow-500 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#eab308" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#16a34a").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-green-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#16a34a" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#2563eb").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-blue-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#2563eb" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#8b5cf6").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-purple-500 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#8b5cf6" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
      </div>
    );
  };

  const HighlightInput = () => {
    return (
      <div className="flex flex-row items-center justify-center gap-2">
        <button
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-white cursor-pointer"
        >
          {!editor.isActive("highlight") ? <FaCheck className="p-1" /> : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ffcc00" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-[#ffcc00] cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#ffcc00" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ef4444" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-red-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#ef4444" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#3b82f6" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-blue-500 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#3b82f6" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#16a34a" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-green-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#16a34a" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ea580c" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-orange-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#ea580c" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#9333ea" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-purple-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#9333ea" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
      </div>
    );
  };

  const LinkInput = () => {
    const [link, setLink] = useState(
      editor.getAttributes("link").href?.replace(/^https?:\/\//, "") ?? ""
    );

    const onLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLink(e.target.value);
    };

    const handleSetLink = () => {
      // cancelled
      if (link === null) {
        return;
      }

      // empty
      if (link === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: `https://${link}` })
        .run();
    };

    return (
      <>
        <Input
          autoFocus
          addonBefore="https://"
          placeholder="www.github.com"
          value={link}
          onChange={onLinkChange}
          className="mb-2 border border-solid border-slate-500 rounded-md"
        />
        <Button
          onClick={handleSetLink}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Set Link
        </Button>
      </>
    );
  };

  const ImageInput = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageLink, setImageLink] = useState<string>("");

    const onImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setImageLink(e.target.value);
    };

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        let img = event.target.files[0];
        setImage(img);
      }
    };

    const addImageLink = () => {
      editor.chain().focus().setImage({ src: imageLink }).run();
    };

    const addImage = () => {
      if (image === null) {
        return;
      }

      if (image instanceof File) {
        editor
          .chain()
          .focus()
          .setImage({ src: URL.createObjectURL(image) })
          .run();
      }
    };

    return (
      <>
        {image === null ? (
          <div>
            <div className="text-center p-6 border border-dashed border-slate-700 rounded-lg">
              <FaCamera
                className="mx-auto mb-1 h-12 w-12 text-black"
                aria-hidden="true"
              />
              <div className="flex items-center text-xs leading-6 text-black">
                <label
                  htmlFor="file-upload"
                  className="px-1 relative cursor-pointer rounded-full bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    value={image ? URL.createObjectURL(image) : ""}
                    onChange={onImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            <Divider className="my-1">or</Divider>
            <Input
              autoFocus
              variant="filled"
              placeholder="link to image file"
              value={imageLink}
              onChange={onImageLinkChange}
              className="border border-solid border-slate-500 rounded-md"
            />
            <Button
              onClick={addImageLink}
              className="mt-2 w-full bg-blue-500 hover:bg-blue-600"
            >
              Add Image
            </Button>
          </div>
        ) : image instanceof File ? (
          <Image
            src={image ? URL.createObjectURL(image) : ""}
            width={424}
            height={172}
            alt="Picture"
            className="w-full h-full mb-2"
          />
        ) : (
          <Image
            src={image}
            width={424}
            height={172}
            alt="Picture"
            className="w-full h-full mb-2"
          />
        )}
        {image instanceof File && (
          <Button
            onClick={addImage}
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600"
          >
            Add Image
          </Button>
        )}
      </>
    );
  };

  const handleBoldClick = () => editor.chain().focus().toggleBold().run();
  const handleItalicClick = () => editor.chain().focus().toggleItalic().run();
  const handleUnderlineClick = () =>
    editor.chain().focus().toggleUnderline().run();
  const handleStrikethroughClick = () =>
    editor.chain().focus().toggleStrike().run();
  const handleClearFormatting = () =>
    editor.chain().focus().unsetAllMarks().run();
  const handleCodeClick = () => editor.chain().focus().toggleCode().run();
  const handleCodeblockClick = () =>
    editor.chain().focus().toggleCodeBlock().run();
  const handleBlockquoteClick = () =>
    editor.chain().focus().toggleBlockquote().run();

  return (
    <>
      <div className="flex justify-end m-3">
        <div className="w-5/6 flex flex-col justify-between items-end">
          <div className="flex flex-row items-center justify-between w-11/12">
            <div className="flex flex-row items-center justify-start">
              <div
                onClick={handleBoldClick}
                className={`py-1 px-2 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("bold") ? "text-blue-700 bg-blue-200" : null
                }`}
              >
                <AiOutlineBold />
              </div>
              <div
                onClick={handleItalicClick}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("italic") ? "text-blue-700 bg-blue-200" : null
                }`}
              >
                <AiOutlineItalic />
              </div>
              <div
                onClick={handleUnderlineClick}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("underline")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <AiOutlineUnderline />
              </div>
              <div
                onClick={handleStrikethroughClick}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("strike") ? "text-blue-700 bg-blue-200" : null
                }`}
              >
                <AiOutlineStrikethrough />
              </div>
              <div
                onClick={handleClearFormatting}
                className="py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer"
              >
                <TbClearFormatting />
              </div>
              <Tooltip
                title={() => <HighlightInput />}
                placement="bottom"
                color="#cbd5e1"
                trigger="click"
              >
                <div
                  className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                    editor.isActive("highlight")
                      ? "text-blue-700 bg-blue-200"
                      : null
                  }`}
                >
                  <AiOutlineHighlight />
                </div>
              </Tooltip>
              <Tooltip
                title={() => <ColorInput />}
                placement="bottom"
                color="#cbd5e1"
                trigger="click"
              >
                <div
                  onClick={() => {}}
                  className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                    editor.isActive("color")
                      ? "text-blue-700 bg-blue-200"
                      : null
                  }`}
                >
                  <IoColorPalette />
                </div>
              </Tooltip>
              <div
                onClick={handleCodeClick}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("code") ? "text-blue-700 bg-blue-200" : null
                }`}
              >
                <FaCode />
              </div>
              <div
                onClick={handleCodeblockClick}
                className={`py-1 px-2 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("codeBlock")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <FaFileCode />
              </div>
            </div>

            <div className="flex flex-row items-center justify-start">
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={`ml-2 py-1 px-2 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 1 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading1 />
              </div>
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 2 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading2 />
              </div>
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 3 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading3 />
              </div>
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 4 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading4 />
              </div>
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 5 }).run()
                }
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 5 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading5 />
              </div>
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 6 }).run()
                }
                className={`py-1 px-2 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 6 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading6 />
              </div>
            </div>

            <div className="flex flex-row items-center justify-start">
              <div
                onClick={handleBlockquoteClick}
                className={`ml-2 py-1 px-2 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("blockquote")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <TbBlockquote />
              </div>
              <div
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("bulletList")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <HiOutlineListBullet />
              </div>
              <div
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("orderedList")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <GoListOrdered />
              </div>
              <div
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("subscript")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <TbSubscript />
              </div>
              <div
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                className={`py-1 px-2 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("superscript")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <TbSuperscript />
              </div>
            </div>

            <div className="flex flex-row items-center justify-start">
              <Tooltip
                title={() => <LinkInput />}
                placement="bottom"
                color="#cbd5e1"
                trigger="click"
              >
                <div
                  className={`ml-2 py-1 px-2 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                    editor.isActive("link") ? "text-blue-700 bg-blue-200" : null
                  }`}
                >
                  <FaLink />
                </div>
              </Tooltip>
              <div
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="py-1 px-2 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer"
              >
                <FaLinkSlash />
              </div>
            </div>

            <Tooltip
              title={() => <ImageInput />}
              placement="bottomLeft"
              color="#cbd5e1"
              trigger="click"
            >
              <div className="ml-2 py-1 px-2 border-b-0 border-t-2 border-l-2 border-r-2 border border-solid border-gray-200 rounded-tl-md rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer">
                <FaImage />
              </div>
            </Tooltip>
          </div>
          <div className="w-11/12 min-h-[100px] rounded-lg border-gray-200 border-solid border-[1px] align-top shadow-sm">
            <EditorContent editor={editor} />
          </div>
          <button
            onClick={handleCommentClick}
            className={`p-2 px-4 mt-2 rounded-md bg-blue-400 text-white ${
              !editor.isEmpty
                ? "hover:bg-blue-600 cursor-pointer"
                : "bg-opacity-75 cursor-text"
            }`}
          >
            Reply
          </button>
        </div>
      </div>
    </>
  );
};

const ParentCommentInput = ({
  handleCommentClick,
  onJsonChange,
  handleAnswerClick,
  canAnswer,
}: {
  handleCommentClick: () => void;
  onJsonChange: (json: JSONContent) => void;
  handleAnswerClick: () => void;
  canAnswer: boolean;
}) => {
  const [jsonContent, setJsonContent] = useState<JSONContent>({});
  console.log(jsonContent);

  const tiptapExtensions = [
    StarterKit.configure({
      codeBlock: false,
    }),
    Color,
    ListItem,
    TextStyle,
    Underline,
    CodeBlockLowlight.configure({
      lowlight: createLowlight(common),
      HTMLAttributes: {
        class: "bg-slate-300 p-2 rounded-md",
      },
    }),
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: "p-1 rounded-lg",
      },
    }),
    Subscript,
    Superscript,
    Link.configure({
      openOnClick: true,
    }),
    TiptapImage.configure({
      allowBase64: true,
    }),
    Typography,
    Placeholder.configure({
      placeholder: "Type your comment here...",
    }),
  ];

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: "",
    onUpdate: ({ editor }) => {
      // Call onJsonChange when editor content updates
      const json: JSONContent = editor.getJSON();
      setJsonContent(json); // Update state with JSON content
      if (onJsonChange) {
        onJsonChange(json); // Call prop function with JSON content
      }
    },
  });

  if (!editor) {
    return null;
  }

  editor.setOptions({
    editorProps: {
      attributes: {
        class:
          "w-full h-[100px] overflow-y-auto p-2 text-sm border border-solid border-gray-200 rounded-b-md",
      },
    },
  });

  const ColorInput = () => {
    return (
      <div className="flex flex-row items-center justify-center gap-2">
        <div
          onClick={() => editor.chain().focus().setColor("#000").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-black cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#000" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#ef4444").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-red-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#ef4444" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#ea580c").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-orange-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#ea580c" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#eab308").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-yellow-500 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#eab308" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#16a34a").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-green-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#16a34a" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#2563eb").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-blue-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#2563eb" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#8b5cf6").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-purple-500 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#8b5cf6" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
      </div>
    );
  };

  const HighlightInput = () => {
    return (
      <div className="flex flex-row items-center justify-center gap-2">
        <button
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-white cursor-pointer"
        >
          {!editor.isActive("highlight") ? <FaCheck className="p-1" /> : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ffcc00" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-[#ffcc00] cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#ffcc00" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ef4444" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-red-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#ef4444" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#3b82f6" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-blue-500 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#3b82f6" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#16a34a" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-green-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#16a34a" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ea580c" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-orange-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#ea580c" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#9333ea" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-purple-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#9333ea" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
      </div>
    );
  };

  const LinkInput = () => {
    const [link, setLink] = useState(
      editor.getAttributes("link").href?.replace(/^https?:\/\//, "") ?? ""
    );

    const onLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLink(e.target.value);
    };

    const handleSetLink = () => {
      // cancelled
      if (link === null) {
        return;
      }

      // empty
      if (link === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: `https://${link}` })
        .run();
    };

    return (
      <>
        <Input
          autoFocus
          addonBefore="https://"
          placeholder="www.github.com"
          value={link}
          onChange={onLinkChange}
          className="mb-2 border border-solid border-slate-500 rounded-md"
        />
        <Button
          onClick={handleSetLink}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Set Link
        </Button>
      </>
    );
  };

  const ImageInput = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageLink, setImageLink] = useState<string>("");

    const onImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setImageLink(e.target.value);
    };

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        let img = event.target.files[0];
        setImage(img);
      }
    };

    const addImageLink = () => {
      editor.chain().focus().setImage({ src: imageLink }).run();
    };

    const addImage = () => {
      if (image === null) {
        return;
      }

      if (image instanceof File) {
        editor
          .chain()
          .focus()
          .setImage({ src: URL.createObjectURL(image) })
          .run();
      }
    };

    return (
      <>
        {image === null ? (
          <div>
            <div className="text-center p-6 border border-dashed border-slate-700 rounded-lg">
              <FaCamera
                className="mx-auto mb-1 h-12 w-12 text-black"
                aria-hidden="true"
              />
              <div className="flex items-center text-xs leading-6 text-black">
                <label
                  htmlFor="file-upload"
                  className="px-1 relative cursor-pointer rounded-full bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    value={image ? URL.createObjectURL(image) : ""}
                    onChange={onImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            <Divider className="my-1">or</Divider>
            <Input
              autoFocus
              variant="filled"
              placeholder="link to image file"
              value={imageLink}
              onChange={onImageLinkChange}
              className="border border-solid border-slate-500 rounded-md"
            />
            <Button
              onClick={addImageLink}
              className="mt-2 w-full bg-blue-500 hover:bg-blue-600"
            >
              Add Image
            </Button>
          </div>
        ) : image instanceof File ? (
          <Image
            src={image ? URL.createObjectURL(image) : ""}
            width={424}
            height={172}
            alt="Picture"
            className="w-full h-full mb-2"
          />
        ) : (
          <Image
            src={image}
            width={424}
            height={172}
            alt="Picture"
            className="w-full h-full mb-2"
          />
        )}
        {image instanceof File && (
          <Button
            onClick={addImage}
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600"
          >
            Add Image
          </Button>
        )}
      </>
    );
  };

  const handleBoldClick = () => editor.chain().focus().toggleBold().run();
  const handleItalicClick = () => editor.chain().focus().toggleItalic().run();
  const handleUnderlineClick = () =>
    editor.chain().focus().toggleUnderline().run();
  const handleStrikethroughClick = () =>
    editor.chain().focus().toggleStrike().run();
  const handleClearFormatting = () =>
    editor.chain().focus().unsetAllMarks().run();
  const handleCodeClick = () => editor.chain().focus().toggleCode().run();
  const handleCodeblockClick = () =>
    editor.chain().focus().toggleCodeBlock().run();
  const handleBlockquoteClick = () =>
    editor.chain().focus().toggleBlockquote().run();

  return (
    <>
      <div className="flex flex-row items-center justify-between mt-2">
        <div className="flex flex-row items-center justify-start">
          <div
            onClick={handleBoldClick}
            className={`py-1 px-2 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("bold") ? "text-blue-700 bg-blue-200" : null
            }`}
          >
            <AiOutlineBold />
          </div>
          <div
            onClick={handleItalicClick}
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("italic") ? "text-blue-700 bg-blue-200" : null
            }`}
          >
            <AiOutlineItalic />
          </div>
          <div
            onClick={handleUnderlineClick}
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("underline") ? "text-blue-700 bg-blue-200" : null
            }`}
          >
            <AiOutlineUnderline />
          </div>
          <div
            onClick={handleStrikethroughClick}
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("strike") ? "text-blue-700 bg-blue-200" : null
            }`}
          >
            <AiOutlineStrikethrough />
          </div>
          <div
            onClick={handleClearFormatting}
            className="py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer"
          >
            <TbClearFormatting />
          </div>
          <Tooltip
            title={() => <HighlightInput />}
            placement="bottom"
            color="#cbd5e1"
            trigger="click"
          >
            <div
              className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                editor.isActive("highlight")
                  ? "text-blue-700 bg-blue-200"
                  : null
              }`}
            >
              <AiOutlineHighlight />
            </div>
          </Tooltip>
          <Tooltip
            title={() => <ColorInput />}
            placement="bottom"
            color="#cbd5e1"
            trigger="click"
          >
            <div
              onClick={() => {}}
              className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                editor.isActive("color") ? "text-blue-700 bg-blue-200" : null
              }`}
            >
              <IoColorPalette />
            </div>
          </Tooltip>
          <div
            onClick={handleCodeClick}
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("code") ? "text-blue-700 bg-blue-200" : null
            }`}
          >
            <FaCode />
          </div>
          <div
            onClick={handleCodeblockClick}
            className={`py-1 px-3 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("codeBlock") ? "text-blue-700 bg-blue-200" : null
            }`}
          >
            <FaFileCode />
          </div>
        </div>

        <div className="flex flex-row items-center justify-start">
          <div
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`ml-2 py-1 px-3 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("heading", { level: 1 })
                ? "text-blue-700 bg-blue-200"
                : null
            }`}
          >
            <LuHeading1 />
          </div>
          <div
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("heading", { level: 2 })
                ? "text-blue-700 bg-blue-200"
                : null
            }`}
          >
            <LuHeading2 />
          </div>
          <div
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("heading", { level: 3 })
                ? "text-blue-700 bg-blue-200"
                : null
            }`}
          >
            <LuHeading3 />
          </div>
          <div
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("heading", { level: 4 })
                ? "text-blue-700 bg-blue-200"
                : null
            }`}
          >
            <LuHeading4 />
          </div>
          <div
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("heading", { level: 5 })
                ? "text-blue-700 bg-blue-200"
                : null
            }`}
          >
            <LuHeading5 />
          </div>
          <div
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={`py-1 px-3 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("heading", { level: 6 })
                ? "text-blue-700 bg-blue-200"
                : null
            }`}
          >
            <LuHeading6 />
          </div>
        </div>

        <div className="flex flex-row items-center justify-start">
          <div
            onClick={handleBlockquoteClick}
            className={`ml-2 py-1 px-3 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("blockquote") ? "text-blue-700 bg-blue-200" : null
            }`}
          >
            <TbBlockquote />
          </div>
          <div
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("bulletList") ? "text-blue-700 bg-blue-200" : null
            }`}
          >
            <HiOutlineListBullet />
          </div>
          <div
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("orderedList")
                ? "text-blue-700 bg-blue-200"
                : null
            }`}
          >
            <GoListOrdered />
          </div>
          <div
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={`py-1 px-3 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("subscript") ? "text-blue-700 bg-blue-200" : null
            }`}
          >
            <TbSubscript />
          </div>
          <div
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={`py-1 px-3 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
              editor.isActive("superscript")
                ? "text-blue-700 bg-blue-200"
                : null
            }`}
          >
            <TbSuperscript />
          </div>
        </div>

        <div className="flex flex-row items-center justify-start">
          <Tooltip
            title={() => <LinkInput />}
            placement="bottom"
            color="#cbd5e1"
            trigger="click"
          >
            <div
              className={`ml-2 py-1 px-3 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                editor.isActive("link") ? "text-blue-700 bg-blue-200" : null
              }`}
            >
              <FaLink />
            </div>
          </Tooltip>
          <div
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="py-1 px-3 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer"
          >
            <FaLinkSlash />
          </div>
        </div>

        <Tooltip
          title={() => <ImageInput />}
          placement="bottomLeft"
          color="#cbd5e1"
          trigger="click"
        >
          <div className="ml-2 py-1 px-3 border-b-0 border-t-2 border-l-2 border-r-2 border border-solid border-gray-200 rounded-tl-md rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer">
            <FaImage />
          </div>
        </Tooltip>
      </div>
      {/* <textarea
        id="comments"
        className="mb-2 min-w-full min-h-[100px] rounded-lg border-gray-200 border-solid border-[1px] align-top shadow-sm"
        placeholder="Type your comment in Markdown..."
        value={inputVal}
        onChange={valChange}
      /> */}
      <div className="mb-2 min-w-full min-h-[100px] rounded-lg border-gray-200 border-solid border-[1px] align-top shadow-sm">
        <EditorContent editor={editor} />
      </div>
      <div
        className={
          !canAnswer
            ? "flex items-end justify-end"
            : "flex items-center justify-between"
        }
      >
        {canAnswer && (
          <button
            className={`p-2 rounded-md bg-green-400 text-white ${
              !editor.isEmpty
                ? "hover:bg-green-600 cursor-pointer"
                : "bg-opacity-75 cursor-text"
            }`}
            onClick={handleAnswerClick}
          >
            Answer Question
          </button>
        )}
        <button
          className={`p-2 rounded-md bg-blue-400 text-white ${
            !editor.isEmpty
              ? "hover:bg-blue-600 cursor-pointer"
              : "bg-opacity-75 cursor-text"
          }`}
          onClick={handleCommentClick}
        >
          Add Comment
        </button>
      </div>
    </>
  );
};

const EditCommentInput = ({
  handleCommentClick,
  onJsonChange,
  renderCommentJson,
}: {
  handleCommentClick: () => void;
  onJsonChange: (json: JSONContent) => void;
  renderCommentJson: JSONContent;
}) => {
  const [jsonContent, setJsonContent] = useState<JSONContent>({});
  console.log(jsonContent);

  const tiptapExtensions = [
    StarterKit.configure({
      codeBlock: false,
    }),
    Color,
    ListItem,
    TextStyle,
    Underline,
    CodeBlockLowlight.configure({
      lowlight: createLowlight(common),
      HTMLAttributes: {
        class: "bg-slate-300 p-2 rounded-md",
      },
    }),
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: "p-1 rounded-lg",
      },
    }),
    Subscript,
    Superscript,
    Link.configure({
      openOnClick: true,
    }),
    TiptapImage.configure({
      allowBase64: true,
    }),
    Typography,
    Placeholder.configure({
      placeholder: "Add your reply...",
    }),
  ];

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: "",
    onUpdate: ({ editor }) => {
      // Call onJsonChange when editor content updates
      const json: JSONContent = editor.getJSON();
      setJsonContent(json); // Update state with JSON content
      if (onJsonChange) {
        onJsonChange(json); // Call prop function with JSON content
      }
    },
  });

  if (!editor) {
    return null;
  }

  editor.setOptions({
    editorProps: {
      attributes: {
        class:
          "w-full h-fit min-h-[100px] overflow-y-auto p-2 text-sm border border-solid border-gray-200 rounded-b-md",
      },
    },
  });

  editor.commands.setContent(renderCommentJson);

  const ColorInput = () => {
    return (
      <div className="flex flex-row items-center justify-center gap-2">
        <div
          onClick={() => editor.chain().focus().setColor("#000").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-black cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#000" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#ef4444").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-red-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#ef4444" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#ea580c").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-orange-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#ea580c" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#eab308").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-yellow-500 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#eab308" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#16a34a").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-green-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#16a34a" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#2563eb").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-blue-600 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#2563eb" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
        <div
          onClick={() => editor.chain().focus().setColor("#8b5cf6").run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-white bg-purple-500 cursor-pointer"
        >
          {editor.isActive("textStyle", { color: "#8b5cf6" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </div>
      </div>
    );
  };

  const HighlightInput = () => {
    return (
      <div className="flex flex-row items-center justify-center gap-2">
        <button
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-white cursor-pointer"
        >
          {!editor.isActive("highlight") ? <FaCheck className="p-1" /> : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ffcc00" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-[#ffcc00] cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#ffcc00" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ef4444" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-red-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#ef4444" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#3b82f6" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-blue-500 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#3b82f6" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#16a34a" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-green-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#16a34a" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ea580c" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-orange-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#ea580c" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#9333ea" }).run()
          }
          className="flex items-center justify-center h-4 w-4 rounded-full text-black bg-purple-600 cursor-pointer"
        >
          {editor.isActive("highlight", { color: "#9333ea" }) ? (
            <FaCheck className="p-1" />
          ) : null}
        </button>
      </div>
    );
  };

  const LinkInput = () => {
    const [link, setLink] = useState(
      editor.getAttributes("link").href?.replace(/^https?:\/\//, "") ?? ""
    );

    const onLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLink(e.target.value);
    };

    const handleSetLink = () => {
      // cancelled
      if (link === null) {
        return;
      }

      // empty
      if (link === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: `https://${link}` })
        .run();
    };

    return (
      <>
        <Input
          autoFocus
          addonBefore="https://"
          placeholder="www.github.com"
          value={link}
          onChange={onLinkChange}
          className="mb-2 border border-solid border-slate-500 rounded-md"
        />
        <Button
          onClick={handleSetLink}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Set Link
        </Button>
      </>
    );
  };

  const ImageInput = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageLink, setImageLink] = useState<string>("");

    const onImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setImageLink(e.target.value);
    };

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        let img = event.target.files[0];
        setImage(img);
      }
    };

    const addImageLink = () => {
      editor.chain().focus().setImage({ src: imageLink }).run();
    };

    const addImage = () => {
      if (image === null) {
        return;
      }

      if (image instanceof File) {
        editor
          .chain()
          .focus()
          .setImage({ src: URL.createObjectURL(image) })
          .run();
      }
    };

    return (
      <>
        {image === null ? (
          <div>
            <div className="text-center p-6 border border-dashed border-slate-700 rounded-lg">
              <FaCamera
                className="mx-auto mb-1 h-12 w-12 text-black"
                aria-hidden="true"
              />
              <div className="flex items-center text-xs leading-6 text-black">
                <label
                  htmlFor="file-upload"
                  className="px-1 relative cursor-pointer rounded-full bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    value={image ? URL.createObjectURL(image) : ""}
                    onChange={onImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            <Divider className="my-1">or</Divider>
            <Input
              autoFocus
              variant="filled"
              placeholder="link to image file"
              value={imageLink}
              onChange={onImageLinkChange}
              className="border border-solid border-slate-500 rounded-md"
            />
            <Button
              onClick={addImageLink}
              className="mt-2 w-full bg-blue-500 hover:bg-blue-600"
            >
              Add Image
            </Button>
          </div>
        ) : image instanceof File ? (
          <Image
            src={image ? URL.createObjectURL(image) : ""}
            width={424}
            height={172}
            alt="Picture"
            className="w-full h-full mb-2"
          />
        ) : (
          <Image
            src={image}
            width={424}
            height={172}
            alt="Picture"
            className="w-full h-full mb-2"
          />
        )}
        {image instanceof File && (
          <Button
            onClick={addImage}
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600"
          >
            Add Image
          </Button>
        )}
      </>
    );
  };

  const handleBoldClick = () => editor.chain().focus().toggleBold().run();
  const handleItalicClick = () => editor.chain().focus().toggleItalic().run();
  const handleUnderlineClick = () =>
    editor.chain().focus().toggleUnderline().run();
  const handleStrikethroughClick = () =>
    editor.chain().focus().toggleStrike().run();
  const handleClearFormatting = () =>
    editor.chain().focus().unsetAllMarks().run();
  const handleCodeClick = () => editor.chain().focus().toggleCode().run();
  const handleCodeblockClick = () =>
    editor.chain().focus().toggleCodeBlock().run();
  const handleBlockquoteClick = () =>
    editor.chain().focus().toggleBlockquote().run();

  return (
    <>
      <div className="flex justify-end m-3">
        <div className="flex flex-col justify-between items-end w-full">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center justify-start">
              <div
                onClick={handleBoldClick}
                className={`py-1 px-2 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("bold") ? "text-blue-700 bg-blue-200" : null
                }`}
              >
                <AiOutlineBold />
              </div>
              <div
                onClick={handleItalicClick}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("italic") ? "text-blue-700 bg-blue-200" : null
                }`}
              >
                <AiOutlineItalic />
              </div>
              <div
                onClick={handleUnderlineClick}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("underline")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <AiOutlineUnderline />
              </div>
              <div
                onClick={handleStrikethroughClick}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("strike") ? "text-blue-700 bg-blue-200" : null
                }`}
              >
                <AiOutlineStrikethrough />
              </div>
              <div
                onClick={handleClearFormatting}
                className="py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer"
              >
                <TbClearFormatting />
              </div>
              <Tooltip
                title={() => <HighlightInput />}
                placement="bottom"
                color="#cbd5e1"
                trigger="click"
              >
                <div
                  className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                    editor.isActive("highlight")
                      ? "text-blue-700 bg-blue-200"
                      : null
                  }`}
                >
                  <AiOutlineHighlight />
                </div>
              </Tooltip>
              <Tooltip
                title={() => <ColorInput />}
                placement="bottom"
                color="#cbd5e1"
                trigger="click"
              >
                <div
                  onClick={() => {}}
                  className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                    editor.isActive("color")
                      ? "text-blue-700 bg-blue-200"
                      : null
                  }`}
                >
                  <IoColorPalette />
                </div>
              </Tooltip>
              <div
                onClick={handleCodeClick}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("code") ? "text-blue-700 bg-blue-200" : null
                }`}
              >
                <FaCode />
              </div>
              <div
                onClick={handleCodeblockClick}
                className={`py-1 px-2 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("codeBlock")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <FaFileCode />
              </div>
            </div>

            <div className="flex flex-row items-center justify-start">
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={`ml-2 py-1 px-2 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 1 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading1 />
              </div>
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 2 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading2 />
              </div>
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 3 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading3 />
              </div>
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 4 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading4 />
              </div>
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 5 }).run()
                }
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 5 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading5 />
              </div>
              <div
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 6 }).run()
                }
                className={`py-1 px-2 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("heading", { level: 6 })
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <LuHeading6 />
              </div>
            </div>

            <div className="flex flex-row items-center justify-start">
              <div
                onClick={handleBlockquoteClick}
                className={`ml-2 py-1 px-2 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("blockquote")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <TbBlockquote />
              </div>
              <div
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("bulletList")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <HiOutlineListBullet />
              </div>
              <div
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("orderedList")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <GoListOrdered />
              </div>
              <div
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                className={`py-1 px-2 border-b-0 border-t-2 border border-solid border-gray-200 hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("subscript")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <TbSubscript />
              </div>
              <div
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                className={`py-1 px-2 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                  editor.isActive("superscript")
                    ? "text-blue-700 bg-blue-200"
                    : null
                }`}
              >
                <TbSuperscript />
              </div>
            </div>

            <div className="flex flex-row items-center justify-start">
              <Tooltip
                title={() => <LinkInput />}
                placement="bottom"
                color="#cbd5e1"
                trigger="click"
              >
                <div
                  className={`ml-2 py-1 px-2 border-b-0 border-t-2 border-l-2 border border-solid border-gray-200 rounded-tl-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer ${
                    editor.isActive("link") ? "text-blue-700 bg-blue-200" : null
                  }`}
                >
                  <FaLink />
                </div>
              </Tooltip>
              <div
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="py-1 px-2 border-b-0 border-t-2 border-r-2 border border-solid border-gray-200 rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer"
              >
                <FaLinkSlash />
              </div>
            </div>

            <Tooltip
              title={() => <ImageInput />}
              placement="bottomLeft"
              color="#cbd5e1"
              trigger="click"
            >
              <div className="ml-2 py-1 px-2 border-b-0 border-t-2 border-l-2 border-r-2 border border-solid border-gray-200 rounded-tl-md rounded-tr-md hover:text-blue-700 hover:bg-blue-200 cursor-pointer">
                <FaImage />
              </div>
            </Tooltip>
          </div>
          {/*<textarea
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
          <div className="rounded-lg w-full">
            <EditorContent editor={editor} />
          </div>
          <button
            onClick={handleCommentClick}
            className="cursor-pointer w-fit rounded-lg border border-solid bg-blue-500 mt-2 px-4 py-2 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Reply
          </button>
        </div>
      </div>
    </>
  );
};

const AddComment = ({
  type,
  handleCommentClick,
  onJsonChange,
  handleAnswerClick = () => {},
  canAnswer = false,
  renderCommentJson = {},
}: {
  type: string;
  handleCommentClick: () => void;
  onJsonChange: (json: JSONContent) => void;
  handleAnswerClick?: () => void;
  canAnswer?: boolean;
  renderCommentJson?: JSONContent;
}) => {
  if (type === "parent") {
    return (
      <ParentCommentInput
        handleCommentClick={handleCommentClick}
        onJsonChange={onJsonChange}
        handleAnswerClick={handleAnswerClick}
        canAnswer={canAnswer}
      />
    );
  } else if (type === "nested") {
    return (
      <NestedCommentInput
        handleCommentClick={handleCommentClick}
        onJsonChange={onJsonChange}
      />
    );
  } else if (type == "edit") {
    return (
      <EditCommentInput
        handleCommentClick={handleCommentClick}
        onJsonChange={onJsonChange}
        renderCommentJson={renderCommentJson}
      />
    );
  }
};

export default AddComment;
