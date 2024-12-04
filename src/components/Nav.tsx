import { useLocation } from "@solidjs/router";
import { ThemeToggle } from "./ThemeToggle";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <nav class="bg-base-100 navbar">
      <div class="flex-1">
        <button class="text-xl btn btn-ghost prose">
          <h2>IISA</h2>
        </button>
      </div>
      <div class="flex-none">
        <ul class="flex flex-row items-center px-4 text-base-content container">
          {createNavItems(
            [
              ["/", "Home"],
              ["/about", "About"],
            ],
            active,
          )}
        </ul>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

type NavItem = [string, string];

// Constructor function to generate list items
function createNavItems(items: NavItem[], active: (path: string) => string) {
  return items.map(([path, label]) => (
    <li class={`border-b-2 ${active(path)} mx-1 sm:mx-4`}>
      <a class="btn btn-ghost" href={path}>
        {label}
      </a>
    </li>
  ));
}
