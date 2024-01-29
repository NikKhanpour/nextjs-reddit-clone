import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import ReduxProvider from "@/redux/ReduxProvider";
import ReactToastify from "@/components/ReactToastify";
import ThemeContext from "@/darkmode/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Reddit",
	description: "reddit clone app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ReduxProvider>
					<ThemeContext>
						<ReactToastify />
						<Navbar />
						{children}
					</ThemeContext>
				</ReduxProvider>
			</body>
		</html>
	);
}
