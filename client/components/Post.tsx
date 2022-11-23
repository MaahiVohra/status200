import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { FiShare } from "react-icons/fi";
import { format } from "timeago.js";
import { useState } from "react";

const style = {
	wrapper: `flex p-3 border-b border-[#38444d]`,
	profileImage: `rounded-full h-[40px] w-[40px] object-cover`,
	postMain: `flex-1 px-4`,
	headerDetails: `flex items-center`,
	name: `font-bold mr-1`,
	verified: `text-[0.8rem]`,
	handleAndTimeAgo: `text-[#8899a6] text-sm`,
	tweet: `my-2`,
	image: `rounded-3xl`,
	footer: `flex justify-between mr-28 mt-4 text-[#8899a6]`,
	footerIcon: `rounded-full text-lg p-2`,
};

interface PostProps {
	displayName: string;
	userName: string;
	text: string;
	avatar: string;
	timestamp: string;
	isProfileImageNft: Boolean | undefined;
}

const Post = ({
	displayName,
	userName,
	text,
	avatar,
	timestamp,
	isProfileImageNft,
}: PostProps) => {
	const [profileImageLink] = useState(avatar);

	return (
		<div className="bg-[#393e46] p-10 mt-7 rounded-xl">
			<div className="flex gap-2 mb-5">
				<div>
					<img
						src={profileImageLink}
						alt={userName}
						className={
							isProfileImageNft
								? `${style.profileImage} smallHex`
								: style.profileImage
						}
					/>
				</div>
				<div className="">
					<div>
						<span className="flex items-center gap-2">
							<span className="font-semibold text-[#f2f2f2]">
								{displayName}
							</span>
							{isProfileImageNft && (
								<span className={style.verified}>
									<BsFillPatchCheckFill className="text-[#f2f2f2]" />
								</span>
							)}
						</span>
						<span className={style.handleAndTimeAgo}>
							@{userName} •{" "}
							{format(new Date(timestamp).getTime())}
						</span>
					</div>
				</div>
			</div>
			<div className="">
				<div>
					<div className="text-[#f2f2f2]">{text}</div>
					{/* <div className="">
						<div
							className={`${style.footerIcon} hover:text-[#1d9bf0] hover:bg-[#1e364a]`}
						>
							<FaRegComment />
						</div>
						<div
							className={`${style.footerIcon} hover:text-[#03ba7c] hover:bg-[#1b393b]`}
						>
							<FaRetweet />
						</div>
						<div
							className={`${style.footerIcon} hover:text-[#f91c80] hover:bg-[#39243c]`}
						>
							<AiOutlineHeart />
						</div>
						<div
							className={`${style.footerIcon} hover:text-[#1d9bf0] hover:bg-[#1e364a]`}
						>
							<FiShare />
						</div>
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default Post;
