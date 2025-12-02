"use client";

import type { JSONContent } from "@tiptap/react";
import parse from "html-react-parser";
import { useEffect, useState } from "react";

// extensions importées normalement
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";

export function RenderDescription({ json }: { json: JSONContent }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    // import dynamique => évite d’évaluer @tiptap/html côté serveur
    import("@tiptap/html").then(({ generateHTML }) => {
      const out = generateHTML(json, [
        StarterKit,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TiptapImage,
         TiptapLink.configure({                      // ← Ajoute cette extension
          openOnClick: false,
          HTMLAttributes: {
            class: "text-primary underline cursor-pointer hover:text-primary/80",
          },
        }),
      ]);
      setHtml(out);
    });
  }, [json]);

  return (
  <div className="tiptap-content prose dark:prose-invert max-w-none">
    {parse(html)}
  </div>
  );
}
