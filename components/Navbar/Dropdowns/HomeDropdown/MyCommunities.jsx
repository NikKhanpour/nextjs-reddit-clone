"use client";
import { userDataContext } from "@/contexts/UserDataContext";
import { auth } from "@/firebase-config";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";

function MyCommunities({ setOpen }) {
	const [user, pending] = useAuthState(auth);
	const { communitySnippets } = useContext(userDataContext);

	return (
		user &&
		!pending && (
			<div className="flex flex-col">
				{communitySnippets.map((snippet) => (
					<Link
						href={`/r/${snippet.communityId}`}
						key={snippet.communityId}
						onClick={() => setOpen(false)}
						className="flex w-full items-center space-x-4 px-4 py-2 duration-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
					>
						{snippet.imageURL ? (
							<Image
								src={snippet.imageURL}
								alt="community-image"
								width="20"
								height="20"
								className="h-8 w-8 rounded-full"
							/>
						) : (
							<FaReddit className="h-8 w-8 text-blue-500" />
						)}
						<p>{`r/${snippet.communityId}`}</p>
					</Link>
				))}
			</div>
		)
	);
}

export default MyCommunities;
