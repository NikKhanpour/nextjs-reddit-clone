"use client";
import React, { useContext, useEffect, useState } from "react";
import {
	MdOutlineArrowCircleDown,
	MdOutlineArrowCircleUp,
	MdOutlineDeleteOutline,
} from "react-icons/md";
import { motion } from "framer-motion";
import { FaReddit } from "react-icons/fa";
import moment from "moment";
import { BiCommentDots } from "react-icons/bi";
import { FiShare2 } from "react-icons/fi";
import { VscBookmark } from "react-icons/vsc";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase-config";
import { themeContext } from "@/contexts/ThemeContext";
import CommentInput from "./CommentInput";
import { commentsContext } from "@/contexts/CommentsContext";
import { doc, increment, writeBatch } from "firebase/firestore";
import { postsContext } from "@/contexts/PostsContext";

function Comment({ comment }) {
	const [user] = useAuthState(auth);
	const { darkmode } = useContext(themeContext);

	const { posts, setPosts, selectedPost, setSelectedPost } =
		useContext(postsContext);

	const [deleteLoading, setDeleteLoading] = useState(false);
	async function handleDeletecomment() {
		if (user.uid !== comment.creatorId) return;

		const batch = writeBatch(firestore);

		try {
			setDeleteLoading(true);

			const commentDocRef = doc(firestore, "comments", comment.id);
			batch.delete(commentDocRef);

			if (comment.replyTo === selectedPost.id) {
				const postDocRef = doc(firestore, "posts", comment.postId);
				batch.update(postDocRef, {
					numberOfComments: increment(-1),
				});
			}

			await batch.commit();

			setComments(comments.filter((item) => item.id !== comment.id));

			if (comment.replyTo === selectedPost.id) {
				setSelectedPost({
					...selectedPost,
					numberOfComments: selectedPost.numberOfComments - 1,
				});

				setPosts(
					posts.map((item) =>
						item.id === comment.postId ? selectedPost : item
					)
				);
			}
		} catch (error) {
			console.log("handleDeleteComment", error);
		} finally {
			setDeleteLoading(false);
		}
	}

	const [showReplyInput, setShowReplyInput] = useState(false);

	const { comments, setComments } = useContext(commentsContext);
	const [commentReplies, setCommentReplies] = useState([]);
	useEffect(() => {
		setCommentReplies(
			comments.filter((item) => item.replyTo === comment.id)
		);
	}, [comments, setCommentReplies, comment.id]);

	return (
		<div className="flex pl-5">
			<div className="relative flex flex-col">
				<div className="flex flex-col">
					<div className="flex items-center">
						<FaReddit className="min-h-8 min-w-8" />
						<p className="px-2">{comment.creatorDisplayName} </p>
						<p className="text-xs font-light text-black text-opacity-40 dark:text-white dark:text-opacity-40">
							-{" "}
							{moment(
								new Date(comment.createdAt.seconds * 1000)
							).fromNow()}
						</p>
					</div>
				</div>
				<p className="ps-[50px]">{comment.text}</p>
				<div className="flex items-center space-x-2 ps-[50px] text-sm text-black text-opacity-40 dark:text-white dark:text-opacity-40">
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
					<div className="flex flex-wrap items-center ps-2">
						<motion.div
							onClick={() => {
								user
									? setShowReplyInput(!showReplyInput)
									: setShowAuthModal(true);
							}}
							whileHover={{ scale: 1.2 }}
							className="flex cursor-pointer items-center space-x-1"
						>
							<BiCommentDots />
							<p>comment</p>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.2 }}
							className="flex cursor-pointer items-center space-x-1 ps-3"
						>
							<FiShare2 />
							<p>Share</p>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.2 }}
							className="flex cursor-pointer items-center space-x-1 ps-3"
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
									onClick={handleDeletecomment}
									whileHover={{ scale: 1.2 }}
									className="flex cursor-pointer items-center space-x-1 ps-0 sm:ps-3"
								>
									<MdOutlineDeleteOutline />
									<p>Delete</p>
								</motion.div>
							))}
					</div>
				</div>
				{showReplyInput && (
					<CommentInput
						replyTo={comment.id}
						commentReplies={commentReplies}
						setCommentReplies={setCommentReplies}
					/>
				)}
				{commentReplies.map((item) => (
					<Comment comment={item} key={item.id} />
				))}
				<div className="absolute left-4 top-8 my-1 h-[80%] w-0.5 bg-gray-300 hover:bg-gray-400 dark:bg-zinc-600 dark:hover:bg-zinc-400" />
			</div>
		</div>
	);
}

export default Comment;
