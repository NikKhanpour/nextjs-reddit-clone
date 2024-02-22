"use client";
import React, { useContext, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import Dropdown from "../../../Dropdown/Dropdown";
import { FiPlus } from "react-icons/fi";
import CreateCommunityModal from "../../CreateCommunityModal/CreateCommunityModal";
import { createCommunityModalContext } from "@/contexts/CreateCommunityModalContext";
import { motion } from "framer-motion";
import Moderating from "./Moderating";
import MyCommunities from "./MyCommunities";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase-config";
import { currentCommunityContext } from "@/contexts/CurrentCommunityContext";
import Image from "next/image";
import { FaReddit } from "react-icons/fa";

function HomeDropdown() {
	const [user] = useAuthState(auth);
	const [open, setOpen] = useState(false);
	const { setShowCreateCommunityModal } = useContext(
		createCommunityModalContext
	);

	const { currentCommunity } = useContext(currentCommunityContext);

	return (
		<>
			<div
				onClick={() => setOpen(true)}
				className="mx-4 flex w-fit cursor-pointer items-center justify-between rounded-md border border-gray-100 px-2 py-1 dark:border-zinc-800 md:w-[450px]"
			>
				<div className="flex items-center space-x-2">
					{currentCommunity ? (
						<>
							{currentCommunity.imageURL ? (
								<Image
									src={currentCommunity.imageURL}
									alt="community-image"
									width="20"
									height="20"
									className="h-6 w-6 rounded-full"
								/>
							) : (
								<FaReddit
									className={`h-6 w-6 ${
										currentCommunity.creatorId === user?.uid
											? "text-orange-600"
											: "text-blue-500"
									}`}
								/>
							)}
							<p className="hidden font-medium md:flex">
								{`r/${currentCommunity.communityId}`}
							</p>
						</>
					) : (
						<>
							<IoMdHome className="h-6 w-6" />
							<p className="hidden md:flex">Home</p>
						</>
					)}
				</div>
				<motion.div
					animate={{
						rotate: open ? 180 : 0,
						transition: {
							type: "spring",
							stiffness: 400,
							damping: 50,
						},
					}}
				>
					<IoIosArrowDown className="h-5 w-5" />
				</motion.div>
			</div>
			<Dropdown
				open={open}
				setOpen={setOpen}
				className="left-8 top-12 h-fit w-[250px] py-2 md:left-24"
			>
				<Moderating setOpen={setOpen} />
				{user && (
					<p className="mt-4 px-4 py-2 text-xs text-gray-400 dark:text-zinc-600">
						MY COMMUNITIES
					</p>
				)}
				<div
					onClick={() => setShowCreateCommunityModal(true)}
					className="flex w-full items-center space-x-4 px-4 py-2 duration-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
				>
					<FiPlus className="h-6 w-6" />
					<p>Create Community</p>
				</div>
				<MyCommunities setOpen={setOpen} />
			</Dropdown>
			<CreateCommunityModal />
		</>
	);
}

export default HomeDropdown;
