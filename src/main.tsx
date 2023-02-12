import React from "react";
import ReactDOM from "react-dom/client";
import { CustomProvider } from "rsuite";
import { useLocalStorage } from "usehooks-ts";
import App from "./App";
import "./index.less";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <CustomProvider theme="light">
//       <App />
//     </CustomProvider>
//   </React.StrictMode>
// );

// rewrite this so that app has a setTheme and a theme prop that control
// the theme.

function Index() {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  return (
    <React.StrictMode>
      <CustomProvider theme={theme}>
        <App setTheme={setTheme} theme={theme} />
      </CustomProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Index />
);
