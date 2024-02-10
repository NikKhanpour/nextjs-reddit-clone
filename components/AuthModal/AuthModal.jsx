"use client";
import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleProvider from "./GoogleProvider";
import Login from "./Login";
import SignUp from "./SignUp";
import Forgot from "./Forgot";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase-config";
import { authModalContext } from "@/contexts/AuthModalContext";

function AuthModal() {
	const { showAuthModal, setShowAuthModal } = useContext(authModalContext);

	const [user] = useAuthState(auth);

	return (
		<AnimatePresence animate={showAuthModal ? "show" : "hidden"}>
			{!user && showAuthModal && (
				<motion.div
					id="backdrop"
					onClick={(e) =>
						e.target.id === "backdrop" && setShowAuthModal(false)
					}
					variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm"
				>
					<GoogleProvider />
					<div className="mx-2 flex h-fit w-full items-center justify-center sm:mx-0 sm:w-[380px]">
						<Login />
						<SignUp />
						<Forgot />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default AuthModal;
