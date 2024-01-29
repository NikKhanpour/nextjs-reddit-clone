"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleProvider from "./GoogleProvider";
import { useDispatch, useSelector } from "react-redux";
import { setShowAuthModal } from "@/redux/actions";
import Login from "./Login";
import SignUp from "./SignUp";
import Forgot from "./Forgot";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase-config";

function AuthModal() {
	const dispatch = useDispatch();
	const authModal = useSelector((state) => state.authModal);

	const [user] = useAuthState(auth);

	return (
		<AnimatePresence animate={authModal.show ? "show" : "hidden"}>
			{!user && authModal.show && (
				<motion.div
					id="backdrop"
					onClick={(e) =>
						e.target.id === "backdrop" &&
						dispatch(setShowAuthModal(false))
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
