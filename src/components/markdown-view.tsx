import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export function MarkdownView({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        "prose-headings:font-display prose-headings:text-foreground",
        "prose-h2:mt-6 prose-h2:mb-2 prose-h2:text-lg",
        "prose-h3:mt-4 prose-h3:mb-1 prose-h3:text-base",
        "prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground",
        "prose-ul:my-2 prose-ol:my-2",
        className,
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
