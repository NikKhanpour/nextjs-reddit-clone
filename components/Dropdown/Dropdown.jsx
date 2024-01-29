"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

function Dropdown({ children, open, setOpen, className }) {
	return (
		<AnimatePresence animate={open ? "show" : "hidden"}>
			{open && (
				<div
					id="wrapper"
					onClick={(e) => e.target.id === "wrapper" && setOpen(false)}
					className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
				>
					<motion.div
						variants={{
							hidden: {
								y: -5,
								opacity: 0,
								transition: {
									type: "spring",
									duration: 0.5,
									delayChildren: 0.1,
									staggerChildren: 0.05,
								},
							},
							show: {
								y: 0,
								opacity: 1,
								transition: {
									type: "spring",
									duration: 0.5,
									delayChildren: 0.1,
									staggerChildren: 0.05,
								},
							},
						}}
						initial="hidden"
						animate="show"
						exit="hidden"
						className={`
                        absolute text-sm border dark:border-zinc-700 rounded-md h-fit bg-white dark:bg-zinc-900 shadow-md
                        ${className}
                        `}
					>
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}

export default Dropdown;
