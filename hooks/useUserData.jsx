"use client";
import { auth, firestore } from "@/firebase-config";
import { setUserCommunitySnippets, setUserVotedPosts } from "@/redux/actions";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";

function useUserData() {
	const [user] = useAuthState(auth);
	const dispatch = useDispatch();

	async function getUserCommunitySnippets(userId = user && user.uid) {
		if (!user) return;

		try {
			const snippetsDocs = await getDocs(
				collection(firestore, `users/${userId}/communitySnippets`)
			);
			const snippets = snippetsDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			dispatch(setUserCommunitySnippets(snippets));
		} catch (error) {
			console.log("getUserCommunitySnippets", error);
		}
	}

	async function getUserVotedPosts(userId = user && user.uid) {
		if (!user) return;

		try {
			const votedPostsDocs = await getDocs(
				collection(firestore, `users/${userId}/votedPosts`)
			);
			const votedPosts = votedPostsDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			dispatch(setUserVotedPosts(votedPosts));
		} catch (error) {
			console.log("getUserVotedPosts", error);
		}
	}

	return {
		getUserCommunitySnippets,
		getUserVotedPosts,
	};
}

export default useUserData;
