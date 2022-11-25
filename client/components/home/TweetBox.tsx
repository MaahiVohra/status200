import { useState, useContext } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import { BsCardImage, BsEmojiSmile } from "react-icons/bs";
import { RiFileGifLine, RiBarChartHorizontalFill } from "react-icons/ri";
import { IoMdCalendar } from "react-icons/io";
import { MdOutlineLocationOn } from "react-icons/md";
import { client } from "../../lib/client";
import { paymentContractAddress } from "../../lib/constants";
const abi = require("../../lib/constants");
const paymentContractABI = abi.paymentContractABI;
import Web3 from "web3";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
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
		var to = paymentContractAddress;
		const web3 = createAlchemyWeb3(
			"https://eth-goerli.g.alchemy.com/v2/khrf9mtb_KAZ5uOXCqiJ4Gxvvckh7dFl"
		);
		// let web3 = new Web3(
		// 	new Web3.providers.HttpProvider(
		// 		"https://eth-goerli.g.alchemy.com/v2/khrf9mtb_KAZ5uOXCqiJ4Gxvvckh7dFl"
		// 	)
		// );
		let mycontract = new web3.eth.Contract(
			paymentContractABI,
			paymentContractAddress
		);
		const accurateTime = new Date(Date.now()).toISOString();

		try {
			await mycontract.methods
				.sendMessage(to, tweetMessage, accurateTime)
				.send({ from: currentAccount });
		} catch (err) {
			console.log("catch working");
			return;
		}

		// .send({ from: myaccount }), function (err, transcationHash) {
		// 	if (err) {
		// 		console.log(error);
		// 	} else {
		// 		var decoration =
		// 			'<div class="row justify-content-start">' +
		// 			'<div class="col-4 col-md-auto">' +
		// 			'<div class="alert alert-primary" role="alert">' +
		// 			message +
		// 			'<h6 style="font-size: 0.6em;">send ' +
		// 			accurateTime +
		// 			"</h6>" +
		// 			"</div>" +
		// 			"</div>" +
		// 			"</div>";
		// 		var buttonText = document.getElementById(
		// 			"groupinputbutton" + to
		// 		).innerHTML;
		// 		document
		// 			.getElementById("groupinputbutton" + to)
		// 			.remove();
		// 		//document.getElementById("button"+det.id).remove();
		// 		document.getElementById(
		// 			"messagepart" + to
		// 		).innerHTML += decoration;
		// 		document.getElementById(
		// 			"messagepart" + to
		// 		).innerHTML +=
		// 			'<div class="input-group mb-0" id="groupinputbutton' +
		// 			to +
		// 			'">' +
		// 			'<input type="text" class="form-control" placeholder="Type message" id="inputbutton' +
		// 			to +
		// 			'"aria-label="Recipien username" aria-describedby="button-addon2" />' +
		// 			'<button class="btn btn-warning" type="button" onclick=onSend(this) id="button' +
		// 			to +
		// 			'" style="padding-top: .55rem;">' +
		// 			"Send" +
		// 			"</button>" +
		// 			"</div>";
		// 		document
		// 			.getElementById("groupinputbutton" + to)
		// 			.scrollIntoView();
		// 	}
		// });
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
						<div>Post cooldown:</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default TweetBox;
