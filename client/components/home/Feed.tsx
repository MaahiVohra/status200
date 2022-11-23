import { useContext, useEffect } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import TweetBox from "./TweetBox";
import Post from "../Post";
import { BsStars } from "react-icons/bs";

const style = {
	wrapper: `flex-[2]  overflow-y-scroll`,
	header: `sticky top-0 z-10 p-4 flex justify-between items-center mb-5`,
	headerTitle: `text-2xl font-semibold`,
};

interface Tweet {
	author: TweetAuthor;
	tweet: string;
	timestamp: string;
}

interface TweetAuthor {
	name: string;
	walletAddress: string;
	profileImage: string;
	isProfileImageNft: boolean;
}

function Feed() {
	const { tweets } = useContext(TwitterContext);

	return (
		<div className=" flex-[2] mt-6">
			<div className="top-0 z-10 p-4 flex items-center gap-2">
				<div className="text-2xl font-semibold text-[#f2f2f2]">
					Home
				</div>
				<BsStars className="text-[#f2f2f2]" />
			</div>
			<div className="bg-[#222831] p-7 rounded-2xl">
				<TweetBox />
				{tweets.map((tweet: Tweet, index: number) => (
					<Post
						key={index}
						displayName={
							tweet.author.name === "Unnamed"
								? `${tweet.author.walletAddress.slice(
										0,
										4
								  )}...${tweet.author.walletAddress.slice(41)}`
								: tweet.author.name
						}
						userName={`${tweet.author.walletAddress.slice(
							0,
							4
						)}...${tweet.author.walletAddress.slice(41)}`}
						text={tweet.tweet}
						avatar={tweet.author.profileImage}
						isProfileImageNft={tweet.author.isProfileImageNft}
						timestamp={tweet.timestamp}
					/>
				))}
			</div>
		</div>
	);
}

export default Feed;
