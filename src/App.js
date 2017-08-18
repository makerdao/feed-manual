import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';

const web3 = new Web3();

class App extends Component {

  constructor() {
    super();
    this.state = {
      account: null
    }
    setTimeout(() => {
      web3.setProvider(window.web3.currentProvider || 'http://localhost:8545');
      window.web3 = web3;
    }, 500);
  }

  render() {
    return (
      <div>
        <h1>Running a price feed</h1>
        <p>
          You will need an Ethereum client like Parity or Geth running with an unlocked account.
        </p>
        <p>You'll also need Node 6 or above.</p>
        <h2>Installing DappHub's development tools</h2>
        <pre>
          curl https://nixos.org/nix/install | sh<br/>
          nix-channel --add https://nix.dapphub.com/pkgs/dapphub<br/>
          nix-channel --update<br/>
          nix-env -iA dapphub.{'{dapp,seth,solc}'}<br/>
        </pre>
        <p>
          More info at <a target="_blank" rel="noopener noreferrer" href="http://dapp.tools">dapp.tools</a>
        </p>
        <h2>
          Installing setzer
        </h2>
        <p>
          <strong>setzer</strong> is our tool to handle feeds.
        </p>
        <pre>
          git clone https://github.com/makerdao/setzer<br/>
          cd setzer<br/>
          sudo make link<br/>
        </pre>
        <p>After this...</p>
        <h2>Deploying a poker</h2>
        <p>
          A <strong>poker</strong> is a <strong>ds-cache</strong> that also updates a <strong>medianizer</strong>. This is the smart contract that you'll be updating regularly.
        </p>
        <p>First, download <strong>poker</strong> and build it.</p>
        <pre>
          git clone https://github.com/makerdao/poker --recursive<br/>
          cd poker<br/>
          export SOLC_FLAGS=--optimize<br/>
          dapp build<br/>
        </pre>
        <p>Then, set variables for the account you'll use and how much wei per gas you'll pay. 1 GWei is the cheapest. We're passing 1,500,000 gas, although it will take about half that.</p>
        <pre>
          export ETH_FROM=[your unlocked account]<br/>
          export ETH_GAS_PRICE=1000000000<br/>
          dapp create Poker -G 1500000<br/>
        </pre>
        <p>
          After <strong>dapp</strong> deploys the poker, the last line of output will be the poker's address in the blockchain. Keep note of this address.
        </p>
        <p>
          Join us in the <strong>#feeds</strong> channel at <a target="_blank" rel="noopener noreferrer" href="https://chat.makerdao.com/channel/feeds">Maker Chat</a>
        </p>
      </div>
    );
  }
}

export default App;
