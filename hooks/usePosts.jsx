import { auth, firestore, storage } from "@/firebase-config";
import { setPosts, setSelectedPost, setUserVotedPosts } from "@/redux/actions";
import {
	collection,
	deleteDoc,
	doc,
	increment,
	writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";

function usePosts() {
	const [user] = useAuthState(auth);

	const { posts, selectedPost } = useSelector((state) => state.postsState);
	const { votedPosts } = useSelector((state) => state.userData);
	const dispatch = useDispatch();

	async function deletePost(post) {
		try {
			if (post.imageURL) {
				const imageRef = ref(storage, `posts/${post.id}/image`);
				await deleteObject(imageRef);
			}

			const postDocRef = doc(firestore, `posts/${post.id}`);
			await deleteDoc(postDocRef);

			dispatch(setPosts(posts.filter((item) => item.id !== post.id)));
			return true;
		} catch (error) {
			console.log("deletePost", error);
		}
	}

	async function onVotePost(post, voteValue) {
		const batch = writeBatch(firestore);

		const existingVote = votedPosts.find((vote) => vote.postId === post.id);

		let updatedPost = { ...post };
		let updatedPosts = [...posts];
		let updatedVotedPosts = [...votedPosts];

		if (!existingVote) {
			const postDocRef = doc(firestore, "posts", post.id);
			batch.update(postDocRef, {
				voteStatus: increment(voteValue),
			});

			const postVoteRef = doc(
				collection(firestore, "users", `${user.uid}/votedPosts`)
			);
			const newVote = {
				id: postVoteRef.id,
				postId: post.id,
				voteValue: voteValue,
				communityId: post.communityId,
			};
			batch.set(postVoteRef, newVote);

			updatedVotedPosts = [newVote, ...votedPosts];
			updatedPost.voteStatus = post.voteStatus + voteValue;
			updatedPosts = posts.map((item) =>
				item.id === post.id ? updatedPost : item
			);
		} else {
			if (existingVote.voteValue === voteValue) {
				const postDocRef = doc(firestore, "posts", post.id);
				batch.update(postDocRef, {
					voteStatus: voteValue === 1 ? increment(-1) : increment(1),
				});

				const postVoteRef = doc(
					firestore,
					"users",
					`${user.uid}/votedPosts/${existingVote.id}`
				);
				batch.delete(postVoteRef);

				updatedVotedPosts = votedPosts.filter(
					(item) => item.id !== existingVote.id
				);
				updatedPost.voteStatus =
					voteValue === 1 ? post.voteStatus - 1 : post.voteStatus + 1;
				updatedPosts = posts.map((item) =>
					item.id === post.id ? updatedPost : item
				);
			} else {
				const postDocRef = doc(firestore, "posts", post.id);
				batch.update(postDocRef, {
					voteStatus: increment(voteValue * 2),
				});

				const postVoteRef = doc(
					firestore,
					"users",
					`${user.uid}/votedPosts/${existingVote.id}`
				);
				batch.update(postVoteRef, {
					voteValue: voteValue,
				});

				updatedVotedPosts = votedPosts.map((item) =>
					item.id === existingVote.id
						? { ...item, voteValue: voteValue }
						: item
				);
				updatedPost = {
					...post,
					voteStatus:
						voteValue === 1
							? post.voteStatus + 2
							: post.voteStatus - 2,
				};
				updatedPosts = posts.map((item) =>
					item.id === post.id ? updatedPost : item
				);
			}
		}
		await batch.commit();
		dispatch(setPosts(updatedPosts));
		dispatch(setUserVotedPosts(updatedVotedPosts));
		selectedPost.id === post.id && dispatch(setSelectedPost(updatedPost));
	}

	return { deletePost, onVotePost };
}

export default usePosts;
