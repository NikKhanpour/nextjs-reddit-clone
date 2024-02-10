"use client";
import React, { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { inputClasses } from "@/constants/inputClasses";
import Button from "../UI/Button/Button";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase-config";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { authModalContext } from "@/contexts/AuthModalContext";

const variants = {
	show: {
		x: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 40,
		},
	},
	hidden: {
		x: -400,
		opacity: 0,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 40,
		},
	},
};

function Login() {
	const { setShowAuthModal, authModalStage, setAuthModalStage } =
		useContext(authModalContext);

	const [signInWithEmailAndPassword, user, loading, error] =
		useSignInWithEmailAndPassword(auth);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	async function handleSignIn(e) {
		e.preventDefault();

		if (formData.email === "" || formData.password === "") {
			toast.error("All Fields Required");
			return;
		}

		const data = await signInWithEmailAndPassword(
			formData.email,
			formData.password
		);
		if (data) {
			setShowAuthModal(false);
			toast.info("Signed in successfully");

			const userDocRef = doc(firestore, "users", data.user.uid);
			await updateDoc(userDocRef, {
				lastLoginAt: data.user.metadata.lastLoginAt,
			});
		}
	}

	useEffect(() => {
		if (error?.message === "Firebase: Error (auth/invalid-credential).") {
			toast.error("Invalid Email or Password");
		}
	}, [error]);

	return (
		<AnimatePresence mode="popLayout">
			{authModalStage === "login" && (
				<motion.div
					variants={variants}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="h-full w-full rounded-md bg-white py-4 dark:bg-zinc-900 dark:text-white"
				>
					<div className="mx-8 flex flex-col">
						<header className="border-b pb-2 text-xl font-medium">
							Log in to your Account
						</header>
						<p className="py-2 text-sm font-light">
							By continuing, you agree to our{" "}
							<span className="text-blue-500 dark:text-blue-600">
								User Agreement
							</span>{" "}
							and acknowledge that you understand the{" "}
							<span className="text-blue-500 dark:text-blue-600">
								Privacy Policy
							</span>
						</p>
						<form
							onSubmit={handleSignIn}
							className="flex flex-col space-y-1"
						>
							<label htmlFor="email">Email</label>
							<input
								value={formData.email}
								type="email"
								placeholder="your email..."
								name="email"
								id="email"
								className={`${inputClasses}`}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										email: e.target.value,
									}))
								}
							/>
							<label htmlFor="password" className="pt-2">
								Password
							</label>
							<input
								value={formData.password}
								type="password"
								placeholder="your password..."
								name="password"
								id="password"
								className={`${inputClasses}`}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										password: e.target.value,
									}))
								}
							/>
							<p className="pb-1 pt-2 text-sm">
								Forgot your{" "}
								<span
									onClick={() => setAuthModalStage("forgot")}
									className="cursor-pointer text-blue-500 dark:text-blue-600"
								>
									Password?
								</span>
							</p>
							<p className="pb-2 text-sm">
								New to Reddit{" "}
								<span
									onClick={() => setAuthModalStage("signUp")}
									className="cursor-pointer text-blue-500 dark:text-blue-600"
								>
									Sign Up
								</span>
							</p>
							<Button
								loading={loading}
								className="mt-2 w-full rounded-md"
							>
								Log in
							</Button>
						</form>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default Login;
