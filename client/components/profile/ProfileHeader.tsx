import { useContext, useEffect, useState } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import { BsArrowLeftShort } from "react-icons/bs";
import { useRouter } from "next/router";
import Modal from "react-modal";
import ProfileImageMinter from "./mintingModal/ProfileImageMinter";
import { customStyles } from "../../lib/constants";

Modal.setAppElement("#__next");

const style = {
	wrapper: `border-[#38444d] border-b`,
	header: `py-1 px-3 mt-2 flex items-center`,
	primary: `bg-transparent outline-none font-bold`,
	secondary: `text-[#8899a6] text-xs`,
	backButton: `text-3xl cursor-pointer mr-2 rounded-full hover:bg-[#313b44] p-1`,
	coverPhotoContainer: `flex items-center justify-center h-[15vh] overflow-hidden`,
	coverPhoto: `object-cover h-full w-full`,
	profileImage: `object-cover rounded-full h-full`,
	profileImageNft: `object-cover h-full`,
	profileImageMint: `bg-white text-black px-3 py-1 rounded-full hover:bg-[#8899a6] cursor-pointer`,
	details: `px-3`,
	nav: `flex justify-around mt-4 mb-2 text-xs font-semibold text-[#8899a6]`,
	activeNav: `text-white`,
};

interface Tweets {
	tweet: string;
	timestamp: string;
}

interface UserData {
	name: string;
	profileImage: string;
	coverImage: string;
	walletAddress: string;
	tweets: Array<Tweets>;
	isProfileImageNft: Boolean | undefined;
}

const ProfileHeader = () => {
	const { currentAccount, currentUser } = useContext(TwitterContext);
	const router = useRouter();
	const [userData, setUserData] = useState<UserData>({
		name: "",
		profileImage: "",
		coverImage: "",
		walletAddress: "",
		tweets: [],
		isProfileImageNft: undefined,
	});

	useEffect(() => {
		if (!currentUser) return;

		setUserData({
			name: currentUser.name,
			profileImage: currentUser.profileImage,
			walletAddress: currentUser.walletAddress,
			coverImage: currentUser.coverImage,
			tweets: currentUser.tweets,
			isProfileImageNft: currentUser.isProfileImageNft,
		});
	}, [currentUser]);

	return (
		<div>
			<div className="top-0 z-10 p-4 flex items-center gap-2">
				<div
					onClick={() => router.push("/")}
					className={style.backButton}
				>
					<BsArrowLeftShort className="text-[#f2f2f2]" />
				</div>
				<div className={style.details}>
					<div className="text-2xl font-semibold text-[#f2f2f2]">
						{userData.name}
					</div>
					<div className={style.secondary}>
						{userData.tweets?.length} Tweets
					</div>
				</div>
			</div>
			<div className="bg-[#393e46] p-5 rounded-xl">
				{/* <div className={style.coverPhotoContainer}>
					{!userData.coverImage ?? (
						<img
							src={userData.coverImage}
							alt="cover"
							className={style.coverPhoto}
						/>
					)}
				</div> */}
				<div className="text-center">
					<div
						className={
							currentUser.isProfileImageNft
								? "m-auto hex"
								: "m-auto"
						}
					>
						<img
							src={userData.profileImage}
							alt={userData.walletAddress}
							className={
								currentUser.isProfileImageNft
									? style.profileImageNft
									: style.profileImage
							}
						/>
					</div>
					<div className=" my-5">
						<div>
							<div className="text-[#f2f2f2] text-2xl font-bold">
								{currentUser.name}
							</div>
						</div>
						<div className={style.secondary}>
							{currentAccount && (
								<>
									@{currentAccount.slice(0, 8)}...
									{currentAccount.slice(37)}
								</>
							)}
						</div>
					</div>
				</div>
				<div className="flex justify-around text-gray-500 font-semibold mt-10">
					<div className={style.activeNav}>Tweets</div>
					<div>Tweets & Replies</div>
					<div>Media</div>
					<div>Likes</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeader;
