import "@assets/styles/global.css";
import "@pages/popup/index.css";
import Popup from "@pages/popup/Popup";
import { createRoot } from "react-dom/client";

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Popup root element");
  const root = createRoot(rootContainer);
  root.render(<Popup />);
}

init();
