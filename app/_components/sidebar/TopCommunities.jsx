"use client";
import { firestore } from "@/firebase-config";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { userDataContext } from "@/contexts/UserDataContext";
import Button from "@/components/UI/Button/Button";
import { useRouter } from "next/navigation";
import useCommunityData from "@/hooks/useCommunityData";
import { FaReddit } from "react-icons/fa";
import Image from "next/image";
import TryPremium from "./TryPremium";
import Home from "./Home";

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

function TopCommunities() {
	const router = useRouter();

	const [topCommunities, setTopCommunities] = useState([]);

	const { communitySnippets } = useContext(userDataContext);

	const { joinLoading, onJoinOrLeaveCommunity } = useCommunityData();

	useEffect(() => {
		async function fetchTopCommunities() {
			try {
				const communitiesQuery = query(
					collection(firestore, "communities"),
					orderBy("numberOfMembers", "desc"),
					limit(5)
				);
				const communitiesDocs = await getDocs(communitiesQuery);
				const communities = communitiesDocs.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setTopCommunities(communities);
			} catch (error) {
				console.log("fetchTopCommunities", error);
			}
		}
		fetchTopCommunities();
	}, []);

	return (
		<AnimatePresence>
			{topCommunities.length > 0 && (
				<>
					<motion.div
						variants={variants}
						initial="hidden"
						animate="show"
						exit="hidden"
						className="flex flex-col rounded-md border border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
					>
						<p className="px-2 pb-2 pt-4">Top Communities</p>
						{topCommunities.map((item, index) => {
							const isJoined = !!communitySnippets.find(
								(snippet) =>
									snippet.communityId === item.communityId
							);
							return (
								<div
									key={item.communityId}
									onClick={() =>
										router.push(`/r/${item.communityId}`)
									}
									className="flex cursor-pointer items-center justify-between rounded-md rounded-t-none border-t border-gray-200 p-3 duration-200 hover:bg-gray-200 dark:border-zinc-700 dark:hover:bg-zinc-800"
								>
									<div className="flex items-center space-x-4">
										<p>{index + 1}</p>
										{item.imageURL ? (
											<Image
												src={item.imageURL}
												alt="community-image"
												width="20"
												height="20"
												className="h-8 w-8 rounded-full"
											/>
										) : (
											<FaReddit className="h-8 w-8 text-blue-500" />
										)}
										<span className="overflow-hidden text-ellipsis whitespace-nowrap">
											{`r/${item.communityId}`}
										</span>
									</div>
									{isJoined ? (
										<div
											onClick={(e) => {
												e.stopPropagation();
												onJoinOrLeaveCommunity(
													item,
													isJoined
												);
											}}
										>
											<Button
												disabled={joinLoading}
												outline
											>
												Joined
											</Button>
										</div>
									) : (
										<div
											onClick={(e) => {
												e.stopPropagation();
												onJoinOrLeaveCommunity(
													item,
													isJoined
												);
											}}
										>
											<Button disabled={joinLoading}>
												Join
											</Button>
										</div>
									)}
								</div>
							);
						})}
					</motion.div>
					<TryPremium />
					<Home />
				</>
			)}
		</AnimatePresence>
	);
}

export default TopCommunities;
