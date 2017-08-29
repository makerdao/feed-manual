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
        <pre>
          curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -<br />
          sudo apt-get install -y nodejs<br />
        </pre>
        <h2>Installing DappHub's development tools</h2>
        <pre>
          curl https://nixos.org/nix/install | sh<br />
          nix-channel --add https://nix.dapphub.com/pkgs/dapphub<br />
          nix-channel --update<br />
          nix-env -iA dapphub.{'{dapp,seth,solc,bc,jshon}'}<br />
        </pre>
        <p>
          More info at <a target="_blank" rel="noopener noreferrer" href="http://dapp.tools">dapp.tools</a>
        </p>
        <h2>
          Installing setzer
        </h2>
        <p>
          <strong>setzer</strong> is our tool to handle feeds. It's a collection of scripts built on top of <strong>seth</strong>.
        </p>
        <pre>
          dapp clone makerdao/setzer<br />
          cd setzer<br />
          sudo make link<br />
        </pre>
        <h2>Deploying a poker</h2>
        <p>
          A <strong>poker</strong> is a <strong>ds-cache</strong> that also updates a <strong>medianizer</strong>. This is the smart contract that you'll be updating regularly.
        </p>
        <p>First, download <strong>poker</strong> and build it.</p>
        <pre>
          dapp clone makerdao/poker<br />
          cd poker<br />
          export SOLC_FLAGS=--optimize<br />
          dapp build<br />
        </pre>
        <p>Then, set variables for the account you'll use and how much wei per gas you'll pay. 1 GWei is just about as cheap as you can go. We're passing 1,000,000 gas, although it will take a bit less than that.</p>
        <pre>
          export ETH_FROM=[your unlocked account]<br />
          export ETH_GAS_PRICE=1000000000<br />
          dapp create Poker -G 1000000<br />
        </pre>
        <p>
          After <strong>dapp</strong> deploys the poker, the last line of output will be the poker's address in the blockchain. Save this address.
        </p>
        <h2>
          Updating your feed
        </h2>
        <p>
          The simplest way to update your feed is to run the following.
        </p>
        <pre>
          export POKER=[address of contract you deployed]<br />
          export MEDIANIZER=0x729D19f657BD0614b4985Cf1D82531c67569197B<br />
          export PRICE=$(setzer price cryptocompare)<br />
          export EXPIRES=$(date +%s -d'+6 hour')<br />
          setzer poker "$POKER" "$MEDIANIZER" "$PRICE" "$EXPIRES"<br />
        </pre>
        <p>
          If everything went well, you will have updated your feed to the current price according to Cryptocompare, set it to expire in 6 hours, and poked a medianizer.
        </p>
        <p>
          Of course, your feed is not currently part of the medianizer. You will have to get in touch with us for that.
        </p>
        <h2>Setting up a cron job</h2>
        <p>
          There are several ways to update your feed periodically. We expect people will come up with their own strategies. Here we propose a very simple way.
        </p>
        <p>
          There's a script inside <strong>setzer</strong> called <strong>update</strong> that you can call in a cron job. Just set some environment variables or pass them to the script and call it every few minutes.
        </p>
        <pre>
        */3 * * * * SPREAD=1 ETH_GAS_PRICE=4000000000 ETH_FROM=[your account] SOURCE=cryptocompare POKER=[your poker feed] MED=0x729d19f657bd0614b4985cf1d82531c67569197b bash -lc /path/to/setzer/scripts/update >> /path/to/update.log 2>&1
        </pre>
        <p>
          This cron job does the following:
        </p>
        <ul>
          <li>Sets a spread of 1%. It will only update if new price deviates from 1%.</li>
          <li>Gas price of 4 GWei.</li>
          <li>Source price is Cryptocompare. You can run <strong>setzer price ls</strong> and pick a different one (in lowercase).</li>
          <li>Runs every 3 minutes.</li>
          <li>Logs outputs to a log file.</li>
        </ul>
        <p>
          Join us in the <strong>#feeds</strong> channel at <a target="_blank" rel="noopener noreferrer" href="https://chat.makerdao.com/channel/feeds">Maker Chat</a> if you have any questions.
        </p>
      </div>
    );
  }
}

export default App;
