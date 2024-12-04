import { Component, createSignal, onCleanup, onMount } from "solid-js";
import { MonacoEditor } from "solid-monaco";
import loader from "@monaco-editor/loader";
import type { Monaco } from "@monaco-editor/loader";
import * as monacoEditor from "monaco-editor";
import { Show } from "solid-js";
import { debounce } from "lodash";

// Add this import
interface EditorProps {
  value: string;
  class?: string;
  theme?: string;
  onChange: (value: string) => void;
  onMount?: (editor: monacoEditor.editor.IStandaloneCodeEditor) => void;
  onPreInit?: () => void;
}

const Editor: Component<EditorProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let editorInstance: monacoEditor.editor.IStandaloneCodeEditor | null = null;
  const [isLoading, setIsLoading] = createSignal(true);

  props.onPreInit?.();
  const initMonaco = async () => {
    try {
      // Single loader config is sufficient
      loader.config({
        paths: {
          vs:
            "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.48.0/min/vs",
        },
        "vs/nls": {
          availableLanguages: {},
        },
      });

      const monaco = await loader.init();

      // Configure Monaco Environment for web workers with error handling
      self.MonacoEnvironment = {
        getWorkerUrl: function (moduleId: string, label: string) {
          const workerUrl =
            `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.48.0/min/vs/base/worker/workerMain.js`;
          return `data:text/javascript;charset=utf-8,${
            encodeURIComponent(`
            self.MonacoEnvironment = {
              baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.48.0/min/',
              // Add worker error handling
              onError: function(error) {
                console.warn('Monaco Worker Error:', error);
              }
            };
            importScripts('${workerUrl}');
          `)
          }`;
        },
      };

      setIsLoading(false);
      return monaco;
    } catch (error) {
      console.error("Failed to initialize Monaco Editor:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const handleEditorMount = (
    monaco: Monaco,
    editor: monacoEditor.editor.IStandaloneCodeEditor,
  ) => {
    editorInstance = editor;
    props.onMount?.(editor);
  };

  let resizeObserver: ResizeObserver;

  const handleResize = debounce((entries: ResizeObserverEntry[]) => {
    if (!editorInstance || entries.length === 0) return;

    const entry = entries[0];
    const { width, height } = entry.contentRect;

    if (width > 0 && height > 0) {
      editorInstance.layout({ width, height });
    }
  }, 100);

  let mutationObserver: MutationObserver;

  onMount(async () => {
    await initMonaco();

    resizeObserver = new ResizeObserver(handleResize);

    if (containerRef) {
      resizeObserver.observe(containerRef);

      mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" && mutation.attributeName === "style"
          ) {
            handleResize([]);
          }
        });
      });

      mutationObserver.observe(containerRef, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }
  });

  onCleanup(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    if (mutationObserver) {
      mutationObserver.disconnect();
    }
    if (editorInstance) {
      editorInstance.dispose();
      editorInstance = null;
    }
    if (self.MonacoEnvironment) {
      // @ts-ignore
      self.MonacoEnvironment = undefined;
    }
  });

  return (
    <div
      class={`flex w-full h-full monaco-editor-wrapper ${props.class || ""}`}
      ref={containerRef}
    >
      <Show
        when={!isLoading()}
        fallback={
          <div class="flex justify-center items-center w-full h-full">
            <span class="text-white loading loading-lg loading-spinner"></span>
          </div>
        }
      >
        <MonacoEditor
          language="markdown"
          value={props.value}
          options={{
            minimap: { enabled: false },
            theme: props.theme || "vs-dark",
            fontSize: 14,
            wordWrap: "on",
            lineNumbers: "on",
            tabSize: 2,
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            renderLineHighlight: "none",
            automaticLayout: false,
          }}
          onChange={props.onChange}
          onMount={handleEditorMount}
        />
      </Show>
    </div>
  );
};

export default Editor;
