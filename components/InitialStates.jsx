"use client";
import { userDataContext } from "@/contexts/UserDataContext";
import { auth, firestore } from "@/firebase-config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function InitialStates() {
	const [user] = useAuthState(auth);
	const { setVotedPosts, setCommunitySnippets, setUserData } =
		useContext(userDataContext);

	const [votedPostsLoading, setVotedPostsLoading] = useState(false);
	const [communitySnippetsLoading, setCommunitySnippetsLoading] =
		useState(false);
	const [userDataLoading, setUserDataLoading] = useState(false);

	// const { darkmode, setDarkmode } = useContext(themeContext);

	// useEffect(() => {
	// 	localStorage.getItem("darkmode") &&
	// 		setDarkmode(JSON.parse(localStorage.getItem("darkmode")));
	// }, [setDarkmode]);

	// useEffect(() => {
	// 	localStorage.setItem("darkmode", JSON.stringify(darkmode));
	// }, [darkmode]);

	useEffect(() => {
		async function getUserData() {
			if (user) {
				const userDocRef = doc(firestore, "users", user.uid);
				try {
					setUserDataLoading(true);
					const userData = await getDoc(userDocRef);
					setUserData(userData.data());
				} catch (error) {
					console.log("initial userData", error);
				} finally {
					setUserDataLoading(false);
				}

				try {
					setVotedPostsLoading(true);
					const votedPostsRef = collection(userDocRef, "votedPosts");
					const votedPosts = await getDocs(votedPostsRef);
					const votedPostsSnapshot = votedPosts.docs.map((doc) => ({
						...doc.data(),
					}));
					setVotedPosts(votedPostsSnapshot);
				} catch (error) {
					console.log("initial votedPosts", error);
				} finally {
					setVotedPostsLoading(false);
				}

				try {
					setCommunitySnippetsLoading(true);
					const communitySnippetsRef = collection(
						userDocRef,
						"communitySnippets"
					);
					const communitySnippets = await getDocs(
						communitySnippetsRef
					);
					const communitySnippetsSnapshot =
						communitySnippets.docs.map((doc) => ({
							...doc.data(),
						}));
					setCommunitySnippets(communitySnippetsSnapshot);
				} catch (error) {
					console.log("initial communitySnippets", error);
				} finally {
					setCommunitySnippetsLoading(false);
				}
			}
		}
		getUserData();
	}, [user, setCommunitySnippets, setVotedPosts, setUserData]);
	return [communitySnippetsLoading, votedPostsLoading, userDataLoading];
}

export default InitialStates;
