"use client";
import moment from "moment";
import React, { useContext, useState } from "react";
import { FaReddit } from "react-icons/fa";
import { motion } from "framer-motion";
import { FiShare2 } from "react-icons/fi";
import { VscBookmark } from "react-icons/vsc";
import {
	MdOutlineArrowCircleDown,
	MdOutlineArrowCircleUp,
	MdOutlineDeleteOutline,
} from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase-config";
import { doc, increment, writeBatch } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { themeContext } from "@/darkmode/ThemeContext";
import { setComments } from "@/redux/actions";

function Comment({ comment }) {
	const [user] = useAuthState(auth);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const { darkmode } = useContext(themeContext);
	const { selectedPost } = useSelector((state) => state.postsState);

	const { comments } = useSelector((state) => state.commentsState);
	const dispatch = useDispatch();

	async function handleDeleteComment() {
		try {
			setDeleteLoading(true);
			const batch = writeBatch(firestore);

			const commentDocRef = doc(firestore, "comments", comment.id);
			batch.delete(commentDocRef);

			const postDocRef = doc(firestore, "posts", selectedPost.id);
			batch.update(postDocRef, {
				numberOfComments: increment(-1),
			});

			await batch.commit();

			dispatch(
				setComments(comments.filter((item) => item.id !== comment.id))
			);
		} catch (error) {
			console.log("handleDeleteComment", error);
		} finally {
			setDeleteLoading(false);
		}
	}

	return (
		<div className="flex space-x-2 px-4">
			<FaReddit className="h-8 w-8" />
			<div className="flex flex-col space-y-2">
				<div className="flex items-center space-x-1">
					<p>{comment.creatorDisplayName} </p>
					<p className="text-xs font-light text-black text-opacity-40 dark:text-white dark:text-opacity-40">
						-{" "}
						{moment(
							new Date(comment.createdAt.seconds * 1000)
						).fromNow()}
					</p>
				</div>
				<p>{comment.comment}</p>
				<div className="flex items-center space-x-2 text-sm text-black text-opacity-40 dark:text-white dark:text-opacity-40">
					<motion.div
						whileHover={{ scale: 1.2 }}
						className="flex cursor-pointer items-center space-x-1"
					>
						<MdOutlineArrowCircleUp className="h-6 w-6" />
					</motion.div>
					<p className="text-xl">{comment.voteStatus}</p>
					<motion.div
						whileHover={{ scale: 1.2 }}
						className="flex cursor-pointer items-center space-x-1"
					>
						<MdOutlineArrowCircleDown className="h-6 w-6" />
					</motion.div>
					<div className="flex items-center space-x-4 ps-2">
						<motion.div
							whileHover={{ scale: 1.2 }}
							className="flex cursor-pointer items-center space-x-1"
						>
							<FiShare2 />
							<p>Share</p>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.2 }}
							className="flex cursor-pointer items-center space-x-1"
						>
							<VscBookmark />
							<p>Save</p>
						</motion.div>
						{comment.creatorId === user?.uid &&
							(deleteLoading ? (
								<div
									className={
										darkmode
											? "spinner-white"
											: "spinner-dark"
									}
									style={{
										width: 15,
										height: 15,
										marginLeft: 40,
									}}
								/>
							) : (
								<motion.div
									onClick={handleDeleteComment}
									whileHover={{ scale: 1.2 }}
									className="flex cursor-pointer items-center space-x-1"
								>
									<MdOutlineDeleteOutline />
									<p>Delete</p>
								</motion.div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Comment;
