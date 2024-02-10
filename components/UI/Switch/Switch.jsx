"use client";
import { useAnimate } from "framer-motion";
import React, { useEffect } from "react";

function Switch({ value }) {
	const [scope, animate] = useAnimate();

	useEffect(() => {
		animate([
			[
				"#switch",
				{ x: value ? 25 : 3 },
				{ type: "spring", stiffness: 400, damping: 50 },
			],
		]);
	}, [value, animate]);

	return (
		<div
			ref={scope}
			className={`w-12 h-7 rounded-full duration-300 flex items-center ${
				value ? "bg-blue-500" : "bg-gray-200"
			}`}
		>
			<div
				id="switch"
				className="h-5 w-5 rounded-full bg-white shadow-md"
			/>
		</div>
	);
}

export default Switch;
