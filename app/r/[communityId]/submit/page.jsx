"use client";
import PageLayout from "@/components/PageLayout/PageLayout";
import React, { useContext, useState } from "react";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { GoLink } from "react-icons/go";
import { BiPoll } from "react-icons/bi";
import { motion } from "framer-motion";
import PostForm from "./PostForm";
import ImageForm from "./ImageForm";
import useSelectFile from "@/hooks/useSelectFile";
import { useParams, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "@/firebase-config";
import {
	addDoc,
	collection,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { toast } from "react-toastify";
import AboutCommunity from "@/components/About/AboutCommunity";
import { authModalContext } from "@/contexts/AuthModalContext";
import { currentCommunityContext } from "@/contexts/CurrentCommunityContext";

const tabs = [
	{ name: "Post", icon: <IoDocumentText className="z-10 h-6 w-6" /> },
	{
		name: "Image & Video",
		icon: <IoImageOutline className="z-10 h-6 w-6" />,
	},
	{ name: "Link", icon: <GoLink className="z-10 h-6 w-6" /> },
	{ name: "Poll", icon: <BiPoll className="z-10 h-6 w-6" /> },
];

function CreatePostPage() {
	const params = useParams();
	const [user] = useAuthState(auth);
	const router = useRouter();
	const [selected, setSelected] = useState("Post");
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		body: "",
	});

	const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
	const { setShowAuthModal } = useContext(authModalContext);
	const { currentCommunity } = useContext(currentCommunityContext);

	async function createPost(e) {
		e.preventDefault();
		if (!user) {
			toast.error("Sign in to create Post");
			setShowAuthModal(true);
			return;
		}
		if (formData.title === "" || formData.body === "") {
			toast.error("Title and Body Required");
			return;
		}

		const newPost = {
			title: formData.title,
			body: formData.body ? formData.body : "",
			communityId: params.communityId ? params.communityId : "",
			creatorDisplayName: user.displayName
				? user.displayName
				: user.email.split("@")[0],
			creatorId: user.uid,
			voteStatus: 0,
			numberOfComments: 0,
			createdAt: serverTimestamp(),
			communityImageURL: currentCommunity.imageURL
				? currentCommunity.imageURL
				: "",
		};

		try {
			setLoading(true);
			const postDoc = await addDoc(
				collection(firestore, "posts"),
				newPost
			);
			if (selectedFile) {
				const imageRef = ref(storage, `posts/${postDoc.id}/image`);
				await uploadString(imageRef, selectedFile, "data_url");
				const imageURL = await getDownloadURL(imageRef);
				updateDoc(postDoc, { imageURL });
			}
			router.back();
		} catch (error) {
			console.log("createPost", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<PageLayout>
			<>
				<div className="flex w-full flex-col items-center">
					<div className="flex w-full flex-wrap items-center justify-between rounded-md border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
						{tabs.map((item) => (
							<button
								onClick={() => setSelected(item.name)}
								key={item.name}
								className={`relative ${
									selected === item.name &&
									"text-white duration-300"
								}`}
							>
								<div className="flex items-center space-x-2 px-8 py-3">
									{item.icon}
									<p className={`relative z-10 font-medium`}>
										{item.name}
									</p>
								</div>
								{selected === item.name && (
									<motion.div
										layoutId="tab"
										className="absolute left-0 top-0 h-full w-full rounded-md bg-blue-500 dark:bg-blue-600"
									/>
								)}
							</button>
						))}
					</div>
				</div>
				<PostForm
					selected={selected}
					formData={formData}
					setFormData={setFormData}
					createPost={createPost}
					loading={loading}
				/>
				<ImageForm
					selected={selected}
					setSelected={setSelected}
					selectedFile={selectedFile}
					setSelectedFile={setSelectedFile}
					selectImageHandler={onSelectFile}
				/>
			</>
			<>
				<AboutCommunity />
			</>
		</PageLayout>
	);
}

export default CreatePostPage;
