"use client";
import Button from "@/components/UI/Button/Button";
import { BiSolidCheckShield } from "react-icons/bi";
import { motion } from "framer-motion";

const variants = {
	hidden: {
		y: 200,
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

function TryPremium() {
	return (
		<motion.div
			variants={variants}
			initial="hidden"
			animate="show"
			exit="hidden"
			className="relative mt-4 flex flex-col rounded-md border border-gray-100 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div className="flex items-center space-x-4">
				<BiSolidCheckShield className="h-10 w-10 text-orange-600" />
				<div className="flex flex-col">
					<p className="mt-4 font-semibold">Reddit Premium</p>
					<p>The best Reddit experience, with monthly coins</p>
				</div>
			</div>
			<Button className="mt-4 w-full border-orange-600 bg-orange-600 hover:text-orange-600 dark:border-orange-600 dark:bg-orange-600 dark:hover:border-orange-600 dark:hover:text-orange-600">
				Try Now
			</Button>
		</motion.div>
	);
}

export default TryPremium;
