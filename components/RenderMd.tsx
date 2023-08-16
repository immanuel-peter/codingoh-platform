import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const placeholderMdText = `# Fibonacci sequence not working

I'm trying to write a program that will print the Fibonacci sequence to the console. I have the following code, but it's not working:

\`\`\`python
def fibonacci(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

def main():
    for i in range(10):
        print(fibonacci(i))

if __name__ == "__main__":
    main()
\`\`\`

I've tried the following steps to try to resolve the issue:

* I've checked my syntax and it looks correct.
* I've tried running the code in a different IDE and it's still not working.
* I've searched for similar issues online and I haven't found any solutions that work for me.

I'm not sure what else to try. Can anyone help me figure out what's wrong with my code?
`;

const HLine = () => {
  return <hr className="border border-solid border-gray-300 w-full my-1" />;
};

const RenderMd = ({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) => {
  const H1 = ({ children }: { children: string }) => (
    <>
      <h1 className="text-2xl font-bold">{children}</h1>
      <HLine />
    </>
  );
  const H2 = ({ children }: { children: string }) => (
    <>
      <h2 className="mt-1 text-xl font-semibold">{children}</h2>
      <HLine />
    </>
  );
  const P = ({ children }: { children: string }) => (
    <p className="text-base">{children}</p>
  );
  const A = ({ children }: { children: URL }) => (
    <a
      className="text-base text-blue-500 cursor-pointer hover:underline hover:underline-offset-auto"
      href={`${children.href}`}
    >
      {`${children}`}
    </a>
  );
  const Li = ({ children }: { children: string }) => (
    <li className="text-sm list-item list-disc list-inside">{children}</li>
  );
  const H4 = ({ children }: { children: string }) => (
    <h4 className="text-2xl text-red-500">{children}</h4>
  );
  const Hr = () => (
    <hr className="w-full h-1 mx-auto my-4 bg-gradient-to-r from-gray-300 to-transparent via-gray-300 rounded-full border-none" />
  );

  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm, remarkToc]}
      rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
      linkTarget="_blank"
      components={{
        h1: H1,
        h2: H2,
        p: P,
        li: Li,
        h4: H4,
        hr: Hr,
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={docco}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="my-2" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {markdown === "" ? placeholderMdText : markdown}
    </ReactMarkdown>
  );
};

export default RenderMd;
