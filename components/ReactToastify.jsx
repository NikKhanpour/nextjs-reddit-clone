"use client";
import React, { useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Zoom } from "react-toastify";
import { themeContext } from "@/contexts/ThemeContext";

function ReactToastify() {
	const { darkmode } = useContext(themeContext);
	return (
		<div>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme={darkmode ? "dark" : "light"}
				transition={Zoom}
			/>
		</div>
	);
}

export default ReactToastify;
