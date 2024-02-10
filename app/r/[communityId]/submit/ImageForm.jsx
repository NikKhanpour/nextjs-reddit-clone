"use client";
import Button from "@/components/UI/Button/Button";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
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

function ImageForm({
	selected,
	setSelected,
	selectedFile,
	setSelectedFile,
	selectImageHandler,
}) {
	const selectedFileRef = useRef();

	return (
		<AnimatePresence mode="popLayout">
			{selected === "Image & Video" && (
				<motion.div
					className="mt-4 flex w-full flex-col rounded-lg border border-gray-100 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900"
					variants={variants}
					initial="hidden"
					exit="hidden"
					animate="show"
				>
					{selectedFile ? (
						<>
							<div className="relative m-4 flex items-center justify-center">
								<Image
									src={selectedFile}
									width="1000"
									height="1000"
									className="max-h-[300px] max-w-[300px] rounded-lg"
									alt="your image"
								/>
								<IoClose
									onClick={() => setSelectedFile(null)}
									className="absolute right-0 top-0 h-10 w-10 cursor-pointer text-gray-400"
								/>
							</div>
							<div
								onClick={() => setSelected("Post")}
								className="self-end"
							>
								<Button className="mt-4 rounded-lg px-6 py-2">
									Complete Post
								</Button>
							</div>
						</>
					) : (
						<label className="relative mt-4 w-full rounded-lg border border-gray-300 bg-gray-100 py-12 dark:border-zinc-700 dark:bg-zinc-800">
							<input
								type="file"
								ref={selectedFileRef}
								onChange={selectImageHandler}
								className="absolute inset-0 h-full w-full cursor-pointer rounded-lg opacity-0"
							/>
							<span className="flex w-full cursor-pointer items-center justify-center space-x-5 rounded-lg text-center dark:border-zinc-700">
								<FaPlus className="h-7 w-7 text-gray-500" />
								<span className="text-lg font-bold text-gray-500">
									Upload File
								</span>
							</span>
						</label>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default ImageForm;
