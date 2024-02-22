"use client";
import React, { useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { inputClasses } from "@/constants/inputClasses";
import { IoPerson } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import Button from "@/components/UI/Button/Button";
import { toast } from "react-toastify";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "@/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { createCommunityModalContext } from "@/contexts/CreateCommunityModalContext";
import { authModalContext } from "@/contexts/AuthModalContext";
import { userDataContext } from "@/contexts/UserDataContext";
import { useRouter } from "next/navigation";

const modalVariants = {
	show: {
		scale: 1,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 50,
		},
	},
	hidden: {
		scale: 0.5,
		opacity: 0,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 50,
		},
	},
};

function CreateCommunityModal() {
	const router = useRouter();
	const [communityName, setCommunityName] = useState("");
	const [charsRemaining, setCharsRemaining] = useState(21);
	const [communityType, setCommunityType] = useState("public");
	const [loading, setLoading] = useState(false);

	const [user] = useAuthState(auth);

	const { showCreateCommunityModal, setShowCreateCommunityModal } =
		useContext(createCommunityModalContext);
	const { setShowAuthModal } = useContext(authModalContext);

	const { communitySnippets, setCommunitySnippets } =
		useContext(userDataContext);

	function handleChangeInput(e) {
		if (e.target.value.length < 22) {
			setCommunityName(e.target.value);
			setCharsRemaining(21 - e.target.value.length);
		}
	}

	async function handleCreateCommunity() {
		const format = /[ `!@#$%^&*()_+\[\]{};':"\\|,.<>\/?~]/;
		if (format.test(communityName) || communityName.length < 3) {
			toast.error("Invalid Community Name");
			return;
		}
		if (!user) {
			setShowCreateCommunityModal(false);
			setShowAuthModal(true);
			return;
		}

		try {
			const communityDocRef = doc(
				firestore,
				"communities",
				communityName
			);

			setLoading(true);
			await runTransaction(firestore, async (transaction) => {
				const communityDoc = await transaction.get(communityDocRef);

				if (communityDoc.exists()) {
					setLoading(false);
					toast.error("Name is taken, Try another");
					return;
				}

				transaction.set(communityDocRef, {
					communityId: communityName,
					creatorId: user?.uid,
					createdAt: serverTimestamp(),
					numberOfMembers: 1,
					communityType,
					imageURL: "",
				});

				transaction.set(
					doc(
						firestore,
						`users/${user.uid}/communitySnippets`,
						communityName
					),
					{
						communityId: communityName,
						isModerator: true,
						imageURL: "",
					}
				);
				setLoading(false);
				toast.info("Community Created");
				setShowCreateCommunityModal(false);

				setCommunitySnippets([
					{
						communityId: communityName,
						imageURL: "",
						isModerator: true,
					},
					...communitySnippets,
				]);
			});
			router.push(`/r/${communityName}`);
		} catch (error) {
			console.log("createCommunity", error);
		}
	}

	return (
		<AnimatePresence animate={showCreateCommunityModal ? "show" : "hidden"}>
			{showCreateCommunityModal && (
				<motion.div
					variants={{ show: { opacity: 1 }, hidden: { opacity: 0 } }}
					initial="hidden"
					animate="show"
					exit="hidden"
					id="backdrop"
					onClick={(e) => {
						e.target.id === "backdrop" &&
							setShowCreateCommunityModal(false);
					}}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 px-2 backdrop-blur-sm"
				>
					<motion.div
						variants={modalVariants}
						className="h-fit w-full rounded-md border border-gray-200 bg-white dark:border-zinc-900 dark:bg-zinc-900 sm:w-[600px]"
					>
						<header className="w-full rounded-md bg-gray-100 px-4 py-3 text-xl font-semibold dark:bg-zinc-800">
							Create Community
						</header>
						<div className="my-5 flex flex-col space-y-1 px-4">
							<p className="text-xl font-semibold">Name</p>
							<p className="text-sm">
								Community names including capitalization cannot
								be changed
							</p>
						</div>
						<form className="px-5">
							<div className="relative">
								<input
									type="text"
									onChange={(e) => handleChangeInput(e)}
									value={communityName}
									className={`${inputClasses} ps-[18px] focus:ring dark:focus:ring-blue-900 w-full`}
								/>
								<p className="absolute left-2 top-2 text-gray-400 dark:text-zinc-400">
									r/
								</p>
							</div>
							<p className="ms-2 mt-0.5 text-sm text-gray-600 dark:text-zinc-500">
								{charsRemaining} Characters Remaining
							</p>
							<div className="flex flex-col pt-6">
								<p className="text-xl font-semibold">
									Community Type
								</p>
								<label className="mt-4 flex cursor-pointer items-center font-semibold text-gray-600 dark:text-zinc-400">
									<input
										type="checkbox"
										value="public"
										checked={communityType === "public"}
										onChange={() =>
											setCommunityType("public")
										}
										className="mx-4 h-4 w-4 cursor-pointer"
									/>
									<IoPerson className="me-3 text-gray-600 dark:text-zinc-400" />
									Public
									<p className="ps-4 text-xs font-light text-opacity-30">
										Anyone can view, post, and comment to
										this community
									</p>
								</label>
								<label className="my-2 flex cursor-pointer items-center font-semibold text-gray-600 dark:text-zinc-400">
									<input
										type="checkbox"
										value="Restricted"
										checked={communityType === "Restricted"}
										onChange={() =>
											setCommunityType("Restricted")
										}
										className="mx-4 h-4 w-4 cursor-pointer"
									/>
									<MdRemoveRedEye className="me-3 h-6 w-6 text-gray-600 dark:text-zinc-400 sm:h-fit sm:w-fit" />
									Restricted
									<p className="ps-4 text-xs font-light text-opacity-30">
										Anyone can view this community, but only
										approved people can post
									</p>
								</label>
								<label className="flex cursor-pointer items-center font-semibold text-gray-600 dark:text-zinc-400">
									<input
										type="checkbox"
										value="Private"
										checked={communityType === "Private"}
										onChange={() =>
											setCommunityType("Private")
										}
										className="text-bold mx-4 h-4 w-4 cursor-pointer"
									/>
									<IoLockClosed className="me-3 text-gray-600 dark:text-zinc-400" />
									Private
									<p className="ps-4 text-xs font-light text-opacity-30">
										Only approved people can view and submit
										to this community
									</p>
								</label>
							</div>
						</form>
						<footer className="mt-3 flex w-full space-x-4 rounded-md bg-gray-100 px-4 py-3 text-xl font-semibold dark:bg-zinc-800">
							<div
								onClick={() => {
									setShowCreateCommunityModal(false);
									setCharsRemaining(21);
								}}
							>
								<Button outline className="py-0.5 text-sm">
									Cancel
								</Button>
							</div>
							<div onClick={handleCreateCommunity}>
								<Button
									type={"submit"}
									loading={loading}
									className="w-40 py-0.5 text-sm"
								>
									Create Community
								</Button>
							</div>
						</footer>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default CreateCommunityModal;
