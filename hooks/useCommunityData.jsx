/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { authModalContext } from "@/contexts/AuthModalContext";
import { currentCommunityContext } from "@/contexts/CurrentCommunityContext";
import { userDataContext } from "@/contexts/UserDataContext";
import { auth, firestore } from "@/firebase-config";
import { doc, getDoc, increment, writeBatch } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function useCommunityData() {
	const [joinLoading, setJoinLoading] = useState(false);

	const { communityId } = useParams();

	const [user] = useAuthState(auth);

	const { setCurrentCommunity } = useContext(currentCommunityContext);

	const { communitySnippets, setCommunitySnippets } =
		useContext(userDataContext);
	const { setShowAuthModal } = useContext(authModalContext);

	async function getCurrentCommunityData(communityId) {
		const communityDocRef = doc(firestore, "communities", communityId);
		const community = await getDoc(communityDocRef);

		if (community.exists()) {
			setCurrentCommunity({ ...community.data() });
		}
	}
	useEffect(() => {
		if (communityId) {
			getCurrentCommunityData(communityId);
		}
	}, []);

	async function onJoinOrLeaveCommunity(community, isJoined) {
		if (!user) {
			setShowAuthModal(true);
			return;
		}

		if (!isJoined) {
			try {
				setJoinLoading(true);
				const batch = writeBatch(firestore);

				batch.set(
					doc(
						firestore,
						`users/${user.uid}/communitySnippets`,
						community.communityId
					),
					{
						communityId: community.communityId,
						imageURL: community.imageURL || "",
						isModerator: user.uid === community.creatorId,
					}
				);

				batch.update(
					doc(firestore, `communities`, community.communityId),
					{ numberOfMembers: increment(1) }
				);

				await batch.commit();
				setCommunitySnippets([
					{
						communityId: community.communityId,
						imageURL: community.imageURL || "",
						isModerator: user.uid === community.creatorId,
					},
					...communitySnippets,
				]);
			} catch (error) {
				console.log("onJoinOrLeaveCommunity joining", error);
			} finally {
				setJoinLoading(false);
			}
		} else {
			try {
				setJoinLoading(true);

				const batch = writeBatch(firestore);

				batch.delete(
					doc(
						firestore,
						`users/${user.uid}/communitySnippets`,
						community.communityId
					)
				);

				batch.update(
					doc(firestore, `communities`, community.communityId),
					{
						numberOfMembers: increment(-1),
					}
				);

				await batch.commit();
				setCommunitySnippets(
					communitySnippets.filter(
						(item) => item.communityId !== community.communityId
					)
				);
			} catch (error) {
				console.log("onJoinOrLeaveCommunity leaving", error);
			} finally {
				setJoinLoading(false);
			}
		}
	}

	return {
		onJoinOrLeaveCommunity,
		joinLoading,
		setJoinLoading,
		getCurrentCommunityData,
	};
}

export default useCommunityData;
