import React from "react";
import ReactDOM from "react-dom/client";
import { CustomProvider } from "rsuite";
import { useLocalStorage } from "usehooks-ts";
import App from "./App";
import "./index.less";

function add_theme(theme: string) {
	document.body.classList.remove("rs-theme-light");
	document.body.classList.remove("rs-theme-high-contrast");
	document.body.classList.remove("rs-theme-dark");
	document.body.classList.add(`rs-theme-${theme}`);
}

function Index() {
	const [theme, setTheme] = useLocalStorage("theme", "dark");
	add_theme(theme);
	return (
		<React.StrictMode>
			<CustomProvider>
				<App setTheme={setTheme} theme={theme} />
			</CustomProvider>
		</React.StrictMode>
	);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<Index />,
);
