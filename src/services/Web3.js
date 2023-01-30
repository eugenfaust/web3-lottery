/* eslint-disable no-undef */
import Web3 from 'web3/dist/web3.min';
import moment from 'moment';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// Fix for ReferenceError: global is not defined
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min';
import Lottery from '../abi/lottery.json';
import Manager from '../abi/manager.json';
import Token from '../abi/token.json';
import chains from '../utils/chains';

export default class Web3Service {
  static infuraId = import.meta.env.VITE_INFURA_KEY;

  static nftContract = import.meta.env.VITE_NFT_CONTRACT;

  static managerContract = '0x9103B5CB0088F7ec4b35890D264B8B273b7ba925';

  static tokenContract = '0x006B5540cfB29d2BcFcE4BF70188C28d2159FF85';

  static managerAbi = Manager.abi;

  static tokenAbi = Token.abi;

  static lotteryAbi = Lottery.abi;

  // For testing purposes we use BSC
  static defaultChain = 97;

  // static currentProvider = Web3.givenProvider;
  static defaultNode = 'https://data-seed-prebsc-1-s3.binance.org:8545';

  static currentProvider = new Web3.providers.HttpProvider(this.defaultNode);

  static async createLottery(account, lotteryTitle, contractAddress) {
    const provider = this.getProvider().eth;
    const contract = new provider.Contract(
      this.managerAbi,
      this.managerContract,
    );
    return contract.methods
      .addLotteryInstance(lotteryTitle, contractAddress)
      .send({ from: account });
  }

  static async finishLottery(account, lotteryID) {
    const provider = this.getProvider().eth;
    const contract = new provider.Contract(
      this.managerAbi,
      this.managerContract,
    );
    return contract.methods
      .processLotteryToNext(lotteryID)
      .send({ from: account });
  }

  static async setTicketPrice(account, lotteryID, price) {
    const provider = this.getProvider().eth;
    const contract = new provider.Contract(
      this.managerAbi,
      this.managerContract,
    );
    return contract.methods
      .setTicketPrice(lotteryID, Web3.utils.toWei(String(price), 'ether'))
      .send({ from: account });
  }

  static getManager() {
    const provider = this.getProvider().eth;
    return new provider.Contract(this.managerAbi, this.managerContract);
  }

  static getUSDT() {
    const provider = this.getProvider().eth;
    return new provider.Contract(this.tokenAbi, this.tokenContract);
  }

  static getLotteryContract(lotteryContract) {
    const provider = this.getProvider().eth;
    return new provider.Contract(this.lotteryAbi, lotteryContract);
  }

  static async mintUSDT(account, count) {
    const token = this.getUSDT();
    return token.methods
      .mint(account, Web3.utils.toWei(String(count), 'ether'))
      .send({ from: account });
  }

  static async setDuration(account, lotteryID, duration) {
    const provider = this.getProvider().eth;
    const contract = new provider.Contract(
      this.managerAbi,
      this.managerContract,
    );
    return contract.methods
      .setDuration(lotteryID, duration)
      .send({ from: account });
  }

  static async getFinishedLotteries(account) {
    this.changeChain(this.defaultChain);
    const manager = this.getManager();
    const lotteries = await manager.methods.getLotteryInstances().call();
    const finishedLotteries = [];
    await Promise.all(
      lotteries.map(async (value) => {
        const address = await manager.methods.lotteryContracts(value).call();
        const title = await manager.methods.lotteryTitles(value).call();
        const lotteryContract = this.getLotteryContract(address);
        const lotteryInnerId = await lotteryContract.methods
          .currentLotteryID()
          .call();
        for (let i = 1; i < lotteryInnerId; i += 1) {
          const info = await this.getLotteryInfo(address, account, i);
          finishedLotteries.push({
            title: `${title} #${i}`,
            address,
            ...info,
          });
        }
      }),
    );
    return finishedLotteries;
  }

