"use client";
import Button from "@/components/UI/Button/Button";
import useCommunityData from "@/hooks/useCommunityData";
import React, { useContext, useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { inputClasses } from "@/constants/inputClasses";
import { IoImageOutline } from "react-icons/io5";
import { GoLink } from "react-icons/go";
import PageLayout from "@/components/PageLayout/PageLayout";
import { useRouter } from "next/navigation";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase-config";
import Post from "./Post";
import { themeContext } from "@/contexts/ThemeContext";
import AboutCommunity from "@/components/About/AboutCommunity";
import { currentCommunityContext } from "@/contexts/CurrentCommunityContext";
import { postsContext } from "@/contexts/PostsContext";
import { userDataContext } from "@/contexts/UserDataContext";
import InitialStates from "@/components/InitialStates";
import Image from "next/image";

const variants = {
	hidden: {
		y: -100,
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

function CommunityPage({ community }) {
	const router = useRouter();
	const { darkmode } = useContext(themeContext);

	const { communitySnippets } = useContext(userDataContext);
	const { posts, setPosts } = useContext(postsContext);
	const { onJoinOrLeaveCommunity, joinLoading } = useCommunityData();

	const [communitySnippetsLoading] = InitialStates();

	const isJoined = !!communitySnippets.find(
		(item) => item.communityId === community.communityId
	);

	const { currentCommunity } = useContext(currentCommunityContext);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function getPosts() {
			try {
				setLoading(true);
				const postsQuery = query(
					collection(firestore, "posts"),
					where("communityId", "==", community.communityId),
					orderBy("createdAt", "desc")
				);

				const postsDocs = await getDocs(postsQuery);
				const posts = postsDocs.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setPosts(posts);
			} catch (error) {
				console.log("getPosts on communityPage", error);
			} finally {
				setLoading(false);
			}
		}
		getPosts();
	}, [community, setPosts]);

	return (
		<>
			<AnimatePresence>
				<motion.div
					variants={variants}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="-z-10 flex flex-col"
				>
					<div className="h-[100px] w-full bg-blue-400" />
					<div className="w-full bg-white pb-1 shadow-lg dark:bg-zinc-900">
						<div className="mx-auto flex w-[95%] max-w-[1000px] items-center space-x-4">
							{currentCommunity?.imageURL ? (
								<div className="h-20 w-20">
									<Image
										src={currentCommunity.imageURL}
										width="100"
										height="100"
										priority
										alt="community image"
										className="relative -top-5 h-full w-full rounded-full border-2 border-white object-fill"
									/>
								</div>
							) : (
								<FaReddit className="relative -top-5 h-20 w-20 rounded-full border-2 border-white text-black dark:text-blue-500" />
							)}
							<div className="flex">
								<div className="flex flex-col space-y-1.5">
									<p className="text-2xl font-medium">
										{community.communityId}
									</p>
									<p className="text-sm text-black text-opacity-50 dark:text-white dark:text-opacity-50">
										r/{community.communityId}
									</p>
								</div>
								<div
									onClick={() =>
										onJoinOrLeaveCommunity(
											community,
											isJoined
										)
									}
									className="ps-10 pt-1"
								>
									<Button
										outline={isJoined}
										loading={
											communitySnippetsLoading ||
											joinLoading
										}
										className="px-8"
									>
										{isJoined ? "Joined" : "Join"}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
			<PageLayout>
				<>
					<div className="flex w-full flex-col items-center justify-center space-y-3">
						<div
							onClick={() =>
								router.push(
									`/r/${community.communityId}/submit`
								)
							}
							className="flex w-full cursor-pointer items-center space-x-4 rounded-md border border-gray-100 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900"
						>
							<FaReddit className="h-12 w-12" />
							<input
								type="text"
								placeholder="Create Post"
								className={`${inputClasses} w-full`}
							/>
							<IoImageOutline className="h-8 w-8" />
							<GoLink className="h-8 w-8" />
						</div>
						{loading ? (
							<div
								className={`
									${darkmode ? "spinner-white-large" : "spinner-dark-large"}
									`}
							/>
						) : (
							posts &&
							posts.map((post) => (
								<Post
									key={post.id}
									post={post}
									community={community}
								/>
							))
						)}
					</div>
				</>
				<>
					<AboutCommunity />
				</>
			</PageLayout>
		</>
	);
}

export default CommunityPage;
