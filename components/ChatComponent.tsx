"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  BsFiletypeCs,
  BsFiletypeCss,
  BsFiletypeCsv,
  BsFiletypeDocx,
  BsFiletypeHtml,
  BsFiletypeJava,
  BsFiletypeJs,
  BsFiletypeJson,
  BsFiletypeJsx,
  BsFiletypeMd,
  BsFiletypeMdx,
  BsFiletypePdf,
  BsFiletypePhp,
  BsFiletypePptx,
  BsFiletypePy,
  BsFiletypeRb,
  BsFiletypeSass,
  BsFiletypeScss,
  BsFiletypeSh,
  BsFiletypeSql,
  BsFiletypeTsx,
  BsFiletypeTxt,
  BsFiletypeXlsx,
  BsFiletypeXml,
  BsFiletypeYml,
} from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { FaTrash, FaReply } from "react-icons/fa6";
import { Modal } from "antd";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  useEditor,
  EditorContent,
  JSONContent,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

interface Text {
  id?: number;
  content?: JSONContent;
  user_id?: number;
  meeting_id?: string;
  image?: string;
  file?: string;
  [key: string]: any;
}

const codeFileExtensions = [
  {
    abbreviation: ".html",
    full: "Hypertext Markup Language",
    icon: <BsFiletypeHtml />,
  },
  {
    abbreviation: ".css",
    full: "Cascading Style Sheets",
    icon: <BsFiletypeCss />,
  },
  { abbreviation: ".js", full: "JavaScript", icon: <BsFiletypeJs /> },
  {
    abbreviation: ".jsx",
    full: "JavaScript XML (React)",
    icon: <BsFiletypeJsx />,
  },
  {
    abbreviation: ".tsx",
    full: "TypeScript XML (React)",
    icon: <BsFiletypeTsx />,
  },
  {
    abbreviation: ".php",
    full: "PHP: Hypertext Preprocessor",
    icon: <BsFiletypePhp />,
  },
  { abbreviation: ".py", full: "Python", icon: <BsFiletypePy /> },
  { abbreviation: ".rb", full: "Ruby", icon: <BsFiletypeRb /> },
  { abbreviation: ".java", full: "Java", icon: <BsFiletypeJava /> },
  { abbreviation: ".cs", full: "C#", icon: <BsFiletypeCs /> },
  { abbreviation: ".sh", full: "Shell Script", icon: <BsFiletypeSh /> },
  {
    abbreviation: ".json",
    full: "JavaScript Object Notation",
    icon: <BsFiletypeJson />,
  },
  {
    abbreviation: ".xml",
    full: "eXtensible Markup Language",
    icon: <BsFiletypeXml />,
  },
  {
    abbreviation: ".yml",
    full: "YAML Ain't Markup Language",
    icon: <BsFiletypeYml />,
  },
  { abbreviation: ".md", full: "Markdown", icon: <BsFiletypeMd /> },
  {
    abbreviation: ".sql",
    full: "Structured Query Language",
    icon: <BsFiletypeSql />,
  },
  {
    abbreviation: ".csv",
    full: "Comma-Separated Values",
    icon: <BsFiletypeCsv />,
  },
  {
    abbreviation: ".docx",
    full: "Microsoft Word Document",
    icon: <BsFiletypeDocx />,
  },
  { abbreviation: ".mdx", full: "Markdown with JSX", icon: <BsFiletypeMdx /> },
  {
    abbreviation: ".pdf",
    full: "Portable Document Format",
    icon: <BsFiletypePdf />,
  },
  {
    abbreviation: ".pptx",
    full: "Microsoft PowerPoint Presentation",
    icon: <BsFiletypePptx />,
  },
  {
    abbreviation: ".sass",
    full: "Syntactically Awesome Style Sheets",
    icon: <BsFiletypeSass />,
  },
  {
    abbreviation: ".scss",
    full: "Sassy Cascading Style Sheets",
    icon: <BsFiletypeScss />,
  },
  { abbreviation: ".txt", full: "Text File", icon: <BsFiletypeTxt /> },
  {
    abbreviation: ".xlsx",
    full: "Microsoft Excel Spreadsheet",
    icon: <BsFiletypeXlsx />,
  },
];