  static async getLotteries(account) {
    this.changeChain(this.defaultChain);
    const contract = this.getManager();
    const lotteries = await contract.methods.getLotteryInstances().call();
    const fullLotteries = [];
    const blockNumber = parseInt(
      await ethereum.request({ method: 'eth_blockNumber' }),
      16,
    );
    await Promise.all(
      lotteries.map(async (id) => {
        const title = await contract.methods.lotteryTitles(id).call();
        const address = await contract.methods.lotteryContracts(id).call();
        const info = await this.getLotteryInfo(address, account);
        const estimatedTime = (Number(info.startBlocks)
            + Number(info.duration)
            - Number(blockNumber))
          * 3; // time in seconds
        fullLotteries.push({
          id,
          title,
          address,
          estimatedTime: moment().add(estimatedTime, 'seconds').fromNow(),
          ...info,
        });
      }),
    );
    fullLotteries.sort((a, b) => a.id - b.id); // b - a for reverse sort

    return fullLotteries;
  }

  static async getLotteryInfo(contract, account, lotteryID = -1) {
    let lotteryContract;
    if (typeof contract === 'string') {
      lotteryContract = this.getLotteryContract(contract);
    } else {
      lotteryContract = contract;
    }
    let players;
    if (lotteryID === -1) {
      players = await lotteryContract.methods.getCurrentPlayerList().call();
    } else {
      players = await lotteryContract.methods
        .getPlayerCounterByLottery(lotteryID)
        .call();
    }
    let lotteryInnerId;
    if (lotteryID === -1) {
      lotteryInnerId = await lotteryContract.methods.currentLotteryID().call();
    } else {
      lotteryInnerId = lotteryID;
    }
    const prizePool = Web3.utils.fromWei(
      lotteryID === -1
        ? await lotteryContract.methods.prizePool().call()
        : await lotteryContract.methods
          .getPrizePoolByLottery(lotteryInnerId)
          .call(),
      'ether',
    );
    let winners;
    let status;
    if (typeof account !== 'undefined') {
      winners = Web3.utils.fromWei(
        await lotteryContract.methods.winnings(lotteryInnerId, account).call(),
        'ether',
      );
      if (lotteryID === -1) {
        status = players.find(
          (value) => value.toLowerCase() === account.toLowerCase(),
        );
      }
    } else {
      status = false;
      winners = 0;
    }
    const ticketPrice = Web3.utils.fromWei(
      await lotteryContract.methods.ticketPrice().call(),
      'ether',
    );
    const startBlocks = await lotteryContract.methods
      .startBlocks(lotteryInnerId)
      .call();
    const duration = await lotteryContract.methods.duration().call();
    const percentWinners = await lotteryContract.methods.percentageOfWinners().call();
    return {
      players,
      percentWinners,
      lotteryInnerId,
      prizePool,
      winners,
      duration,
      ticketPrice,
      status,
      startBlocks,
    };
  }

  static async spawnLottery(account) {
    const manager = this.getManager();
    return manager.methods.spawnNewLottery(3).send({ from: account });
  }

  static async buyTicket(account, lotteryContract, lotteryId) {
    const provider = this.getProvider().eth;
    const contract = new provider.Contract(
      this.managerAbi,
      this.managerContract,
    );
    const tokenRequest = new provider.Contract(Token.abi, this.tokenContract);
    const tokenRes = await tokenRequest.methods
      .allowance(account, this.managerContract)
      .call();
    // eslint-disable-next-line eqeqeq
    if (tokenRes == 0) {
      await tokenRequest.methods
        .approve(
          this.managerContract,
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        )
        .send({ from: account });
    }
    const response = await contract.methods
      .getaTicket(lotteryId)
      .send({ from: account });
    return response.status;
  }

  static async buyNFT(account) {
    let nftContract = this.getProvider().eth;
    nftContract = new nftContract.Contract(this.abi, this.nftContract);
    return nftContract.methods.mint().send({ from: account });
  }

