import highlighter from "@/lib/shiki";
import type {
  CodeToHastOptions,
  BundledLanguage,
  BundledTheme,
  ShikiTransformer,
} from "shiki";

type Props = {
  code: string;
  theme?: BundledTheme;
  disableBg?: boolean;
  addLineNumbers?: boolean;
} & Omit<CodeToHastOptions<BundledLanguage, BundledTheme>, "code">;

const removeBg: ShikiTransformer = {
  name: "remove-bg",
  pre(node) {
    if (typeof node.properties.style === "string") {
      node.properties.style = node.properties.style
        .replace(/background-color:[^;]*;?/, "")
        .trim();
    }
  },
};

export default function CodeBlock({
  code,
  theme = "github-dark",
  disableBg = false,
  addLineNumbers = false,
  ...options
}: Props) {
  const html = highlighter.codeToHtml(code, {
    ...options,
    theme,
    transformers: [
      ...(options.transformers ?? []),
      ...(disableBg ? [removeBg] : []),
    ],
  });
  // désactive le bg avec un style
  // div > pre.shiki[style="background-color: transparent;"]
  return <div className={`${addLineNumbers ? "shiki-code-line-numbers" : ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
