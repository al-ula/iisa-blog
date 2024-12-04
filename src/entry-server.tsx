// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { LIGHT_THEME } from "./theme-config";
import { getCookie } from "vinxi/http";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" data-theme={loadTheme()}>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));

function loadTheme() {
  const cookie = getCookie("theme");
  if (cookie) {
    return cookie;
  } else {
    return LIGHT_THEME;
  }
}
