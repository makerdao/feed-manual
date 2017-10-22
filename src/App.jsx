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
          These are the steps required to deploy your own <a href="https://github.com/makerdao/price-feed" rel="noopener noreferrer" target="_blank">price-feed</a> and run a bot that updates its price regularly.
        </p>
        <p>
          <strong>NOTE: This guide has been tested with Ubuntu 16.04 or up.</strong>
        </p>
        <h3>Prerequisites</h3>
        <ul>
          <li>
            Ethereum client like Parity or Geth running with an unlocked account.
          </li>
          <li>
            Node 6 or above.
          </li>
        </ul>
        <h3>Installing DappHub's development tools</h3>
        <pre>
          $ curl https://nixos.org/nix/install | sh<br />
          $ . $HOME/.nix-profile/etc/profile.d/nix.sh<br />
          $ nix-channel --add https://nix.dapphub.com/pkgs/dapphub<br />
          $ nix-channel --update<br />
          $ nix-env -iA dapphub.{'{dapp,seth,solc,jshon,bc}'}<br />
        </pre>
        <p>
          More info at <a target="_blank" rel="noopener noreferrer" href="https://dapp.tools">dapp.tools</a>
        </p>
        <h3>
          Installing setzer
        </h3>
        <p>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/makerdao/setzer">setzer</a> is our tool to handle feeds.
        </p>
        <pre>
          $ sudo apt install -y make<br />
          $ git clone https://github.com/makerdao/setzer<br />
          $ cd setzer<br />
          $ sudo make link<br />
        </pre>
        <h3>Deploying your price feed</h3>
        <p>
          A <a target="_blank" rel="noopener noreferrer" href="https://github.com/makerdao/price-feed">price feed</a> is the contract you'll be interacting with. We provide a FeedFactory that will create a price-feed for you.
        </p>
        <p>
          FeedFactory is deployed at <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/address/0x435ad5cae6ea3e065ce540464366b71fba8f0c52">0x435AD5CAE6eA3e065ce540464366b71Fba8f0c52</a>. You will send a transaction to it and it will create your price-feed.
        </p>
        <pre>
          $ seth send 0x435AD5CAE6eA3e065ce540464366b71Fba8f0c52 --guess "create()(address)" -F [YOUR ACCOUNT] -G 700000 -P $(seth --to-wei 1 gwei)
        </pre>
        <p>
          This command sends a transaction to the FeedFactory's "create()" method, sending 700,000 gas, with a price of 1 gwei per gas. After it finishes, seth will print out the address of your price-feed.
        </p>
        <h3>Setting up setzer</h3>
        <p>
          setzer expects a <strong>/etc/setzer.conf</strong> file that looks like this:
        </p>
        <pre>
          export ETH_FROM="YOUR ACCOUNT"<br />
          export SETZER_FEED="YOUR PRICE-FEED ADDRESS"<br />
          export SETZER_MEDIANIZER="0x729D19f657BD0614b4985Cf1D82531c67569197B"<br />
          export SETZER_SOURCES="LIST OF PRICE SOURCES"<br />
        </pre>
        <p>
          The medianizer address is our current contract that reads several feeds and saves the median, which is then used as our official price source.
        </p>
        <p>
          To select a list of price sources, run:
        </p>
        <pre>
          $ setzer price ls
        </pre>
        <p>
        You will see a list of sources along with their price. Select at least two and add their names (in lowercase) to <strong>SETZER_SOURCES</strong>, for example:
        </p>
        <pre>
          export SETZER_SOURCES="etherscan gdax gemini poloniex"
        </pre>
        <h3>
          Testing setzer bot
        </h3>
        <p>
          Once <strong>setzer</strong> is configured, it's time to test it. Run the following command:
        </p>
        <pre>
          $ setzer bot
        </pre>
        <p>
          It will initialize with your current configuration. The first time, your price-feed is empty so it will update with the new price.
        </p>
        <p>
          Since you ran <strong>setzer bot</strong>, it will ask for confirmation before submitting a transaction. When prompted, select <strong>Y</strong> or <strong>YES</strong> to send the transaction. Wait for your transaction to be mined. If it's not mined in 90 seconds, setzer will try to resend with higher gas price. Accept the transaction until it passes.
        </p>
        <p>
          After the price is set, <strong>setzer bot</strong> will continue to run, but only update if the price stored in the blockchain deviates from a certain percentage (+- 1% by default). At this point, you can stop setzer with <strong>Ctrl + C</strong>.
        </p>
        <h3>
          Adding your feed to the medianizer
        </h3>
        <p>
          At this point you are updating your feed, but that's it. It's not yet part of of our official list of feeds. And the medianizer does not take it into account to calculate its price.
        </p>
        <p>
          For that you need to contact us. Find us in <a target="_blank" rel="noopener noreferrer" href="https://chat.makerdao.com/channel/general">Maker Chat</a> and propose running a feed. We value members of the community helping with this task, but please, contact us first!
        </p>
        <h3>Running setzer bot automatically</h3>
        <p>
          Once you tried <strong>setzer bot</strong> and it's working, you can run it without user intervention. The command is:
        </p>
        <pre>
          $ setzer bot --auto
        </pre>
        <p>
          You can set your OS to run it automatically on boot, or have it run in the background. One suggestion is:
        </p>
        <pre>
          nohup setzer bot --auto > /path/to/bot.log 2>&1 &
        </pre>
        <p>
          And that's it!
        </p>
        <p>
          Join us in the <strong>#feeds</strong> channel at <a target="_blank" rel="noopener noreferrer" href="https://chat.makerdao.com/channel/feeds">Maker Chat</a> if you have any questions.
        </p>
      </div>
    );
  }
}

export default App;
