"use client";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosMore } from "react-icons/io";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import Button from "../UI/Button/Button";
import { useParams, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "@/firebase-config";
import useSelectFile from "@/hooks/useSelectFile";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import useCommunityData from "@/hooks/useCommunityData";
import { AnimatePresence, motion } from "framer-motion";
import { currentCommunityContext } from "@/contexts/CurrentCommunityContext";
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

function AboutCommunity() {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const { communityId } = useParams();

	const selectFileRef = useRef(null);
	const [uploadLoading, setUploadLoading] = useState(false);
	const [loading, setLoading] = useState(false);

	const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();

	const { getCurrentCommunityData } = useCommunityData();

	const { currentCommunity, setCurrentCommunity } = useContext(
		currentCommunityContext
	);

	async function onUploadFile() {
		if (!selectedFile) return;
		try {
			setUploadLoading(true);

			const imageRef = ref(
				storage,
				`communities/${currentCommunity.communityId}`
			);

			await uploadString(imageRef, selectedFile, "data_url");
			const downloadURL = await getDownloadURL(imageRef);
			await updateDoc(
				doc(firestore, "communities", currentCommunity.communityId),
				{
					imageURL: downloadURL,
				}
			);
			setCurrentCommunity({
				...currentCommunity,
				imageURL: downloadURL,
			});
			setSelectedFile(null);
		} catch (error) {
			console.log("onUploadFile", error);
		} finally {
			setUploadLoading(false);
		}
	}

	// useEffect(() => {
	// 	// setLoading(true);
	// 	getCurrentCommunityData(communityId);
	// }, []);

	return (
		<AnimatePresence>
			{currentCommunity && (
				<motion.div
					variants={variants}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="sticky top-[72px] flex flex-col space-y-4 rounded-md border border-gray-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
				>
					<div className="flex w-full items-center justify-between text-black text-opacity-40 dark:text-white dark:text-opacity-40">
						<p>About Community</p>
						<IoIosMore />
					</div>
					<div className="flex w-full items-center justify-between px-5">
						<div className="flex flex-col">
							<p>{currentCommunity.numberOfMembers}</p>
							<p>Members</p>
						</div>
						<div className="flex flex-col">
							<p>1</p>
							<p>Online</p>
						</div>
					</div>
					<div className="my-2 h-[1px] w-full bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-20" />
					<div className="flex items-center space-x-2 px-4 text-black text-opacity-40 dark:text-white dark:text-opacity-40">
						<LiaBirthdayCakeSolid className="h-5 w-5" />
						<p className="mt-1 text-sm font-light">
							Created{" "}
							{moment(
								new Date(
									currentCommunity.createdAt?.seconds * 1000
								)
							).fromNow()}
						</p>
					</div>
					<div
						onClick={() =>
							router.push(
								`/r/${currentCommunity.communityId}/submit`
							)
						}
					>
						<Button className="w-full rounded-md py-1">
							Create Post
						</Button>
					</div>
					{currentCommunity.creatorId === user?.uid && (
						<div className="flex flex-col">
							<p className="font-medium">Admin</p>
							<div
								onClick={() => selectFileRef.current?.click()}
								className="flex w-full items-center justify-between"
							>
								<p className="cursor-pointer pt-1 text-blue-500">
									Change Image
									<input
										type="file"
										ref={selectFileRef}
										hidden
										onChange={onSelectFile}
										accept="image/x-png, image/gif,image/jpeg"
									/>
								</p>
								{selectedFile && (
									<Image
										width="200"
										height="200"
										src={selectedFile}
										alt="Change Community Image"
										className="h-20 w-20 rounded-full"
									/>
								)}
							</div>
							{selectedFile && (
								<div onClick={onUploadFile}>
									<Button
										loading={uploadLoading}
										className="mx-auto h-8 w-20 text-xs"
									>
										Update
									</Button>
								</div>
							)}
						</div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default AboutCommunity;
