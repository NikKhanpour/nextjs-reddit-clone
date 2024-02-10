"use client";
import React, { createContext, useState } from "react";
export const postsContext = createContext();
function PostsContext({ children }) {
	const [posts, setPosts] = useState([]);
	const [selectedPost, setSelectedPost] = useState({});
	return (
		<postsContext.Provider
			value={{ posts, setPosts, selectedPost, setSelectedPost }}
		>
			{children}
		</postsContext.Provider>
	);
}

export default PostsContext;
