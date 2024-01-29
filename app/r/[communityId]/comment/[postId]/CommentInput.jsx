import Button from "@/components/Button/Button";
import { inputClasses } from "@/constants/inputClasses";
import { auth, firestore } from "@/firebase-config";
import {
	setComments,
	setSelectedPost,
	setShowAuthModal,
} from "@/redux/actions";
import {
	collection,
	doc,
	increment,
	serverTimestamp,
	writeBatch,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function CommentInput() {
	const [user] = useAuthState(auth);
	const [commentInput, setCommentInput] = useState("");
	const [loading, setLoading] = useState(false);

	const { currentCommunity } = useSelector((state) => state.community);
	const { selectedPost } = useSelector((state) => state.postsState);
	const { comments } = useSelector((state) => state.commentsState);
	const dispatch = useDispatch();

	async function createComment() {
		if (commentInput === "") return;
		if (!user) {
			dispatch(setShowAuthModal(true));
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
			comment: commentInput,
			createdAt: serverTimestamp(),
			voteStatus: 0,
		};

		console.log(newComment);
		const batch = writeBatch(firestore);
		try {
			setLoading(true);

			batch.set(commentDocRef, newComment);

			const postDocRef = doc(firestore, "posts", selectedPost.id);
			batch.update(postDocRef, {
				numberOfComments: increment(1),
			});

			await batch.commit();

			newComment.createdAt = { seconds: new Date() / 1000 };

			dispatch(setComments([newComment, ...comments]));
			dispatch(
				setSelectedPost({
					...selectedPost,
					numberOfComments: selectedPost.numberOfComments + 1,
				})
			);

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
