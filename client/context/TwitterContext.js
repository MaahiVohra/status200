import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { client } from "../lib/client";
import { paymentContractAddress } from "../lib/constants";
const abi = require("../lib/constants");
const paymentContractABI = abi.paymentContractABI;
import Web3 from "web3";
export const TwitterContext = createContext();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
export const TwitterProvider = ({ children }) => {
	const [appStatus, setAppStatus] = useState("");
	const [currentAccount, setCurrentAccount] = useState("");
	const [currentUser, setCurrentUser] = useState({});
	const [tweets, setTweets] = useState([]);
	const router = useRouter();

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	useEffect(() => {
		if (!currentAccount && appStatus == "connected") return;
		getCurrentUserDetails(currentAccount);
		fetchTweets();
	}, [currentAccount, appStatus]);

	/**
	 * Checks if there is an active wallet connection
	 */
	const checkIfWalletIsConnected = async () => {
		if (!window.ethereum) return setAppStatus("noMetaMask");
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_accounts",
			});
			if (addressArray.length > 0) {
				setAppStatus("connected");
				setCurrentAccount(addressArray[0]);

				createUserAccount(addressArray[0]);
			} else {
				router.push("/");
				setAppStatus("notConnected");
			}
		} catch (err) {
			router.push("/");
			setAppStatus("error");
		}
	};

	/**
	 * Initiates MetaMask wallet connection
	 */
	const connectWallet = async () => {
		if (!window.ethereum) return setAppStatus("noMetaMask");
		try {
			setAppStatus("loading");

			const addressArray = await window.ethereum.request({
				method: "eth_requestAccounts",
			});

			if (addressArray.length > 0) {
				setCurrentAccount(addressArray[0]);
				createUserAccount(addressArray[0]);
			} else {
				router.push("/");
				setAppStatus("notConnected");
			}
		} catch (err) {
			setAppStatus("error");
		}
	};

	/**
	 * Creates an account in Sanity DB if the user does not already have one
	 * @param {String} userAddress Wallet address of the currently logged in user
	 */
	const createUserAccount = async (userAddress = currentAccount) => {
		if (!window.ethereum) return setAppStatus("noMetaMask");
		try {
			const userDoc = {
				_type: "users",
				_id: userAddress,
				name: "Unnamed",
				isProfileImageNft: false,
				profileImage:
					"https://about.twitter.com/content/dam/about-twitter/en/brand-toolkit/brand-download-img-1.jpg.twimg.1920.jpg",
				walletAddress: userAddress,
			};

			await client.createIfNotExists(userDoc);

			setAppStatus("connected");
		} catch (error) {
			router.push("/");
			setAppStatus("error");
		}
	};

	/**
	 * Generates NFT profile picture URL or returns the image URL if it's not an NFT
	 * @param {String} imageUri If the user has minted a profile picture, an IPFS hash; if not then the URL of their profile picture
	 * @param {Boolean} isNft Indicates whether the user has minted a profile picture
	 * @returns A full URL to the profile picture
	 */
	const getNftProfileImage = async (imageUri, isNft) => {
		// if (isNft) {
		// 	return `https://gateway.pinata.cloud/ipfs/${imageUri}`;
		// } else if (!isNft) {
		// 	return imageUri;
		// }
		return `https://gateway.pinata.cloud/ipfs/${imageUri}`;
	};

	/**
	 * Gets all the tweets stored in Sanity DB.
	 */
	const fetchTweets = async () => {
		// var id = "messagepart" + a.id;
		console.log(paymentContractABI);
		const web3 = createAlchemyWeb3(
			"https://eth-goerli.g.alchemy.com/v2/khrf9mtb_KAZ5uOXCqiJ4Gxvvckh7dFl"
		);
		// let web3 = new Web3(
		// 	new Web3.providers.HttpProvider(
		// 		"https://eth-goerli.g.alchemy.com/v2/khrf9mtb_KAZ5uOXCqiJ4Gxvvckh7dFl"
		// 	)
		// );
		const mycontract = new web3.eth.Contract(
			paymentContractABI,
			paymentContractAddress
		);

		// await mycontract.getPastEvents(
		// 	"message",
		// 	{
		// 		fromBlock: 0,
		// 		toBlock: "latest",
		// 	},
		// 	function (err, data) {
		// 		console.log(data);
		// 		if (data.length > 0) {
		// 			data.returnValues.map((item) => {
		// 				// if (item.author.isProfileImageNft) {
		// 				const newItem = {
		// 					tweet: item.message,
		// 					timestamp: item.timestamp,
		// 					author: {
		// 						name: "Maahi",
		// 						walletAddress: currentAccount,
		// 						profileImage: null,
		// 						isProfileImageNft: true,
		// 						// name: item.author.name,
		// 						// walletAddress: item.author.walletAddress,
		// 						// profileImage: profileImageUrl,
		// 						// isProfileImageNft: item.author.isProfileImageNft,
		// 					},
		// 				};
		// let x = data.length;
		// document.getElementById(id).innerHTML = "";
		// for (var n = 0; n < x; n++) {
		// 	var timestamp = 0;

		// 	if (data[n].returnValues.from == a.id) {
		// 		if (data[n].returnValues.to == myaccount) {
		// 			var timestamp = data[n].returnValues.time;
		// 			var decoration =
		// 				'<div class="row justify-content-end">' +
		// 				'<div class="col-4 col-md-auto">' +
		// 				'<div class="alert alert-dark" role="alert">' +
		// 				data[n].returnValues.message +
		// 				'<h6 style="font-size: 0.6em;">recieved ' +
		// 				data[n].returnValues.timestamp +
		// 				"</h6>" +
		// 				"</div>" +
		// 				"</div>" +
		// 				"</div>";
		// 			document.getElementById(id).innerHTML +=
		// 				decoration;
		// 		}
		// 	}
		// 	if (data[n].returnValues.to == a.id) {
		// 		if (data[n].returnValues.from == myaccount) {
		// 			var timestamp = data[n].returnValues.time;

		// 			var decoration =
		// 				'<div class="row justify-content-start">' +
		// 				'<div class="col-4 col-md-auto">' +
		// 				'<div class="alert alert-primary" role="alert">' +
		// 				data[n].returnValues.message +
		// 				'<h6 style="font-size: 0.6em;">send ' +
		// 				data[n].returnValues.timestamp +
		// 				"</h6>" +
		// 				"</div>" +
		// 				"</div>" +
		// 				"</div>";
		// 			document.getElementById(id).innerHTML +=
		// 				decoration;
		// 		}
		// 		//console.log('FROM:'+data[n].returnValues.from+'--'+data[n].returnValues.message+'--'+data[n].returnValues.to);
		// 	}
		// }
		// document.getElementById(id).innerHTML +=
		// 	'<div class="input-group mb-0" id="groupinputbutton' +
		// 	a.id +
		// 	'">' +
		// 	'<input type="text" class="form-control" placeholder="Type message" id="inputbutton' +
		// 	a.id +
		// 	'"aria-label="Recipien username" aria-describedby="button-addon2" />' +
		// 	'<button class="btn btn-warning" type="button" onclick=onSend(this) id="button' +
		// 	a.id +
		// 	'" style="padding-top: .55rem;">' +
		// 	"Send" +
		// 	"</button>" +
		// 	"</div>";
		// });
		const query = `
					  *[_type == "tweets"]{
					    "author": author->{name, walletAddress, profileImage, isProfileImageNft},
					    tweet,
					    timestamp
					  }|order(timestamp desc)
					`;

		setTweets(await client.fetch(query));

		const sanityResponse = await client.fetch(query);

		setTweets([]);

		/**
		 * Async await not available with for..of loops.
		 */
		sanityResponse.forEach(
			async (item) => {
				const profileImageUrl = await getNftProfileImage(
					item.author.profileImage,
					item.author.isProfileImageNft
				);

				// if (item.author.isProfileImageNft) {
				const newItem = {
					tweet: item.tweet,
					timestamp: item.timestamp,
					author: {
						name: item.author.name,
						walletAddress: item.author.walletAddress,
						profileImage: profileImageUrl,
						isProfileImageNft: item.author.isProfileImageNft,
					},
				};
				setTweets((prevState) => [...prevState, newItem]);

				// } else {
				// 	setTweets((prevState) => [...prevState, item]);
				// }
			}
			// }
		);
	};

	/**
	 * Gets the current user details from Sanity DB.
	 * @param {String} userAccount Wallet address of the currently logged in user
	 * @returns null
	 */
	const getCurrentUserDetails = async (userAccount = currentAccount) => {
		if (appStatus !== "connected") return;

		const query = `
      *[_type == "users" && _id == "${userAccount}"]{
        "tweets": tweets[]->{timestamp, tweet}|order(timestamp desc),
        name,
        profileImage,
        isProfileImageNft,
        coverImage,
        walletAddress
      }
    `;
		const response = await client.fetch(query);

		const profileImageUri = await getNftProfileImage(
			response[0].profileImage,
			response[0].isProfileImageNft
		);

		setCurrentUser({
			tweets: response[0].tweets,
			name: response[0].name,
			profileImage: profileImageUri,
			walletAddress: response[0].walletAddress,
			coverImage: response[0].coverImage,
			isProfileImageNft: response[0].isProfileImageNft,
		});
	};

	return (
		<TwitterContext.Provider
			value={{
				appStatus,
				currentAccount,
				connectWallet,
				tweets,
				fetchTweets,
				setAppStatus,
				getNftProfileImage,
				currentUser,
				getCurrentUserDetails,
			}}
		>
			{children}
		</TwitterContext.Provider>
	);
};
