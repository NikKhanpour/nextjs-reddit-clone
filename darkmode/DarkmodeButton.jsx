"use client";
import { useAnimate } from "framer-motion";
import React, { useContext, useEffect } from "react";
import { themeContext } from "./ThemeContext";

function DarkmodeButton() {
	const [scope, animate] = useAnimate();
	const { darkmode, setDarkmode } = useContext(themeContext);

	useEffect(() => {
		animate([
			[
				"#button",
				{ x: darkmode ? 22 : 0 },
				{ type: "spring", stiffness: 300, damping: 30 },
			],
		]);
	}, [darkmode, animate]);
	return (
		<div
			onClick={() => setDarkmode(!darkmode)}
			ref={scope}
			className="flex h-5 w-10 cursor-pointer items-center rounded-full bg-gray-200 duration-300 dark:bg-blue-600"
		>
			<div
				id="button"
				className="relative h-5 w-5 rounded-full bg-white text-white shadow-md"
			></div>
		</div>
	);
}

export default DarkmodeButton;
