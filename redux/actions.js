export const SET_SHOW_AUTH_MODAL = "SET_SHOW_AUTH_MODAL";
export const SET_AUTH_MODAL_STAGE = "SET_AUTH_MODAL_STAGE";
export const SET_USER_DATA = "SET_USER_DATA";
export const SET_USER_VOTED_POSTS = "SET_USER_VOTED_POSTS";
export const SET_USER_COMMUNITY_SNIPPETS = "SET_USER_COMMUNITY_SNIPPETS";
export const SET_CREATE_COMMUNITY_MODAL = "SET_CREATE_COMMUNITY_MODAL";
export const SET_CURRENT_COMMUNITY = "SET_CURRENT_COMMUNITY";
export const SET_POSTS = "SET_POSTS";
export const SET_SELECTED_POST = "SET_SELECTED_POST";
export const SET_COMMENTS = "SET_COMMENTS";
export const SET_VOTED_POSTS = "SET_VOTED_POSTS";

export function setShowAuthModal(payload) {
	return {
		type: SET_SHOW_AUTH_MODAL,
		payload,
	};
}

export function setAuthModalStage(payload) {
	return {
		type: SET_AUTH_MODAL_STAGE,
		payload,
	};
}

export function setUserData(payload) {
	return {
		type: SET_USER_DATA,
		payload,
	};
}

export function setCreateCommunityModal(payload) {
	return {
		type: SET_CREATE_COMMUNITY_MODAL,
		payload,
	};
}

export function setUserVotedPosts(payload) {
	return {
		type: SET_USER_VOTED_POSTS,
		payload,
	};
}
export function setUserCommunitySnippets(payload) {
	return {
		type: SET_USER_COMMUNITY_SNIPPETS,
		payload,
	};
}

export function setCurrentCommunity(payload) {
	return {
		type: SET_CURRENT_COMMUNITY,
		payload,
	};
}

export function setPosts(payload) {
	return {
		type: SET_POSTS,
		payload,
	};
}

export function setSelectedPost(payload) {
	return {
		type: SET_SELECTED_POST,
		payload,
	};
}

export function setComments(payload) {
	return {
		type: SET_COMMENTS,
		payload,
	};
}