  static async setBaseURI(account) {
    let nftContract = this.getProvider().eth;
    nftContract = new nftContract.Contract(this.abi, this.nftContract);
    return nftContract.methods
      .setNewBaseUri(import.meta.env.VITE_IPFS_BASE_URI)
      .send({ from: account });
  }

  static async getURI(tokenID) {
    let nftContract = this.getProvider().eth;
    nftContract = new nftContract.Contract(this.abi, this.nftContract);
    return nftContract.methods.tokenURI(tokenID).call();
  }

  static async walletConnect() {
    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
      infuraId: this.infuraId,
    });
    //  Enable session (triggers QR Code modal)
    await provider.enable();
    //  Create Web3 instance
    this.currentProvider = provider;
    const web3 = this.getProvider();
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  }

  static getProvider(_provider = this.currentProvider) {
    return new Web3(_provider);
  }

  static async getWallet() {
    if (typeof window.ethereum !== 'undefined') {
      let provider = window.ethereum;
      let accounts = await ethereum.request({ method: 'eth_accounts' });

      if (!accounts[0]) {
        provider = new WalletConnectProvider({
          infuraId: this.infuraId,
          qrcode: false,
        });
        await provider.enable();
        accounts = provider.accounts;
      }
      this.currentProvider = provider;
      return accounts[0] ? accounts[0] : '';
    }
    return undefined;
  }

  static getWalletType() {
    if (this.currentProvider.isMetaMask) {
      return 'metamask';
    }
    if (this.currentProvider.isCoinbaseWallet) {
      return 'coinbase';
    }
    return 'walletconnect';
  }

  static async getChainId() {
    return this.getProvider().eth.getChainId();
  }

  static async changeChain(chainId) {
    if (this.getChainId() === chainId) {
      return true;
    }
    const provider = window.ethereum;
    const hexChain = `0x${chainId.toString(16)}`;
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: hexChain,
          },
        ],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4001) {
        return true;
      }
      const chain = chains.find((el) => el.id === chainId);
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: hexChain,
              chainName: chain.title,
              rpcUrls: chain.rpcUrls,
              nativeCurrency: chain.nativeCurrency,
            },
          ],
        });
        return true;
      } catch (error) {
        return error.message;
      }
    }
  }

  static onChainChange(callback) {
    this.currentProvider.on('chainChanged', callback);
  }

  static onAccountChange(callback) {
    this.currentProvider.on('accountsChanged', callback);
  }

  static async connectWallet(walletType = 'metamask') {
    if (walletType === 'injected') {
      return this.getWallet();
    }
    if (typeof window.ethereum !== 'undefined') {
      if (walletType === 'walletconnect') {
        return this.walletConnect();
      }
      let provider = window.ethereum;
      if (walletType !== 'injected') {
        if (
          !(provider.isMetaMask && walletType === 'metamask')
          && !(provider.isCoinbaseWallet && walletType === 'coinbase')
        ) {
          provider = undefined;
        }
        // edge case if MM and CBW are both installed
        if (window.ethereum.providers?.length) {
          window.ethereum.providers.forEach(async (p) => {
            if (p.isMetaMask && walletType === 'metamask') provider = p;
            else if (p.isCoinbaseWallet && walletType === 'coinbase') {
              provider = p;
            }
          });
        }
      }

      if (provider === undefined) {
        return undefined;
      }
      const account = (
        await provider.request({ method: 'eth_requestAccounts' })
      )[0];
      this.currentProvider = provider;
      this.changeChain(this.defaultChain);
      return account;
    }
    return undefined;
  }

  static async balanceOf(account) {
    const contract = this.getUSDT();
    return Web3.utils.fromWei(await contract.methods.balanceOf(account).call(), 'ether');
  }

  static async getBalance(account) {
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [account, 'latest'],
    });
    return Web3.utils.fromWei(balance, 'ether');
  }
}
