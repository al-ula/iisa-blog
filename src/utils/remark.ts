import rehypeFormat from "rehype-format";
import rehypeStarryNight from "rehype-starry-night";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex)
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeFormat)
  .use(rehypeStarryNight)
  .use(rehypeStringify);

export default async function markHtmlify(
  markdown: string,
  isCancelled: () => boolean,
) {
  // Perform asynchronous operations
  const result = await processor.process(markdown);

  // Check if operation has been cancelled
  if (isCancelled()) {
    // Abort operation
    return;
  }

  return String(result);
}
