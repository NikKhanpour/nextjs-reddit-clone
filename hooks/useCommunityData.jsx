/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { auth, firestore } from "@/firebase-config";
import {
	setCurrentCommunity,
	setShowAuthModal,
	setUserCommunitySnippets,
} from "@/redux/actions";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	writeBatch,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";

function useCommunityData() {
	const [joinLoading, setJoinLoading] = useState(false);

	const { communityId } = useParams();

	const [user] = useAuthState(auth);

	const dispatch = useDispatch();

	const { currentCommunity } = useSelector((state) => state.community);

	const { communitySnippets } = useSelector((state) => state.userData);

	async function getCurrentCommunityData(communityId) {
		const communityDocRef = doc(firestore, "communities", communityId);
		const community = await getDoc(communityDocRef);

		if (community.exists()) {
			dispatch(setCurrentCommunity({ ...community.data() }));
		}
	}
	useEffect(() => {
		if (communityId) {
			getCurrentCommunityData(communityId);
		}
	}, []);

	async function onJoinOrLeaveCommunity(community, isJoined) {
		if (!user) {
			dispatch(setShowAuthModal(true));
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

				dispatch(
					setUserCommunitySnippets([
						{
							communityId: community.communityId,
							imageURL: community.imageURL || "",
							isModerator: user.uid === community.creatorId,
						},
						...communitySnippets,
					])
				);
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

				dispatch(
					setUserCommunitySnippets(
						communitySnippets.filter(
							(item) => item.communityId !== community.communityId
						)
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
