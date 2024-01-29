import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase-config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setShowAuthModal, setUser } from "@/redux/actions";
import { doc, setDoc } from "firebase/firestore";
import { themeContext } from "@/darkmode/ThemeContext";

function GoogleProvider() {
	const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

	const dispatch = useDispatch();

	const { darkmode } = useContext(themeContext);

	async function handleSignInWithGoogle() {
		const data = await signInWithGoogle();
		if (data) {
			toast.info("Signed in succeessfully");
			dispatch(setShowAuthModal(false));

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

	return (
		<AnimatePresence>
			<motion.div
				initial={{ y: "-100" }}
				animate={{
					y: 0,
					transition: { type: "spring", stiffness: 400, damping: 50 },
				}}
				exit={{ y: "-100" }}
				className="absolute top-1 w-full px-2 sm:w-fit"
			>
				<button
					onClick={handleSignInWithGoogle}
					className="flex w-full items-center justify-center space-x-12 rounded-md border-gray-100 bg-white py-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white sm:mx-0 sm:w-[380px]"
				>
					{loading ? (
						<div
							className={
								darkmode
									? "spinner-white my-1.5"
									: "spinner-dark my-1.5"
							}
						/>
					) : (
						<>
							<FcGoogle className="h-8 w-8" />
							<p className="text-lg font-medium">
								Sign in with Google
							</p>
						</>
					)}
				</button>
			</motion.div>
		</AnimatePresence>
	);
}

export default GoogleProvider;
