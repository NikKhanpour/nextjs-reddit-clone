"use client";
import React, { useContext, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import Dropdown from "../../Dropdown/Dropdown";
import { FiPlus } from "react-icons/fi";
import CreateCommunityModal from "../CreateCommunityModal/CreateCommunityModal";
import { createCommunityModalContext } from "@/contexts/CreateCommunityModalContext";
import { motion } from "framer-motion";

function HomeDropdown() {
	const [open, setOpen] = useState(false);
	const { showCreateCommunityModal, setShowCreateCommunityModal } =
		useContext(createCommunityModalContext);

	return (
		<>
			<div
				onClick={() => setOpen(true)}
				className="mx-4 flex w-fit cursor-pointer items-center justify-between rounded-md border border-gray-100 px-2 py-1 dark:border-zinc-800 md:w-[450px]"
			>
				<div className="flex items-center space-x-2">
					<IoMdHome className="h-6 w-6" />
					<p className="hidden md:flex">Home</p>
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
				<div
					onClick={() => setShowCreateCommunityModal(true)}
					className="flex w-full items-center space-x-4 px-4 py-2 hover:bg-gray-200 dark:hover:bg-zinc-800"
				>
					<FiPlus className="h-6 w-6" />
					<p>Create Community</p>
				</div>
			</Dropdown>
			<CreateCommunityModal />
		</>
	);
}

export default HomeDropdown;
