"use client";

import React from "react";
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

const TiptapRender = ({
  renderContent,
  style,
}: {
  renderContent: JSONContent;
  style: string;
}) => {
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
      placeholder: `If you want to highlight a code block, it is best to type surround your code with \`\`\`. Follow the first set with the language (or associated abbreviation) in order to highlight keywords. For example:

\`\`\`python
if n < 10:
  return 10
else:
  return n
\`\`\`
          `,
    }),
  ];

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: renderContent,
    editable: false,
  });

  if (!editor) {
    return null;
  }

  //   editor.setOptions({
  //     editorProps: {
  //       attributes: {
  //         class: "w-full p-2",
  //       },
  //     },
  //   });

  return (
    <div className={style}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapRender;
