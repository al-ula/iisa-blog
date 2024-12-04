import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { onMount, Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";

export default function App() {
  onMount(() => {});
  return (
    <Router
      root={(props) => (
        <div class="h-screen flex flex-col">
          <Nav />
          <Suspense>{props.children}</Suspense>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
