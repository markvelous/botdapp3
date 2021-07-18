import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Bot from "../abis/Bot.json";
import Truncate from "react-truncate";
import randomstring from "randomstring";

class App extends Component {
  // let botImage = ['https://robohash.org/' + this.state.bot + '?size=200x200'];

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. Try installing MetaMask instead."
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = Bot.networks[networkId];
    if (networkData) {
      const abi = Bot.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });
      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply });
      // Load Bots
      for (var i = 1; i <= totalSupply; i++) {
        const bot = await contract.methods.bots(i - 1).call();
        this.setState({
          bots: [...this.state.bots, bot],
        });
      }
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  }

  mint = (bot) => {
    this.state.contract.methods
      .mint(bot)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({
          bots: [...this.state.bots, bot],
        });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contract: null,
      totalSupply: 0,
      bots: [],
    };
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-3 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-3 mr-0"
            href="https://robohash.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Marköbot Unique Robohash Minter
          </a>

          <a
            className="small text-white"
            href="https://rinkeby.etherscan.io/address/0xB7d67fa0B552105c3Bcc7e15374Ea26B67A3b5A6"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contract: 0xB7d67fa0B552105c3Bcc7e15374Ea26B67A3b5A6
          </a>

          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                <span id="account">Account: {this.state.account}</span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <br />
                <br />
                <h1>Mint a Marköbot</h1>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const bot = this.bot.value;
                    this.mint(bot);
                  }}
                >
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Enter the name of your bot"
                    ref={(input) => {
                      this.bot = input;
                    }}
                  />
                  <input
                    type="submit"
                    className="btn btn-block btn-primary"
                    value="Mint now!"
                  />
                  <br />

                  <div className="content mr-auto ml-auto">
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const bot = randomstring.generate();
                        this.mint(bot);
                      }}
                    >
                      <input
                        type="submit"
                        className="btn btn-block btn-primary"
                        value="Surprise me! Make a random bot!"
                      />
                    </form>
                  </div>
                  
                </form>
                <br />
              </div>
            </main>
          </div>
          <hr />
          <br />
          <div className="row text-center">
            {this.state.bots.map((bot, key) => {
              return (
                <div key={key} className="col-md-2 mb-3">
                  <div className="botname">
                    <Truncate lines={1}>~ {bot} ~</Truncate>
                  </div>
                  <br />
                  <div className="token">
                    <img
                      src={"https://robohash.org/" + bot + "?size=150x150"}
                      alt=""
                    />
                  </div>
                  <br />
                  <br />
                  <br />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
