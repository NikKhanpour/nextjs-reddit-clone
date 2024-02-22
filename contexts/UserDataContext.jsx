"use client";

import { createContext, useState } from "react";

export const userDataContext = createContext();
function UserDataContext({ children }) {
	const [userData, setUserData] = useState(null);
	const [communitySnippets, setCommunitySnippets] = useState([]);
	const [votedPosts, setVotedPosts] = useState([]);
	const [snippetsFetched, setSnippetsFetched] = useState(false);

	return (
		<userDataContext.Provider
			value={{
				userData,
				setUserData,
				communitySnippets,
				setCommunitySnippets,
				votedPosts,
				setVotedPosts,
				snippetsFetched,
				setSnippetsFetched,
			}}
		>
			{children}
		</userDataContext.Provider>
	);
}

export default UserDataContext;
