"use client";
import React, { createContext, useEffect, useState } from "react";

export const themeContext = createContext();

function ThemeContext({ children }) {
	const [darkmode, setDarkmode] = useState(false);
	// const [darkmode, setDarkmode] = useState(
	// 	localStorage.getItem("darkmode")
	// 		? JSON.parse(localStorage.getItem("darkmode"))
	// 		: false
	// );

	useEffect(() => {
		document.body.classList.add("duration-300");
		if (darkmode) {
			document.body.classList.add("dark");
			document.body.classList.remove("bg-gray-200");
			document.body.classList.add("bg-black");
			document.body.classList.add("text-white");
		} else {
			document.body.classList.remove("dark");
			document.body.classList.remove("bg-black");
			document.body.classList.add("bg-gray-200");
			document.body.classList.remove("text-white");
		}
		// localStorage.setItem("darkmode", JSON.stringify(darkmode));
	}, [darkmode]);

	return (
		<themeContext.Provider value={{ darkmode, setDarkmode }}>
			{children}
		</themeContext.Provider>
	);
}

export default ThemeContext;
