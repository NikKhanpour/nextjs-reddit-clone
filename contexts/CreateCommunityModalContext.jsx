"use client";
import React, { createContext, useState } from "react";

export const createCommunityModalContext = createContext();
function CreateCommunityModalContext({ children }) {
	const [showCreateCommunityModal, setShowCreateCommunityModal] =
		useState(false);
	return (
		<createCommunityModalContext.Provider
			value={{ showCreateCommunityModal, setShowCreateCommunityModal }}
		>
			{children}
		</createCommunityModalContext.Provider>
	);
}

export default CreateCommunityModalContext;
