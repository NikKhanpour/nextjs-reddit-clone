"use client";
import Button from "@/components/UI/Button/Button";
import { inputClasses } from "@/constants/inputClasses";
import { authModalContext } from "@/contexts/AuthModalContext";
import { commentsContext } from "@/contexts/CommentsContext";
import { currentCommunityContext } from "@/contexts/CurrentCommunityContext";
import { postsContext } from "@/contexts/PostsContext";
import { auth, firestore } from "@/firebase-config";
import {
	collection,
	doc,
	increment,
	serverTimestamp,
	writeBatch,
} from "firebase/firestore";
import React, { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function CommentInput({ replyTo, commentReplies, setCommentReplies }) {
	const [user] = useAuthState(auth);
	const [commentInput, setCommentInput] = useState("");
	const [loading, setLoading] = useState(false);

	const { currentCommunity } = useContext(currentCommunityContext);
	const { setShowAuthModal } = useContext(authModalContext);
	const { selectedPost, setSelectedPost } = useContext(postsContext);
	const { comments, setComments } = useContext(commentsContext);

	async function createComment() {
		if (commentInput === "") return;
		if (!user) {
			setShowAuthModal(true);
			return;
		}

		const commentDocRef = doc(collection(firestore, "comments"));
		const newComment = {
			id: commentDocRef.id,
			creatorId: user.uid,
			creatorDisplayName: user.email.split("@")[0],
			communityId: currentCommunity.communityId,
			postId: selectedPost.id,
			postTitle: selectedPost.title,
			text: commentInput,
			replyTo: replyTo ? replyTo : selectedPost.id,
			createdAt: serverTimestamp(),
			voteStatus: 0,
		};

		const batch = writeBatch(firestore);
		try {
			setLoading(true);

			batch.set(commentDocRef, newComment);

			if (!replyTo) {
				const postDocRef = doc(firestore, "posts", selectedPost.id);
				batch.update(postDocRef, {
					numberOfComments: increment(1),
				});
			}

			await batch.commit();

			newComment.createdAt = { seconds: new Date() / 1000 };

			setComments([newComment, ...comments]);

			if (!replyTo) {
				setSelectedPost({
					...selectedPost,
					numberOfComments: selectedPost.numberOfComments + 1,
				});
			}
			if (replyTo) {
				setCommentReplies([...commentReplies, newComment]);
			}
			setCommentInput("");
		} catch (error) {
			console.log("createComment", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex w-full flex-col space-y-1 px-5 py-5">
			{user && (
				<p className="ms-0.5 text-sm font-light">
					Comment as{" "}
					<span className="text-blue-500 dark:text-blue-400">
						u/
						{user?.displayName
							? user?.displayName
							: user?.email.split("@")[0]}
					</span>
				</p>
			)}
			<textarea
				type="text"
				className={`${inputClasses} w-full`}
				value={commentInput}
				onChange={(e) => setCommentInput(e.target.value)}
				placeholder="What are your thoughts?"
				rows="5"
				cols="30"
			/>
			<div onClick={createComment} className="pt-2">
				<Button
					loading={loading}
					className="w-32"
					outline
					disabled={loading || commentInput === ""}
				>
					Comment
				</Button>
			</div>
		</div>
	);
}

export default CommentInput;
