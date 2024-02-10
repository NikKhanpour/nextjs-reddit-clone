"use client";
import React from "react";

function Button({ children, outline, className, disabled, loading }) {
	return (
		<>
			{outline ? (
				<button
					className={`border-2 border-blue-500  px-4 py-0.5 duration-300 hover:bg-blue-500 dark:border-blue-600 dark:bg-blue-600 rounded-full font-medium text-md disabled:bg-opacity-70 bg-transparent text-blue-500 dark:text-blue-500 dark:bg-transparent dark:hover:disabled:bg-transparent dark:hover:bg-blue-600 hover:text-white dark:hover:text-white disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:text-opacity-60 disabled:border-opacity-60 dark:disabled:text-opacity-60 dark:disabled:border-opacity-60 disabled:hover:text-blue-500 dark:disabled:hover:text-blue-500 dark:disabled:hover:text-opacity-60 disabled:hover:text-opacity-60
                    ${className && className}
                `}
					disabled={disabled || loading}
				>
					{loading ? (
						<div className="spinner mx-auto my-0.5" />
					) : (
						children
					)}
				</button>
			) : (
				<button
					className={`border-2 border-blue-500 bg-blue-500 px-4 py-0.5 duration-300 dark:border-blue-600 dark:bg-blue-600 rounded-full text-white font-medium text-md dark:hover:text-blue-500 hover:text-blue-500 disabled:bg-opacity-70  disabled:hover:bg-blue-600 disabled:hover:bg-opacity-70 hover:bg-transparent dark:hover:bg-transparent disabled:bg-transparent dark:disabled:bg-transparent disabled:hover:bg-transparent dark:disabled:hover:bg-transparent dark:disabled:text-blue-500 dark:disabled:text-opacity-60 dark:disabled:border-opacity-60 disabled:text-opacity-60 disabled:border-opacity-60 disabled:text-blue-500
                    ${className && className}
                    `}
					disabled={disabled || loading}
				>
					{loading ? (
						<div className="spinner mx-auto my-0.5" />
					) : (
						children
					)}
				</button>
			)}
		</>
	);
}

export default Button;
