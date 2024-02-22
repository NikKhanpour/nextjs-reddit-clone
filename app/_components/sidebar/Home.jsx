"use client";
import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/UI/Button/Button";
import Image from "next/image";
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

function Home() {
	return (
		<motion.div
			variants={variants}
			initial="hidden"
			animate="show"
			exit="hidden"
			className="mt-4 flex flex-col rounded-md border border-gray-100 bg-white px-3 py-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div className="flex items-center">
				<Image
					src="/reddit-logo.svg"
					alt="reddit-logo"
					height="20"
					width="20"
					className="h-12 w-12"
				/>
				<p className="px-4 text-xl font-bold">Home</p>
			</div>
			<p className="pt-2 text-sm font-extralight">
				Your personal Reddit page built for you
			</p>
			<Button className="my-3 w-full border-orange-600 bg-orange-600 hover:text-orange-600 dark:border-orange-600 dark:bg-orange-600 dark:hover:border-orange-600 dark:hover:text-orange-600">
				Create Post
			</Button>
			<Button
				outline
				className="w-full border-orange-600 bg-transparent text-orange-600 hover:bg-orange-600 hover:text-white dark:border-orange-600 dark:bg-transparent dark:text-orange-600 dark:hover:border-orange-600 dark:hover:bg-orange-600 dark:hover:text-white"
			>
				Create Community
			</Button>
		</motion.div>
	);
}

export default Home;
