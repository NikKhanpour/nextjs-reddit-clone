"use client";
import React from "react";
import {
	AnimatePresence,
	LazyMotion,
	m,
	domAnimation,
	motion,
} from "framer-motion";

const variants = {
	hidden: {
		y: 200,
		opacity: 0,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 50,
		},
	},
	show: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 50,
		},
	},
};

function PageLayout({ children }) {
	return (
		<div className="h-[100vh] w-full bg-gray-200 pt-4 dark:bg-black">
			<LazyMotion features={domAnimation}>
				<m.div
					variants={variants}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="mx-auto flex h-fit w-[95%] max-w-[1000px] justify-center md:space-x-6"
				>
					<div className="flex w-full flex-col md:w-[65%]">
						{children && children[0]}
					</div>
					<div className="hidden flex-grow flex-col md:flex">
						{children && children[1]}
					</div>
				</m.div>
			</LazyMotion>
		</div>
	);
}

export default PageLayout;
