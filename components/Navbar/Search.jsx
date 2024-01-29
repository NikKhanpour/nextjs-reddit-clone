import React from "react";
import { IoIosSearch } from "react-icons/io";

function Search() {
	return (
		<div className="relative w-full">
			<input
				type="text"
				className="w-full rounded-full border border-gray-300 bg-gray-200 px-10 py-1 outline-none duration-200 focus:border-gray-300 focus:bg-gray-100 focus:shadow-xl dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-500 dark:focus:bg-zinc-800"
				placeholder="Search Reddit"
			/>
			<IoIosSearch className="absolute left-2 top-[5px] h-6 w-6 text-gray-400" />
		</div>
	);
}

export default Search;
