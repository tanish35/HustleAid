// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "chainlink-brownie-contracts/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract SubsidyToken is ERC1155, Ownable(msg.sender), AutomationCompatible {
    uint256 public constant LOAN = 1;
    uint256 public constant FOOD = 2;
    uint256 public constant HEALTHCARE = 3;
    uint256 public constant TRANSPORT = 4;
    uint256 public constant PERSONAL = 5;

    mapping(address => bool) public minters;
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    struct ExpiryData {
        uint256 expiry;
    }

    struct Transaction {
        address vendor;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => mapping(uint256 => ExpiryData)) public tokenExpiry;
    mapping(uint256 => uint256) public totalSupply;
    mapping(address => mapping(uint256 => uint256)) public balances;
    mapping(address => mapping(uint256 => Transaction[])) public transactions;

    event Minted(
        address indexed recipient,
        uint256 loan,
        uint256 food,
        uint256 healthcare,
        uint256 transport,
        uint256 expiry
    );
    event Burned(address indexed owner, uint256 tokenType, uint256 amount);
    event ExpiredTokenBurned(
        address indexed owner,
        uint256 tokenType,
        uint256 amount
    );
    event TokenTransferred(
        address indexed from,
        address indexed to,
        uint256 tokenType,
        uint256 amount,
        uint256 timestamp
    );

    constructor()
        ERC1155(
            "ipfs://bafkreia3qu4evzkcgovsbtoxpio5bwngu7avs5q2boyl65kr2arbuvhkny"
        )
    {}

    modifier onlyMinter() {
        require(
            minters[msg.sender] || owner() == msg.sender,
            "Not authorized to mint"
        );
        _;
    }

    function addMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Invalid minter address");
        require(!minters[_minter], "Already a minter");
        minters[_minter] = true;
        emit MinterAdded(_minter);
    }

    function removeMinter(address _minter) external onlyOwner {
        require(minters[_minter], "Not a minter");
        minters[_minter] = false;
        emit MinterRemoved(_minter);
    }

    function mintSubsidy(
        address recipient,
        uint256 loan,
        uint256 food,
        uint256 healthcare,
        uint256 transport
    ) external onlyOwner {
        uint256 expiry = block.timestamp + 30 days;

        if (loan > 0) {
            _mint(recipient, LOAN, loan, "");
            tokenExpiry[recipient][LOAN] = ExpiryData(expiry);
            totalSupply[LOAN] += loan;
            balances[recipient][LOAN] += loan;
        }
        if (food > 0) {
            _mint(recipient, FOOD, food, "");
            tokenExpiry[recipient][FOOD] = ExpiryData(expiry);
            totalSupply[FOOD] += food;
            balances[recipient][FOOD] += food;
        }
        if (healthcare > 0) {
            _mint(recipient, HEALTHCARE, healthcare, "");
            tokenExpiry[recipient][HEALTHCARE] = ExpiryData(expiry);
            totalSupply[HEALTHCARE] += healthcare;
            balances[recipient][HEALTHCARE] += healthcare;
        }
        if (transport > 0) {
            _mint(recipient, TRANSPORT, transport, "");
            tokenExpiry[recipient][TRANSPORT] = ExpiryData(expiry);
            totalSupply[TRANSPORT] += transport;
            balances[recipient][TRANSPORT] += transport;
        }

        emit Minted(recipient, loan, food, healthcare, transport, expiry);
    }

    function transferToken(
        address to,
        uint256 tokenType,
        uint256 amount
    ) external {
        require(
            balanceOf(msg.sender, tokenType) >= amount,
            "Insufficient balance"
        );

        _safeTransferFrom(msg.sender, to, tokenType, amount, "");
        balances[msg.sender][tokenType] -= amount;
        balances[to][tokenType] += amount;

        transactions[msg.sender][tokenType].push(
            Transaction(to, amount, block.timestamp)
        );

        emit TokenTransferred(
            msg.sender,
            to,
            tokenType,
            amount,
            block.timestamp
        );
    }

    function getAllTokensOfOwner(
        address owner
    ) external view returns (uint256[4] memory) {
        return [
            balances[owner][LOAN],
            balances[owner][FOOD],
            balances[owner][HEALTHCARE],
            balances[owner][TRANSPORT]
        ];
    }

    function getTokensByTypeOfOwner(
        address owner,
        uint256 tokenType
    ) external view returns (uint256) {
        return balances[owner][tokenType];
    }

    function getTransactionsByType(
        address owner,
        uint256 tokenType
    ) external view returns (Transaction[] memory) {
        return transactions[owner][tokenType];
    }

    function checkUpkeep(
        bytes calldata
    ) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = false;
        for (uint256 i = 1; i <= 4; i++) {
            if (
                block.timestamp > tokenExpiry[msg.sender][i].expiry &&
                balanceOf(msg.sender, i) > 0
            ) {
                upkeepNeeded = true;
                break;
            }
        }
    }

    function performUpkeep(bytes calldata) external override {
        for (uint256 i = 1; i <= 4; i++) {
            if (
                block.timestamp > tokenExpiry[msg.sender][i].expiry &&
                balanceOf(msg.sender, i) > 0
            ) {
                uint256 expiredAmount = balanceOf(msg.sender, i);
                _burn(msg.sender, i, expiredAmount);
                totalSupply[i] -= expiredAmount;
                emit ExpiredTokenBurned(msg.sender, i, expiredAmount);
            }
        }
    }
}
