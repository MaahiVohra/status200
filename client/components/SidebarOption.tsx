import { Dispatch, SetStateAction } from "react";
import { IconType } from "react-icons";
import { useRouter } from "next/router";

const style = {
	wrapper: `w-min flex items-center rounded-[100px] p-4 cursor-pointer hover:bg-gray-100 transition-all hover:duration-200 hover:ease-in-out`,
	iconContainer: `text-xl mr-4`,
	textGeneral: `font-medium`,
	textActive: `font-bold`,
};

interface SidebarOptionProps {
	text: String;
	Icon: IconType;
	isActive?: Boolean;
	setSelected?: Dispatch<SetStateAction<String>>;
	redirect?: URL | string;
}

function SidebarOption({
	text,
	Icon,
	isActive,
	setSelected,
	redirect,
}: SidebarOptionProps) {
	const router = useRouter();

	const handleClick = (buttonText = text) => {
		if (buttonText !== "More" && setSelected) {
			setSelected(buttonText);
		} else return;
	};

	return (
		<div
			className="p-5 flex py-5 hover:bg-[#222831] hover:cursor-pointer mb-5 rounded-lg text-[#f2f2f2]"
			onClick={() => {
				handleClick(text);
				if (redirect) {
					router.push(redirect);
				} else return;
			}}
		>
			<div className={style.iconContainer}>
				<Icon />
			</div>
			<div
				className={`${isActive ? style.textActive : style.textGeneral}`}
			>
				{text}
			</div>
		</div>
	);
}

export default SidebarOption;
