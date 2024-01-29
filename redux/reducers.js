import { combineReducers } from "redux";
import {
	SET_SHOW_AUTH_MODAL,
	SET_AUTH_MODAL_STAGE,
	SET_CREATE_COMMUNITY_MODAL,
	SET_CURRENT_COMMUNITY,
	SET_POSTS,
	SET_SELECTED_POST,
	SET_COMMENTS,
	SET_USER_VOTED_POSTS,
	SET_USER_COMMUNITY_SNIPPETS,
	SET_USER_DATA,
} from "./actions";

const authModalInitial = {
	show: false,
	stage: "login",
};
function authModalReducer(state = authModalInitial, action) {
	switch (action.type) {
		case SET_SHOW_AUTH_MODAL:
			return {
				...state,
				show: action.payload,
			};
		case SET_AUTH_MODAL_STAGE:
			return {
				...state,
				stage: action.payload,
			};
		default:
			return state;
	}
}

const userDataInitial = {
	user: null,
	votedPosts: [],
	communitySnippets: [],
};
function userDataReducer(state = userDataInitial, action) {
	switch (action.type) {
		case SET_USER_DATA:
			return {
				...state,
				user: action.payload,
			};
		case SET_USER_VOTED_POSTS:
			return {
				...state,
				votedPosts: action.payload,
			};
		case SET_USER_COMMUNITY_SNIPPETS:
			return {
				...state,
				communitySnippets: action.payload,
			};
		default:
			return state;
	}
}

function createCommunityModalReducer(state = false, action) {
	switch (action.type) {
		case SET_CREATE_COMMUNITY_MODAL:
			return action.payload;
		default:
			return state;
	}
}

const userCommunitiesInitial = {
	currentCommunity: "",
};
function communityReducer(state = userCommunitiesInitial, action) {
	switch (action.type) {
		case SET_CURRENT_COMMUNITY:
			return {
				...state,
				currentCommunity: action.payload,
			};
		default:
			return state;
	}
}

const postsInitial = {
	posts: [],
	selectedPost: {},
};
function postsReducer(state = postsInitial, action) {
	switch (action.type) {
		case SET_POSTS:
			return {
				...state,
				posts: action.payload,
			};
		case SET_SELECTED_POST:
			return {
				...state,
				selectedPost: action.payload,
			};
		default:
			return state;
	}
}

const commentsIntital = {
	comments: [],
};
function commentsReducer(state = commentsIntital, action) {
	switch (action.type) {
		case SET_COMMENTS:
			return {
				...state,
				comments: action.payload,
			};
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	authModal: authModalReducer,
	userData: userDataReducer,
	createCommunityModal: createCommunityModalReducer,
	community: communityReducer,
	postsState: postsReducer,
	commentsState: commentsReducer,
});

export default rootReducer;
