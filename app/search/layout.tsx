// "use client";

// import { Metadata } from "next";
// import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// type Props = {
//   searchParams: { [q: string]: string | string[] | undefined };
// };

// // http://localhost:3000/search?q=How+can+I+create+a+web+app%3F

// export async function generateMetadata({
//   searchParams,
// }: Props): Promise<Metadata> {
//   const [originalQuestion, setOriginalQuestion] = useState("");

//   useEffect(() => {
//     const searchParams = useSearchParams();
//     const searchQuery = searchParams ? searchParams.get("q") : null;
//     const encodedSearchQuery = encodeURI(searchQuery || "");
//     const decodedSearchQuery = decodeURI(encodedSearchQuery);
//     setOriginalQuestion(decodedSearchQuery);
//   }, []);

//   return {
//     description: `Search CodingOH: ${originalQuestion}`,
//   };
// }

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// <head>
//        {/* Use metadata.title for the document title */}
//         <title>{metadata.title}</title>
//        {/* Other metadata tags */}
//      </head>
