import { firestore } from "@/firebase-config";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import React from "react";
import Post from "./_components/Post";

export async function getPostAndComments(postId) {
	try {
		const postDocRef = doc(firestore, "posts", postId);
		const postDoc = await getDoc(postDocRef);
		const post = { id: postDoc.id, ...postDoc.data() };

		const commentsQueryRef = query(
			collection(firestore, "comments"),
			where("postId", "==", postId),
			orderBy("createdAt", "desc")
		);
		const commentsDocs = await getDocs(commentsQueryRef);
		const comments = commentsDocs.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return { post, comments };
	} catch (error) {
		console.log(error);
	}
}
async function page({ params }) {
	const { post, comments } = await getPostAndComments(params.postId);
	return <Post post={post} commentsFetch={comments} />;
}

export default page;
