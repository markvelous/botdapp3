// SPDX-license-identifier unlicensed

pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721full.sol";

contract Bot is ERC721Full {

    // an array of bots
    string[] public bots;
    mapping(string => bool) _botExists;

    constructor() ERC721Full("Bot", "MKB") public {

    }

    // add bot, call the mint function and check that it has not been minted before 
    function mint(string memory _bot) public {
        require(!_botExists[_bot]);
        uint _id = bots.push(_bot);
        _mint(msg.sender, _id);
        _botExists[_bot] = true;
    }
}

