import { firestore } from "@/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import CommunityPage from "./CommunityPage";
import CommunityNotFound from "./CommunityNotFound";

async function getCommunity(id) {
	const communityDocRef = doc(firestore, "communities", id);
	const community = await getDoc(communityDocRef);
	if (community.exists()) {
		return community.data();
	} else {
		return null;
	}
}

async function page({ params }) {
	const communtiy = await getCommunity(params.communityId);
	if (communtiy) {
		return <CommunityPage community={communtiy} />;
	} else {
		return <CommunityNotFound />;
	}
}

export default page;
