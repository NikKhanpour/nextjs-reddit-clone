"use client";
import ThemeContext, { themeContext } from "@/contexts/ThemeContext";
import React, { createContext, useContext } from "react";
import AuthModalContext, { authModalContext } from "./AuthModalContext";
import PostsContext from "./PostsContext";
import CurrentCommunityContext from "./CurrentCommunityContext";
import CreateCommunityModalContext from "./CreateCommunityModalContext";
import CommentsContext from "./CommentsContext";
import UserDataContext from "./UserDataContext";

export const allContext = createContext();
function AllContext({ children }) {
	return (
		<ThemeContext>
			<AuthModalContext>
				<PostsContext>
					<CurrentCommunityContext>
						<CreateCommunityModalContext>
							<CommentsContext>
								<UserDataContext>{children}</UserDataContext>
							</CommentsContext>
						</CreateCommunityModalContext>
					</CurrentCommunityContext>
				</PostsContext>
			</AuthModalContext>
		</ThemeContext>
	);
}

export default AllContext;
