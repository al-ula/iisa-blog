import { clientOnly } from "@solidjs/start";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { ErrorBoundary, Suspense } from "solid-js";
import { editor } from "monaco-editor";
import { loadTheme, theme } from "~/signals/theme";
import { DARK_THEME } from "~/theme-config";
import markHtmlify from "~/utils/remark";

const Monaco = clientOnly(() => import("../components/Monaco"));
const HIGHLIGHTCSS =
  "https://cdn.jsdelivr.net/npm/@wooorm/starry-night@3.5.0/style/light.min.css";
const HIGHLIGHTCSS_DARK =
  "https://cdn.jsdelivr.net/npm/@wooorm/starry-night@3.5.0/style/dark.min.css";

export default function Editor() {
  const [value, setValue] = createSignal("");
  const [html, setHtml] = createSignal("");
  const [error, setError] = createSignal<Error | null>(null);
  const [monacoTheme, setMonacoTheme] = createSignal(
    loadTheme() === DARK_THEME ? "vs-dark" : "vs",
  );
  const [firstLoad, setFirstLoad] = createSignal(true);

  const [highlightTheme, setHighlightTheme] = createSignal(
    loadTheme() === DARK_THEME ? HIGHLIGHTCSS_DARK : HIGHLIGHTCSS,
  );

  const onPreInit = () => {
    if (firstLoad()) {
      console.log("First load: ", firstLoad());
      const spinner = document.querySelector(".editor-loading-spinner");
      if (spinner) spinner.remove();
      setFirstLoad(false);
    }
  };

  const onMonacoMount = (editor: editor.IStandaloneCodeEditor) => {
    const currentTheme = loadTheme();
    setMonacoTheme(currentTheme === DARK_THEME ? "vs-dark" : "vs");
    console.log("Editor theme:", monacoTheme());
    editor.updateOptions({ theme: monacoTheme() });
  };

  const onMonacoChange = (newValue: string) => {
    if (newValue !== value()) setValue(newValue);
  };

  // Theme effects
  createEffect(() => {
    setMonacoTheme(theme() === DARK_THEME ? "vs-dark" : "vs");
    setHighlightTheme(
      theme() === DARK_THEME ? HIGHLIGHTCSS_DARK : HIGHLIGHTCSS,
    );
    console.log("Theme effect: ", theme());
  });

  // Markdown conversion effect
  createEffect(() => {
    let isCancelled = false;

    const convertMarkdown = async () => {
      try {
        const newHtml = await markHtmlify(value(), () => isCancelled);
        if (!isCancelled && newHtml !== undefined) {
          setHtml(newHtml);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Error converting markdown:", err);
          setError(err as Error);
        }
      }
    };

    convertMarkdown();
    return () => {
      isCancelled = true;
    };
  });

  onMount(() => {
    console.log("Mounting editor...");
    setHighlightTheme(
      loadTheme() === DARK_THEME ? HIGHLIGHTCSS_DARK : HIGHLIGHTCSS,
    );
  });

  return (
    <main class="flex flex-col flex-1 mx-auto p-4 w-full h-full min-h-0 text-center text-gray-700">
      <ErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>
        <Suspense fallback={<div>Loading editor...</div>}>
          <div class="flex-1 gap-4 grid grid-cols-2 min-h-0">
            <Show when={firstLoad()}>
              <div class="flex justify-center items-center w-full h-full">
                <span class="text-white loading loading-lg loading-spinner">
                </span>
              </div>
            </Show>
            <Monaco
              value={value()}
              onPreInit={onPreInit}
              onMount={onMonacoMount}
              onChange={onMonacoChange}
              class="h-full overflow-auto"
              theme={monacoTheme()}
            />
            <div
              class="[&_pre]:bg-base-300 max-w-none h-full text-left overflow-auto prose viewer"
              innerHTML={html()}
            />
          </div>
          <link
            rel="stylesheet"
            href={highlightTheme()}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