const Message = ({
  id,
  content,
  sender,
  onDeleteMessage,
  onEditMessage,
}: {
  id: number;
  content: JSONContent;
  sender?: boolean;
  onDeleteMessage: (id: number) => void;
  onEditMessage: (id: number, content: JSONContent) => void;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState<JSONContent>(content);

  const renderEditor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight: createLowlight(common),
        HTMLAttributes: {
          class: "bg-slate-300 p-2 rounded-md",
        },
      }),
      Link.configure({
        HTMLAttributes: {
          target: "_blank",
        },
      }),
    ],
    content: content,
    editable: false,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight: createLowlight(common),
        HTMLAttributes: {
          class: "bg-slate-300 p-2 rounded-md",
        },
      }),
      Link.configure({
        HTMLAttributes: {
          target: "_blank",
        },
      }),
    ],
    content: editMessage,
    onUpdate: ({ editor }) => {
      const json: JSONContent = editor.getJSON();
      setEditMessage(json);
    },
  });

  if (!renderEditor || !editor) {
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

  return (
    <>
      <div
        className={`flex items-center w-full ${
          sender ? "justify-end" : "justify-start"
        } my-2`}
      >
        {sender && (
          <div className="flex flex-row items-center">
            <div
              onClick={() => setIsEditModalOpen(true)}
              className="mr-1 text-xs text-gray-300 cursor-pointer p-1 hover:bg-blue-200 hover:text-blue-500 hover:rounded-full"
            >
              <FaEdit />
            </div>
            <div
              onClick={() => onDeleteMessage(id)}
              className="mr-1 text-xs text-gray-300 cursor-pointer p-1 hover:bg-red-200 hover:text-red-500 hover:rounded-full"
            >
              <FaTrash />
            </div>
          </div>
        )}
        <div className={`flex flex-col ${sender ? "w-5/6" : "w-full"}`}>
          <div
            className={`p-2 border border-solid rounded-lg text-black ${
              sender ? "items-end text-end" : "items-start text-start"
            } ${!sender ? "bg-slate-300" : "bg-slate-100"} ${sender ? "border-slate-400" : null}`}
          >
            <EditorContent editor={renderEditor} />
          </div>
        </div>
      </div>
      <Modal
        title="Edit Message"
        open={isEditModalOpen}
        onOk={() => {
          onEditMessage(id, editMessage);
          setIsEditModalOpen(false);
        }}
        onCancel={() => setIsEditModalOpen(false)}
        onClose={() => setIsEditModalOpen(false)}
      >
        <div className="w-full">
          <EditorContent editor={editor} />
        </div>
      </Modal>
    </>
  );
};

