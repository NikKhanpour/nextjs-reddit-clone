"use client";
import React, { useContext, useState } from "react";
import Dropdown from "../../Dropdown/Dropdown";
import { AiOutlineReddit } from "react-icons/ai";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase-config";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useSignOut } from "react-firebase-hooks/auth";
import { themeContext } from "@/contexts/ThemeContext";
import { userDataContext } from "@/contexts/UserDataContext";
import Switch from "@/components/UI/Switch/Switch";

function ProfileDropdown() {
	const [open, setOpen] = useState(false);

	const [user] = useAuthState(auth);
	const [signOut, loading, error] = useSignOut(auth);

	const { darkmode, setDarkmode } = useContext(themeContext);
	const {
		setUserData,
		setCommunitySnippets,
		setVotedPosts,
		setSnippetsFetched,
	} = useContext(userDataContext);

	async function handleSignOut() {
		const success = await signOut();
		if (success) {
			setUserData(null);
			setCommunitySnippets([]);
			setVotedPosts([]);
			setSnippetsFetched(false);
		}
	}
	return (
		<>
			<div
				onClick={() => setOpen(!open)}
				className="flex w-fit cursor-pointer items-center justify-between rounded-md border border-gray-100 p-1 px-2 dark:border-zinc-800 md:w-[200px] lg:w-[250px]"
			>
				<div className="flex items-center space-x-2 pe-2">
					<AiOutlineReddit className="h-8 w-8" />
					<p className="hidden md:flex">
						{user.displayName
							? user.displayName
							: user.email.split("@")[0]}
					</p>
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
				className="right-2 top-[53px] flex w-[250px] flex-col justify-between space-y-3 bg-white pb-2 pt-4"
			>
				<div className="relative ps-10">
					<HiOutlineUserCircle className="absolute -top-0.5 left-2 h-6 w-6 text-black text-opacity-20 dark:text-white dark:text-opacity-30" />
					<p className="text-black text-opacity-30 dark:text-white dark:text-opacity-30">
						My Stuff
					</p>
				</div>
				<p className="w-full cursor-pointer px-10 py-2 duration-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
					Online Status
				</p>
				<p className="w-full cursor-pointer px-10 py-2 duration-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
					Profile
				</p>
				<p className="w-full cursor-pointer px-10 py-2 duration-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
					Style Avatar
				</p>
				<div className="mx-auto h-[1px] w-[90%] bg-gray-200 dark:bg-zinc-700" />
				<div
					onClick={() => setDarkmode(!darkmode)}
					className="flex w-full cursor-pointer items-center justify-between py-2 pe-7 ps-10 hover:bg-gray-100 dark:hover:bg-zinc-700"
				>
					<p>Darkmode</p>
					<div onClick={() => setDarkmode(!darkmode)}>
						<Switch value={darkmode} />
					</div>
				</div>
				<div className="mx-auto h-[1px] w-[90%] bg-gray-200 dark:bg-zinc-700" />
				<p className="w-full cursor-pointer px-10 py-2 duration-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
					User Setting
				</p>
				<p
					onClick={handleSignOut}
					className="w-full cursor-pointer px-10 py-2 duration-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
				>
					Sign Out
				</p>
			</Dropdown>
		</>
	);
}

export default ProfileDropdown;
