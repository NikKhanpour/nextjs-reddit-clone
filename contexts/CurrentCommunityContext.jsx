"use client";
import React, { createContext, useState } from "react";

export const currentCommunityContext = createContext();
function CurrentCommunityContext({ children }) {
	const [currentCommunity, setCurrentCommunity] = useState(null);
	return (
		<currentCommunityContext.Provider
			value={{
				currentCommunity,
				setCurrentCommunity,
			}}
		>
			{children}
		</currentCommunityContext.Provider>
	);
}

export default CurrentCommunityContext;