function ChatComponent({
  meetingId,
  userId,
}: {
  meetingId: string;
  userId: number;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [messages, setMessages] = useState<Text[]>([]);
  const [sendContent, setSendContent] = useState<JSONContent>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, user_id, content, file, image")
        .eq("meeting_id", meetingId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages: ", error);
      } else {
        console.log(data);
        setMessages(data as Text[]);
      }
    };
    fetchMessages();

    const channel = supabase
      .channel("realtime-meeting-chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `meeting_id=eq.${meetingId}`,
        },
        (payload) => {
          console.log("Inserted message:", payload);
          const newMessage = payload.new;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `meeting_id=eq.${meetingId}`,
        },
        (payload) => {
          console.log("Updated message:", payload);
          const updatedMessage = payload.new;
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `meeting_id=eq.${meetingId}`,
        },
        (payload) => {
          console.log("Deleted message:", payload);
          const deletedMessage = payload.old;
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== deletedMessage.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId, router, supabase]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight: createLowlight(common),
        HTMLAttributes: {
          class: "bg-slate-300 p-2 rounded-md",
        },
      }),
      Link.configure({
        HTMLAttributes: {
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder: "Chat with your fellow developer...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const json: JSONContent = editor.getJSON();
      console.log(json);
      setSendContent(json);
    },
  });

  if (!editor) {
    return null;
  }

  editor.setOptions({
    editorProps: {
      attributes: {
        class:
          "w-full overflow-y-hidden outline-none rounded-md border-none p-1 text-sm bg-transparent",
      },
    },
  });

  const handleSendMessage = async () => {
    const newMessage = {
      content: sendContent,
      user_id: userId,
      meeting_id: meetingId,
    };
    const { error } = await supabase.from("messages").insert(newMessage);
    if (error) console.error("Error sending message: ", error);
    setSendContent({});
    editor.commands.setContent("");
  };

  const onDeleteMessage = async (id: number) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) {
      console.error("Error deleting message: ", error);
    } else {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id)
      );
    }
  };

  const onEditMessage = async (id: number, content: JSONContent) => {
    const { error } = await supabase
      .from("messages")
      .update({ content })
      .eq("id", id);
    if (error) {
      console.error("Error editing message: ", error);
    } else {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === id ? { ...msg, content } : msg))
      );
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file);
    }
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const image = event.target.files?.[0];
    if (image) {
      console.log("Image uploaded:", image);
    }
  };

  const handleImageUploadClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col w-full h-full justify-end">
      <div className="flex-1 h-64 overflow-y-auto p-4 mb-16">
        {messages.map((m) => (
          <Message
            key={m.id ?? 0}
            id={m.id ?? 0}
            content={m.content ?? {}}
            sender={m.user_id === userId}
            onDeleteMessage={onDeleteMessage}
            onEditMessage={onEditMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-0 p-2 w-1/4 bg-slate-200">
        <div className="w-full p-3 flex flex-row items-center justify-center border border-solid border-gray-400 rounded-lg">
          {/* <div className="w-full flex justify-start mx-2 text-sm border border-black rounded-md"> */}
          {/* resize-none w-full overflow-x-hidden overflow-y-auto */}
          <div className="w-full mr-2 flex justify-start resize-y overflow-auto">
            {editor && (
              <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
                <div className="floating-menu">
                  <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={editor.isActive("code") ? "is-active" : ""}
                  >
                    Code
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleCodeBlock().run()
                    }
                    className={editor.isActive("codeBlock") ? "is-active" : ""}
                  >
                    Code Block
                  </button>
                  <button onClick={handleImageUploadClick}>Image</button>
                  <button onClick={handleFileUploadClick}>File</button>
                </div>
              </FloatingMenu>
            )}
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageInputChange}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept={`${codeFileExtensions.map((ext) => ext.abbreviation).join(",")},application/*,text/*`}
              onChange={handleFileInputChange}
            />
            <EditorContent editor={editor} />
          </div>

          <div
            onClick={handleSendMessage}
            className={`p-2 rounded-full ${
              !sendContent
                ? "disabled bg-transparent text-gray-600"
                : "bg-white hover:bg-slate-100 border border-gray-200 cursor-pointer text-black"
            }`}
          >
            <IoSend />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;

/*
if (content === "...") {
    return (
      <div
        className={`flex w-full ${
          isOwnMessage ? "justify-end" : "justify-start"
        } my-2`}
      >
        <div
          className={`flex items-center px-3 border border-solid rounded-full ${
            !isOwnMessage ? "bg-black" : "bg-slate-100"
          } ${!isOwnMessage ? "text-white" : "text-black"} ${
            isOwnMessage ? "border-black" : ""
          }`}
        >
          <Loading />
        </div>
      </div>
    );
  }

  <textarea
            ref={textAreaRef}
            rows={1}
            value={sendContent}
            onChange={handleTextAreaChange}
            className="w-full resize-none overflow-y-hidden outline-none rounded-md border-none mx-3 p-1 flex items-center justify-center text-sm bg-transparent"
            placeholder="Message Ross..."
          />

//   const textAreaRef = useRef<HTMLTextAreaElement>(null);
  //   const handleTextAreaChange = (
  //     event: React.ChangeEvent<HTMLTextAreaElement>
  //   ) => {
  //     const value = event.target.value;
  //     setSendContent(value);

  //     if (textAreaRef.current) {
  //       textAreaRef.current.rows = 1; // Reset rows to 1 to calculate scrollHeight
  //       textAreaRef.current.rows = Math.min(
  //         6,
  //         Math.ceil(textAreaRef.current.scrollHeight / 20)
  //       ); // Limit maximum rows to 6 or adjust as needed
  //     }
  //   };

  <textarea
            className="w-full p-2 rounded-lg border border-solid border-blue-500 text-sm"
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
          />
*/
