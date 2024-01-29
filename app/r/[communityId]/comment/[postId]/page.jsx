/* eslint-disable @next/next/no-img-element */
"use client";
import AboutCommunity from "@/components/About/AboutCommunity";
import PageLayout from "@/components/PageLayout/PageLayout";
import { themeContext } from "@/darkmode/ThemeContext";
import { auth, firestore } from "@/firebase-config";
import usePosts from "@/hooks/usePosts";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiCommentDots } from "react-icons/bi";
import { FaReddit } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { VscBookmark } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import CommentInput from "./CommentInput";
import { setComments, setSelectedPost } from "@/redux/actions";
import { toast } from "react-toastify";
import Comment from "./Comment";
import { useRouter } from "next/navigation";
import {
	IoArrowDownCircle,
	IoArrowDownCircleOutline,
	IoArrowUpCircle,
	IoArrowUpCircleOutline,
} from "react-icons/io5";

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

function PostPage({ params }) {
	const [user] = useAuthState(auth);
	const router = useRouter();
	const { darkmode } = useContext(themeContext);
	const { currentCommunity } = useSelector((state) => state.community);
	const { deletePost } = usePosts();
	const { votedPosts } = useSelector((state) => state.userData);

	const [loading, setLoading] = useState(true);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [voteValue, setVoteValue] = useState(0);

	const { selectedPost } = useSelector((state) => state.postsState);
	const { comments } = useSelector((state) => state.commentsState);
	const dispatch = useDispatch();

	const { onVotePost } = usePosts();

	useEffect(() => {
		async function getPostAndComments() {
			try {
				const postDocRef = doc(firestore, "posts", params.postId);
				const postDoc = await getDoc(postDocRef);
				dispatch(
					setSelectedPost({ id: postDoc.id, ...postDoc.data() })
				);

				const commentsQuery = query(
					collection(firestore, "comments"),
					where("postId", "==", String(selectedPost.id)),
					orderBy("createdAt", "desc")
				);
				const commentsDoc = await getDocs(commentsQuery);
				const commentsTemp = commentsDoc.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				dispatch(setComments(commentsTemp));
			} catch (error) {
				console.log("getPostAndComments", error);
			} finally {
				setLoading(false);
			}
		}
		getPostAndComments();
	}, [params.postId, dispatch, selectedPost.id]);

	async function handleDeletePost() {
		if (selectedPost.creatorId !== user?.uid) return;
		try {
			setDeleteLoading(true);
			const success = await deletePost(selectedPost);
			if (!success) {
				throw new Error("Failed to delete Post");
			}
			router.back();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setDeleteLoading(false);
		}
	}

	useEffect(() => {
		if (!user) {
			setVoteValue(0);
		} else {
			if (votedPosts.length > 0) {
				console.log(votedPosts);
				const voteValueRef = votedPosts.find(
					(vote) => vote.postId === selectedPost.id
				)?.voteValue;
				setVoteValue(voteValueRef);
			}
		}
	}, [user, params.postId, votedPosts, selectedPost.id]);

	return (
		<>
			{loading ? (
				<div className="mt-10 flex w-full items-center justify-center">
					<div
						className={
							darkmode
								? "spinner-white-large"
								: "spinner-dark-large"
						}
					/>
				</div>
			) : (
				selectedPost && (
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
									<div className="flex flex-col items-center bg-gray-100 p-2 dark:bg-zinc-800">
										<div
											onClick={() =>
												onVotePost(selectedPost, 1)
											}
										>
											{voteValue === 1 ? (
												<IoArrowUpCircle className="h-6 w-6 cursor-pointer text-blue-500" />
											) : (
												<IoArrowUpCircleOutline className="h-6 w-6 cursor-pointer" />
											)}
										</div>
										<p className="text-xl">
											{selectedPost.voteStatus}
										</p>
										<div
											onClick={() =>
												onVotePost(selectedPost, -1)
											}
										>
											{voteValue === -1 ? (
												<IoArrowDownCircle className="h-6 w-6 cursor-pointer text-blue-500" />
											) : (
												<IoArrowDownCircleOutline className="h-6 w-6 cursor-pointer" />
											)}
										</div>
									</div>
									<div className="flex w-full flex-col space-y-2">
										<div className="flex items-center ps-2 pt-2">
											<FaReddit className="h-5 w-5" />
											<p className="ps-1 text-sm font-medium">
												r/{currentCommunity.communityId}
											</p>
											<p className="ps-1 text-xs text-black text-opacity-30 dark:text-white dark:text-opacity-30">
												- posted by u/
												{
													selectedPost.creatorDisplayName
												}{" "}
												{moment(
													new Date(
														selectedPost.createdAt
															?.seconds * 1000
													)
												).fromNow()}
											</p>
										</div>
										<div className="flex flex-col space-y-2 px-2">
											<p className="text-lg font-medium">
												{selectedPost.title}
											</p>
											<p className="pb-2 text-sm font-extralight">
												{selectedPost.body}
											</p>
											{selectedPost.imageURL && (
												<img
													src={selectedPost.imageURL}
													alt="image"
													className="h-full w-full"
												/>
											)}
										</div>
										<div className="flex items-center space-x-5 px-2 text-sm text-black text-opacity-40 dark:text-white dark:text-opacity-40">
											<div className="flex cursor-pointer items-center space-x-1">
												<BiCommentDots />
												<p>
													{
														selectedPost.numberOfComments
													}{" "}
													Comments
												</p>
											</div>
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
											{selectedPost.creatorId ===
												user?.uid &&
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
														onClick={(e) =>
															handleDeletePost(e)
														}
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
										{comments.length > 0 && (
											<div className="flex flex-col space-y-8">
												{comments.map((comment) => (
													<Comment
														key={comment.id}
														comment={comment}
													/>
												))}
											</div>
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
			)}
		</>
	);
}

export default PostPage;
