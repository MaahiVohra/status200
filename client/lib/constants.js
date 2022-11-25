import ProfileImageMinterContractAbi from "./ProfileImageNfts.json";
import Payment from "./Payment.json";

export const contractABI = ProfileImageMinterContractAbi.abi;
export const contractAddress = "0x1245906845ba5aAB98a2086770798DdC8c1A0DA8";
export const paymentContractABI = Payment.abi;
export const paymentContractAddress =
	"0xA150D216420C2F8271b6ca77520bc34D052F88d3";

export const customStyles = {
	content: {
		top: "30%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		transform: "translate(-50%, -50%)",
		backgroundColor: "",
		padding: 0,
		border: "none",
	},
	overlay: {
		backgroundColor: "#334250a7",
	},
};
