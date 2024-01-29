"use client";
import React, { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { inputClasses } from "@/constants/inputClasses";
import Button from "../Button/Button";
import {
	setAuthModalStage,
	setShowAuthModal,
	setUserData,
} from "@/redux/actions";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/firebase-config";

const variants = {
	show: {
		x: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 50,
		},
	},
	hidden: {
		x: 400,
		opacity: 0,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 50,
		},
	},
};

function SignUp() {
	const authModal = useSelector((state) => state.authModal);
	const dispatch = useDispatch();

	const [createUserWithEmailAndPassword, user, loading, error] =
		useCreateUserWithEmailAndPassword(auth);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		verifyPassword: "",
	});

	async function handleCreateUser(e) {
		e.preventDefault();
		if (
			formData.email === "" ||
			formData.password === "" ||
			formData.displayName === "" ||
			formData.verifyPassword === ""
		) {
			toast.error("All Fields Required");
			return;
		}
		if (formData.password !== formData.verifyPassword) {
			toast.error("Passwords Does Not Match");
			return;
		}

		const data = await createUserWithEmailAndPassword(
			formData.email,
			formData.password
		);
		if (data) {
			dispatch(setShowAuthModal(false));
			toast.info("Signed up successfully");

			dispatch(setUserData(data.user));

			const userDocRef = doc(firestore, "users", data.user.uid);
			await setDoc(userDocRef, {
				email: data.user.email,
				uid: data.user.uid,
				displayName: data.user.displayName,
				createdAt: data.user.metadata.createdAt,
				lastLoginAt: data.user.metadata.lastLoginAt,
				emailVerified: data.user.emailVerified,
			});
		}
	}

	useEffect(() => {
		if (
			error?.message ===
			"Firebase: Password should be at least 6 characters (auth/weak-password)."
		) {
			toast.error("Password should be at least 6 characters");
		} else if (
			error?.message === "Firebase: Error (auth/email-already-in-use)."
		) {
			toast.error("Email already in use");
		}
	}, [error]);

	return (
		<AnimatePresence mode="popLayout">
			{authModal.stage === "signUp" && (
				<motion.div
					variants={variants}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="h-full w-full rounded-md bg-white py-4 dark:bg-zinc-900 dark:text-white"
				>
					<div className="mx-8 flex flex-col">
						<header className="border-b pb-2 text-xl font-medium">
							Create a new Account
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
							onSubmit={handleCreateUser}
							className="flex flex-col space-y-3"
						>
							<input
								value={formData.email}
								className={`${inputClasses} px-2`}
								placeholder="Enter Your Email"
								type="email"
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										email: e.target.value,
									}))
								}
							/>
							<input
								value={formData.password}
								className={`${inputClasses} px-2`}
								placeholder="Create Password"
								type="password"
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										password: e.target.value,
									}))
								}
							/>
							<input
								value={formData.verifyPassword}
								className={`${inputClasses} px-2`}
								placeholder="Verify your Password"
								type="password"
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										verifyPassword: e.target.value,
									}))
								}
							/>
							<p className="text-sm">
								Already Reddited?{" "}
								<span
									onClick={() =>
										dispatch(setAuthModalStage("login"))
									}
									className="cursor-pointer text-blue-500 dark:text-blue-600"
								>
									Log in
								</span>
							</p>
							<Button
								loading={loading}
								className="w-full rounded-md"
							>
								Sign Up
							</Button>
						</form>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default SignUp;
