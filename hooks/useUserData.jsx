"use client";
import { userDataContext } from "@/contexts/UserDataContext";
import { auth, firestore } from "@/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function useUserData() {
	const [user] = useAuthState(auth);
	const { setCommunitySnippets, setVotedPosts } = useContext(userDataContext);

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
			setCommunitySnippets(snippets);
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
			setVotedPosts(votedPosts);
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
