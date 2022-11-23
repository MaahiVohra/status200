require("@nomiclabs/hardhat-waffle");

module.exports = {
	solidity: "0.8.2",
	networks: {
		goerli: {
			url: "https://eth-goerli.g.alchemy.com/v2/khrf9mtb_KAZ5uOXCqiJ4Gxvvckh7dFl",
			accounts: [
				"4468b2415a5b6ab28781d3e1a9ec93ef69a91ad37ef24133cd6d861df84cfce0",
			],
		},
	},
};
