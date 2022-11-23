import { useState, useContext } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import { BsCardImage, BsEmojiSmile } from "react-icons/bs";
import { RiFileGifLine, RiBarChartHorizontalFill } from "react-icons/ri";
import { IoMdCalendar } from "react-icons/io";
import { MdOutlineLocationOn } from "react-icons/md";
import { client } from "../../lib/client";

const style = {
	wrapper: `px-4 flex flex-row  pb-4`,
	tweetBoxLeft: `mr-4`,
	tweetBoxRight: `flex-1`,
	profileImage: `rounded-full h-[60px] w-[60px] object-cover`,
	inputField: `w-full h-full outline-none bg-transparent text-lg`,
	formLowerContainer: `flex`,
	iconsContainer: `text-[#1d9bf0] flex flex-1 items-center`,
	icon: `mr-2`,
	submitGeneral: `px-6 py-2 rounded-3xl font-bold `,
	inactiveSubmit: `bg-[#ee5f00] text-[#95999e]`,
	activeSubmit: `bg-[#f96d00] text-white`,
};

function TweetBox() {
	const [tweetMessage, setTweetMessage] = useState("");
	const { currentAccount, fetchTweets, currentUser } =
		useContext(TwitterContext);

	const submitTweet = async (event: any) => {
		event.preventDefault();

		if (!tweetMessage) return;
		const tweetId = `${currentAccount}_${Date.now()}`;

		const tweetDoc = {
			_type: "tweets",
			_id: tweetId,
			tweet: tweetMessage,
			timestamp: new Date(Date.now()).toISOString(),
			author: {
				_key: tweetId,
				_ref: currentAccount,
				_type: "reference",
			},
		};

		await client.createIfNotExists(tweetDoc);

		await client
			.patch(currentAccount)
			.setIfMissing({ tweets: [] })
			.insert("after", "tweets[-1]", [
				{
					_key: tweetId,
					_ref: tweetId,
					_type: "reference",
				},
			])
			.commit();

		await fetchTweets();
		setTweetMessage("");
	};

	return (
		<div className="flex gap-10 bg-[#393e46] p-5 rounded-xl">
			<div className="h-[60px] w-[70px]">
				<img
					src={currentUser.profileImage}
					className={
						currentUser.isProfileImageNft
							? `${style.profileImage} smallHex`
							: style.profileImage
					}
				/>
			</div>
			<div className="h-full w-full">
				<form>
					<textarea
						onChange={(e) => setTweetMessage(e.target.value)}
						value={tweetMessage}
						placeholder="What's happening?"
						className="h-full w-full outline-none pt-3 resize-none bg-[#393e46] text-white"
					/>
					<div className="flex justify-end m-2">
						{/* <div className="">
							<BsCardImage className="" />
							<RiFileGifLine className="" />
							<RiBarChartHorizontalFill className="" />
							<BsEmojiSmile className="" />
							<IoMdCalendar className="" />
							<MdOutlineLocationOn className="" />
						</div> */}
						<button
							type="submit"
							onClick={(event) => submitTweet(event)}
							disabled={!tweetMessage}
							className={`${style.submitGeneral} ${
								tweetMessage
									? style.activeSubmit
									: style.inactiveSubmit
							}`}
						>
							Post
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default TweetBox;
