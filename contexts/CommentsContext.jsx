"use client";

import { createContext, useState } from "react";

export const commentsContext = createContext();
function CommentsContext({ children }) {
	const [comments, setComments] = useState(null);
	return (
		<commentsContext.Provider value={{ comments, setComments }}>
			{children}
		</commentsContext.Provider>
	);
}

export default CommentsContext;
