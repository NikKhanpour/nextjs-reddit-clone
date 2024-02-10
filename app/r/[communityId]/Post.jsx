"use client";
import { auth } from "@/firebase-config";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { VscBookmark } from "react-icons/vsc";
import { AnimatePresence, motion } from "framer-motion";
import { BiCommentDots } from "react-icons/bi";
import { FiShare2 } from "react-icons/fi";
import usePosts from "@/hooks/usePosts";
import { toast } from "react-toastify";
import { themeContext } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import {
	IoArrowDownCircle,
	IoArrowDownCircleOutline,
	IoArrowUpCircle,
	IoArrowUpCircleOutline,
} from "react-icons/io5";
import { userDataContext } from "@/contexts/UserDataContext";
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

function Post({ post, community }) {
	const [user] = useAuthState(auth);
	const router = useRouter();
	const [deleteLoading, setDeleteLoading] = useState(false);
	const { darkmode } = useContext(themeContext);

	const { deletePost, onVotePost } = usePosts();

	const { votedPosts } = useContext(userDataContext);
	const [voteValue, setVoteValue] = useState(0);

	useEffect(() => {
		if (!user) {
			setVoteValue(0);
		} else {
			const vote = votedPosts.find((vote) => vote.postId === post.id);
			vote ? setVoteValue(vote.voteValue) : setVoteValue(0);
		}
	}, [user, post.id, votedPosts]);

	async function handleDeletePost(event) {
		event.stopPropagation();
		if (user?.uid !== post.creatorId) return;

		try {
			setDeleteLoading(true);
			const success = await deletePost(post);

			if (!success) {
				throw new Error("Failed to delete post");
			}

			toast.info("Post Deleted Successfully");
		} catch (error) {
			toast.error(error.message);
		} finally {
			setDeleteLoading(false);
		}
	}

	return (
		<AnimatePresence mode="popLayout">
			<motion.div
				onClick={() =>
					router.push(
						`/r/${community.communityId}/comment/${post.id}`
					)
				}
				variants={variants}
				initial="hidden"
				animate="show"
				exit="hidden"
				className="flex h-fit w-full cursor-pointer rounded-md border border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
			>
				<div className="flex flex-col items-center rounded-l-md bg-gray-100 p-2 dark:bg-zinc-800">
					<motion.div
						whileHover={{ scale: 1.2 }}
						onClick={(e) => {
							e.stopPropagation();
							onVotePost(post, 1);
						}}
					>
						{voteValue === 1 ? (
							<IoArrowUpCircle className="h-6 w-6 cursor-pointer text-blue-500" />
						) : (
							<IoArrowUpCircleOutline className="h-6 w-6 cursor-pointer" />
						)}
					</motion.div>
					<p className="text-xl">{post.voteStatus}</p>
					<motion.div
						whileHover={{ scale: 1.2 }}
						onClick={(e) => {
							e.stopPropagation();
							onVotePost(post, -1);
						}}
					>
						{voteValue === -1 ? (
							<IoArrowDownCircle className="h-6 w-6 cursor-pointer text-blue-500" />
						) : (
							<IoArrowDownCircleOutline className="h-6 w-6 cursor-pointer" />
						)}
					</motion.div>
				</div>
				<div className="flex w-full flex-col space-y-2">
					<div className="flex items-center ps-2 pt-2">
						<FaReddit className="h-5 w-5" />
						<p className="ps-1 text-sm font-medium">
							r/{community.communityId}
						</p>
						<p className="ps-1 text-xs text-black text-opacity-30 dark:text-white dark:text-opacity-30">
							- posted by u/
							{post.creatorDisplayName}{" "}
							{moment(
								new Date(post.createdAt?.seconds * 1000)
							).fromNow()}
						</p>
					</div>
					<div className="flex flex-col space-y-2 px-2">
						<p className="text-lg font-medium">{post.title}</p>
						<p className="pb-2 text-sm font-extralight">
							{post.body}
						</p>
						{post.imageURL && (
							<Image
								src={post.imageURL}
								width="500"
								height="500"
								priority
								alt="image"
								className="h-full max-h-[600px] w-full"
							/>
						)}
					</div>
					<div className="flex items-center space-x-5 px-2 text-sm text-black text-opacity-40 dark:text-white dark:text-opacity-40">
						<motion.div
							whileHover={{ scale: 1.2 }}
							className="flex cursor-pointer items-center space-x-1"
						>
							<BiCommentDots />
							<p>{post.numberOfComments} Comments</p>
						</motion.div>
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
							<p>Share</p>
						</motion.div>
						{post.creatorId === user?.uid &&
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
									onClick={(e) => handleDeletePost(e)}
									whileHover={{ scale: 1.2 }}
									className="flex cursor-pointer items-center space-x-1"
								>
									<MdOutlineDeleteOutline />
									<p>Delete</p>
								</motion.div>
							))}
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}

export default Post;
