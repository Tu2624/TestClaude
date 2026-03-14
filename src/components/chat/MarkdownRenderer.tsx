"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Clipboard, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = typeof children === "string" ? children : String(children);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group my-3">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-1.5 rounded-md bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy code"
      >
        {copied
          ? <Check className="h-3.5 w-3.5 text-emerald-400" />
          : <Clipboard className="h-3.5 w-3.5 text-slate-400" />
        }
      </button>
      <pre className="not-prose overflow-x-auto rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-sm text-slate-200 font-mono leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-invert leading-tight max-w-none", className)}>
      <ReactMarkdown
        components={{
          code: ({ children, className, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="not-prose text-sm px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock className={className}>{children}</CodeBlock>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
