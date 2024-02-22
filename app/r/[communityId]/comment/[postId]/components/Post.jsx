"use client";

import AboutCommunity from "@/components/About/AboutCommunity";
import PageLayout from "@/components/PageLayout/PageLayout";
import { currentCommunityContext } from "@/contexts/CurrentCommunityContext";
import { postsContext } from "@/contexts/PostsContext";
import { userDataContext } from "@/contexts/UserDataContext";
import { auth } from "@/firebase-config";
import usePosts from "@/hooks/usePosts";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiCommentDots } from "react-icons/bi";
import { FaReddit } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

import {
	IoArrowDownCircle,
	IoArrowDownCircleOutline,
	IoArrowUpCircle,
	IoArrowUpCircleOutline,
} from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { VscBookmark } from "react-icons/vsc";
import { toast } from "react-toastify";
import CommentInput from "./CommentInput";
import { commentsContext } from "@/contexts/CommentsContext";
import Comment from "./comment";

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

function Post({ post, commentsFetch }) {
	const router = useRouter();
	const [user] = useAuthState(auth);

	const { votedPosts } = useContext(userDataContext);

	const { currentCommunity } = useContext(currentCommunityContext);

	const { onVotePost } = usePosts();

	const { selectedPost, setSelectedPost } = useContext(postsContext);
	useEffect(() => {
		setSelectedPost(post);
	}, [setSelectedPost, post]);

	const [voteValue, setVoteValue] = useState(0);
	useEffect(() => {
		if (!user) {
			setVoteValue(0);
		} else {
			if (post) {
				const vote = votedPosts.find((vote) => vote.postId === post.id);
				vote ? setVoteValue(vote.voteValue) : setVoteValue(0);
			}
		}
	}, [user, votedPosts, post]);

	const { comments, setComments } = useContext(commentsContext);
	useEffect(() => {
		commentsFetch && !comments && setComments(commentsFetch);
	}, [commentsFetch, setComments, comments]);

	const [deleteLoading, setDeleteLoading] = useState(false);
	const { deletePost } = usePosts();
	async function handleDeletePost() {
		if (user !== post.creatorId) return;
		try {
			setDeleteLoading(true);
			const success = await deletePost(post);
			if (success) {
				toast.info("Post Deleted Successfully");
				router.back();
			} else {
				throw new Error("Failed to delete Post");
			}
		} catch (error) {
			toast.error(error.message);
		}
	}

	return (
		post && (
			<PageLayout>
				<>
					<AnimatePresence mode="popLayout">
						<motion.div
							variants={variants}
							initial="hidden"
							animate="show"
							exit="hidden"
							className="flex h-fit w-full rounded-md border border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
						>
							<div className="flex flex-col items-center rounded-l-md bg-gray-100 p-2 dark:bg-zinc-800">
								<motion.div
									whileHover={{ scale: 1.2 }}
									onClick={() => onVotePost(post, 1)}
								>
									{voteValue === 1 ? (
										<IoArrowUpCircle className="h-6 w-6 cursor-pointer text-blue-500" />
									) : (
										<IoArrowUpCircleOutline className="h-6 w-6 cursor-pointer" />
									)}
								</motion.div>
								<p className="text-xl">
									{selectedPost.voteStatus}
								</p>
								<motion.div
									whileHover={{ scale: 1.2 }}
									onClick={() => onVotePost(post, -1)}
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
									{post.communityImageURL ? (
										<Image
											src={post.communityImageURL}
											alt="community-image"
											width="20"
											height="20"
											className="h-6 w-6 rounded-full"
										/>
									) : (
										<FaReddit className="h-5 w-5" />
									)}
									<p
										onClick={() =>
											router.push(
												`/r/${post.communityId}`
											)
										}
										className="cursor-pointer ps-1 text-sm font-medium duration-200 hover:underline hover:underline-offset-2"
									>
										r/
										{currentCommunity?.communityId}
									</p>
									<p className="ps-1 text-xs text-black text-opacity-30 dark:text-white dark:text-opacity-30">
										- posted by u/
										{post.creatorDisplayName}{" "}
										{moment(
											new Date(
												post.createdAt?.seconds * 1000
											)
										).fromNow()}
									</p>
								</div>
								<div className="flex flex-col space-y-2 px-2">
									<p className="text-lg font-medium">
										{post.title}
									</p>
									<p className="pb-2 text-sm font-extralight">
										{post.body}
									</p>
									{post.imageURL && (
										<Image
											src={post.imageURL}
											width="1000"
											height="1000"
											alt="image"
											className="h-full w-full"
										/>
									)}
								</div>
								<div className="flex items-center space-x-5 px-2 text-sm text-black text-opacity-40 dark:text-white dark:text-opacity-40">
									<div className="flex cursor-pointer items-center space-x-1">
										<BiCommentDots />
										<p>
											{selectedPost.numberOfComments}{" "}
											Comments
										</p>
									</div>
									<motion.div
										whileHover={{
											scale: 1.2,
										}}
										className="flex cursor-pointer items-center space-x-1"
									>
										<FiShare2 />
										<p>Share</p>
									</motion.div>
									<motion.div
										whileHover={{
											scale: 1.2,
										}}
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
												onClick={handleDeletePost}
												whileHover={{
													scale: 1.2,
												}}
												className="flex cursor-pointer items-center space-x-1"
											>
												<MdOutlineDeleteOutline />
												<p>Delete</p>
											</motion.div>
										))}
								</div>
								<CommentInput />
								{comments?.map(
									(comment) =>
										comment.replyTo === selectedPost.id && (
											<Comment
												key={comment.id}
												comment={comment}
											/>
										)
								)}
							</div>
						</motion.div>
					</AnimatePresence>
				</>
				<>
					<AboutCommunity />
				</>
			</PageLayout>
		)
	);
}

export default Post;
