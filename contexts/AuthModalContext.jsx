"use client";
import React, { createContext, useState } from "react";
import AllContext from "./AllContext";

export const authModalContext = createContext();
function AuthModalContext({ children }) {
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [authModalStage, setAuthModalStage] = useState("login");
	return (
		<authModalContext.Provider
			value={{
				showAuthModal,
				setShowAuthModal,
				authModalStage,
				setAuthModalStage,
			}}
		>
			{children}
		</authModalContext.Provider>
	);
}

export default AuthModalContext;
