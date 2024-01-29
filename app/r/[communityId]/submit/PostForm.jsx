"use client";
import Button from "@/components/Button/Button";
import { inputClasses } from "@/constants/inputClasses";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

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

function PostForm({ selected, formData, setFormData, createPost, loading }) {
	return (
		<AnimatePresence mode="popLayout">
			{selected === "Post" && (
				<motion.div
					variants={variants}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="mt-4 flex w-full flex-col items-center space-y-4 rounded-md border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
				>
					<input
						type="text"
						placeholder="Title"
						className={`${inputClasses} w-full`}
						value={formData.title}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								title: e.target.value,
							}))
						}
					/>
					<textarea
						cols="20"
						rows="5"
						placeholder="body"
						className={`${inputClasses} w-full`}
						value={formData.body}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								body: e.target.value,
							}))
						}
					></textarea>
					<div onClick={createPost} className="w-full">
						<Button
							loading={loading}
							className="w-full rounded-md py-1"
						>
							Create
						</Button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default PostForm;
