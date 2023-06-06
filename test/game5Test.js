const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();
    const threshold = BigInt(0x00ffffffffffffffffffffffffffffffffffffff);
    let accountWithEth = ethers.provider.getSigner(0);
    let found = false;
    let addressMatch;

    while (!found) {
      let account = ethers.Wallet.createRandom();
      let accountWallet = account.connect(ethers.provider);

      let address = await accountWallet.getAddress();
      console.log(address);
      if (BigInt(address) < threshold) {
        await accountWithEth.sendTransaction({
          to: address,
          value: ethers.utils.parseEther("1"),
        });
        addressMatch = accountWallet;
        found = true;
      }
    }

    return { game, addressMatch };
  }
  it("should be a winner", async function () {
    const { game, addressMatch } = await loadFixture(
      deployContractAndSetVariables
    );

    // good luck

    console.log(addressMatch);

    await game.connect(addressMatch).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
