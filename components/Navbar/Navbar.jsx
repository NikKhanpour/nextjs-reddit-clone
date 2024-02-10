"use client";
import React, { useContext } from "react";
import { FaReddit } from "react-icons/fa";
import Search from "./Search";
import Button from "../UI/Button/Button";
import AuthModal from "../AuthModal/AuthModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase-config";
import ProfileDropdown from "./Dropdowns/ProfileDropdown";
import HomeDropdown from "./Dropdowns/HomeDropdown";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { authModalContext } from "@/contexts/AuthModalContext";
import Image from "next/image";

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
	const { setShowAuthModal, setAuthModalStage } =
		useContext(authModalContext);

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
						<Link
							href="/"
							className="flex w-[30px] items-center md:w-[80px]"
						>
							<Image
								src="/reddit-logo.svg"
								alt="logo"
								width="30"
								height="30"
							/>
							<Image
								width="50"
								height="50"
								className="ms-2 hidden md:flex"
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
										setShowAuthModal(true);
										setAuthModalStage("login");
									}}
								>
									<Button
										className={
											"dark:hover:border-blue-500 w-24 md:w-32 mx-auto py-0 dark:hover:bg-blue-500 dark:hover:text-white"
										}
									>
										Login
									</Button>
								</div>
								<div
									onClick={() => {
										setShowAuthModal(true);
										setAuthModalStage("signUp");
									}}
									className="hidden lg:flex"
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
