"use client";
import React from "react";
import { FaReddit } from "react-icons/fa";
import Search from "./Search";
import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { setAuthModalStage, setShowAuthModal } from "@/redux/actions";
import AuthModal from "../AuthModal/AuthModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase-config";
import ProfileDropdown from "./Dropdowns/ProfileDropdown";
import HomeDropdown from "./Dropdowns/HomeDropdown";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
	hidden: {
		y: -100,
		opacity: 0,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 50,
		},
	},
	show: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 50,
		},
	},
};

function Navbar() {
	const dispatch = useDispatch();

	const [user, loading] = useAuthState(auth);

	return (
		<>
			<AnimatePresence>
				<motion.div
					variants={variants}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="sticky top-0 z-20 flex w-full items-center bg-white p-2 shadow-md dark:bg-zinc-900"
				>
					<div className="flex items-center space-x-2">
						<Link href="/" className="flex items-center">
							<FaReddit className="h-10 w-10 text-black dark:text-white" />
							<img
								className="hidden w-[65px] md:flex"
								src="/reddit-text.svg"
								alt="icon"
							/>
						</Link>
					</div>
					<HomeDropdown />
					<Search />
					<div className="mx-2 flex items-center space-x-4">
						{user ? (
							<ProfileDropdown />
						) : (
							<div className="flex items-center space-x-2">
								<div
									onClick={() => {
										dispatch(setAuthModalStage("login"));
										dispatch(setShowAuthModal(true));
									}}
								>
									<Button
										className={
											"dark:hover:border-blue-500 w-32 mx-auto py-0 dark:hover:bg-blue-500 dark:hover:text-white"
										}
									>
										Login
									</Button>
								</div>
								<div
									onClick={() => {
										dispatch(setAuthModalStage("signUp"));
										dispatch(setShowAuthModal(true));
									}}
								>
									<Button
										outline
										className={
											"dark:hover:border-blue-500 w-32 mx-auto dark:hover:bg-blue-500 dark:hover:text-white"
										}
									>
										Sign Up
									</Button>
								</div>
							</div>
						)}
					</div>
				</motion.div>
			</AnimatePresence>
			<AuthModal />
		</>
	);
}

export default Navbar;
