import "@assets/styles/global.css";
import Newtab from "@pages/newtab/Newtab";
import "@pages/newtab/index.css";
import { createRoot } from "react-dom/client";

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Newtab root element");
  const root = createRoot(rootContainer);
  root.render(<Newtab />);
}

init();
