"use client";
import Button from "@/components/Button/Button";
import { setCreateCommunityModal } from "@/redux/actions";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

const variants = (delay) => {
	return {
		hidden: {
			y: 100,
			opacity: 0,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 50,
				delay,
			},
		},
		show: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 50,
				delay,
			},
		},
	};
};

function CommunityNotFound() {
	const dispatch = useDispatch();

	return (
		<div className="mt-52 flex w-full flex-col items-center space-y-6 px-4 text-center">
			<AnimatePresence mode="wait">
				<motion.h2
					variants={variants(0.4)}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="text-xl"
				>
					Sorry, there aren’t any communities on Reddit with that
					name.
				</motion.h2>
				<motion.h4
					variants={variants(0.6)}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="text-sm"
				>
					This community may have been banned or the community name is
					incorrect.
				</motion.h4>
				<motion.div
					variants={variants(0.8)}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="flex items-center space-x-4 pt-8"
				>
					<div
						onClick={() => dispatch(setCreateCommunityModal(true))}
					>
						<Button outline className="font-semibold">
							Create Community
						</Button>
					</div>
					<Link href="/">
						<Button className="font-semibold">GO HOME</Button>
					</Link>
				</motion.div>
				<motion.p
					variants={variants(1)}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="w-full pt-40 text-center text-xs text-black text-opacity-40 dark:text-white dark:text-opacity-40 md:w-1/2 lg:w-1/3"
				>
					Use of this site constitutes acceptance of our User
					Agreement and Privacy Policy. Reddit, Inc. © 2024. All
					rights reserved. REDDIT and the ALIEN Logo are registered
					trademarks of reddit inc.
				</motion.p>
			</AnimatePresence>
		</div>
	);
}

export default CommunityNotFound;
