"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { inputClasses } from "@/constants/inputClasses";
import Button from "../Button/Button";
import { setAuthModalStage } from "@/redux/actions";
import { toast } from "react-toastify";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "@/firebase-config";

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

function Forgot() {
	const authModal = useSelector((state) => state.authModal);
	const dispatch = useDispatch();

	const [email, setEmail] = useState("");

	const [sendPasswordResetEmail, sending, error] =
		useSendPasswordResetEmail(auth);

	async function handleForgotPassword(e) {
		e.preventDefault();
		if (email === "") {
			toast.error("Please enter your email");
			return;
		}
		await sendPasswordResetEmail(email);
		toast.info("Reset Password Link Sent");
		dispatch(setAuthModalStage("login"));
	}

	useEffect(() => {
		if (error) {
			toast.error("something went wrong");
		}
	}, [error]);

	return (
		<AnimatePresence mode="popLayout">
			{authModal.stage === "forgot" && (
				<motion.div
					variants={variants}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="h-full w-full rounded-md bg-white py-4 dark:bg-zinc-900 dark:text-white"
				>
					<div className="mx-8 flex flex-col">
						<header className="border-b pb-2 text-xl font-medium">
							Recover Your Account
						</header>
						<p className="py-2">
							Tell us the{" "}
							<span className="text-blue-500 dark:text-blue-600">
								Email
							</span>{" "}
							address associated with your Reddit account, and
							we’ll send you an email with a link to reset your
							password.
						</p>
						<form
							onSubmit={handleForgotPassword}
							className="spacepy-3 flex flex-col"
						>
							<label htmlFor="email" className="py-2">
								Email
							</label>
							<input
								value={email}
								className={`${inputClasses}`}
								onChange={(e) => setEmail(e.target.value)}
								type="email"
								placeholder="Your Email Account"
								name="email"
								id="email"
							/>
							<p className="py-3 text-sm">
								Back to{" "}
								<span
									onClick={() =>
										dispatch(setAuthModalStage("login"))
									}
									className="cursor-pointer text-blue-500 dark:text-blue-600"
								>
									Login
								</span>
							</p>
							<Button
								loading={sending}
								className="w-full rounded-md"
							>
								Recover
							</Button>
						</form>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default Forgot;
