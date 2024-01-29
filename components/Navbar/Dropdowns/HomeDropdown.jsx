"use client";
import React, { useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import Dropdown from "../../Dropdown/Dropdown";
import { FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCommunityModal } from "@/redux/actions";
import CreateCommunityModal from "../CreateCommunityModal/CreateCommunityModal";

function HomeDropdown() {
	const [open, setOpen] = useState(false);

	const dispath = useDispatch();

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
				<IoIosArrowDown className="h-5 w-5" />
			</div>
			<Dropdown
				open={open}
				setOpen={setOpen}
				className="left-8 top-12 h-fit w-[250px] py-2 md:left-24"
			>
				<div
					onClick={() => dispath(setCreateCommunityModal(true))}
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
