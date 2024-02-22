"use client";

import PageLayout from "@/components/PageLayout/PageLayout";
import Post from "@/components/Post/Post";
import { postsContext } from "@/contexts/PostsContext";
import { themeContext } from "@/contexts/ThemeContext";
import { userDataContext } from "@/contexts/UserDataContext";
import { auth, firestore } from "@/firebase-config";
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import TopCommunities from "./_components/sidebar/TopCommunities";

function Page() {
	const { darkmode } = useContext(themeContext);

	const [user, loadingUser] = useAuthState(auth);
	const [loading, setLoading] = useState(false);

	const { posts, setPosts } = useContext(postsContext);
	const { communitySnippets, snippetsFetched } = useContext(userDataContext);

	async function buildNoUserHomeFeed() {
		try {
			setLoading(true);
			const postsQuery = query(
				collection(firestore, "posts"),
				orderBy("voteStatus", "desc"),
				limit(10)
			);
			const postsDocs = await getDocs(postsQuery);
			const postsFetch = postsDocs.docs.map((post) => ({
				id: post.id,
				...post.data(),
			}));
			setPosts(postsFetch);
		} catch (error) {
			console.log("buildNoUserHomeFeed", error);
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		if (!user && !loadingUser) buildNoUserHomeFeed();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, loadingUser]);

	async function buildUserHomeFeed() {
		try {
			setLoading(true);
			if (communitySnippets.length) {
				const communityIds = communitySnippets.map(
					(snippet) => snippet.communityId
				);
				const postsQuery = query(
					collection(firestore, "posts"),
					where("communityId", "in", communityIds),
					limit(10)
				);
				const postDocs = await getDocs(postsQuery);
				const posts = postDocs.docs.map((post) => ({
					id: post.id,
					...post.data(),
				}));
				setPosts(posts);
			} else {
				buildNoUserHomeFeed();
			}
		} catch (error) {
			console.log("buildUserHomeFeed", error);
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		if (user && snippetsFetched) buildUserHomeFeed();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [snippetsFetched, user]);
	return (
		<PageLayout>
			<div className="space-y-3">
				{loading ? (
					<div className="mt-24 flex items-center justify-center">
						<div
							className={`
						${darkmode ? "spinner-white-large" : "spinner-dark-large"}
						`}
						/>
					</div>
				) : (
					posts.map((post) => (
						<Post
							key={post.id}
							post={post}
							communityId={post.communityId}
							homePage
						/>
					))
				)}
			</div>
			<>
				<TopCommunities />
			</>
		</PageLayout>
	);
}

export default Page;
