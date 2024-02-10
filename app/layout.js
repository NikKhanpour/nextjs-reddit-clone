import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import ReactToastify from "@/components/ReactToastify";
import AllContext from "@/contexts/AllContext";
import InitialStates from "@/components/InitialStates";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Reddit",
	description: "reddit clone app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AllContext>
					<InitialStates />
					<ReactToastify />
					<Navbar />
					{children}
				</AllContext>
			</body>
		</html>
	);
}
