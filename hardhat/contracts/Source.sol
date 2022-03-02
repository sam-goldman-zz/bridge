// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract Source {
  uint constant DEPOSIT_CONTRACT_TREE_DEPTH = 32;
  uint constant CONTRACT_FEE_BASIS_POINTS = 5;
  uint constant MAX_DEPOSIT_COUNT = 2**DEPOSIT_CONTRACT_TREE_DEPTH - 1;

  uint256 nextTransferID;
  bytes32[DEPOSIT_CONTRACT_TREE_DEPTH] branch;
  bytes32[DEPOSIT_CONTRACT_TREE_DEPTH] zero_hashes;

  event Hm(bytes32);

  constructor() {
      // Compute hashes in empty sparse Merkle tree
      for (uint height = 0; height < DEPOSIT_CONTRACT_TREE_DEPTH - 1; height++)
        zero_hashes[height + 1] = sha256(abi.encodePacked(zero_hashes[height], zero_hashes[height]));
  }

  function withdraw(
      address tokenAddress,
      address destination,
      uint256 amount,
      uint256 fee,
      uint256 startTime,
      uint256 feeRampup
  ) external payable {
    // uint amountPlusFee = (amount * (10000 + CONTRACT_FEE_BASIS_POINTS)) / 10000;
  
    // require(msg.value == amountPlusFee);
    
    // // TODO: if transferData.tokenAddress = 0, then the token is ETH
    
    // // TODO: do we need to cast tokenAddress?
    // // TODO: params: from, to
    // // tokenAddress.transferFrom(_, _, amountPlusFee);

    bytes32 left_node = sha256(abi.encodePacked(tokenAddress, bytes12(0), destination, bytes12(0)));
    bytes32 mid_node = sha256(abi.encodePacked(to_little_endian_256(amount), to_little_endian_256(fee)));
    bytes32 right_node = sha256(abi.encodePacked(to_little_endian_256(startTime), to_little_endian_256(feeRampup)));
    bytes32 zero_hash = sha256(abi.encodePacked(bytes32(0), bytes32(0)));
    bytes32 transfer_data_node = sha256(abi.encodePacked(
      sha256(abi.encodePacked(left_node, mid_node)),
      sha256(abi.encodePacked(right_node, zero_hash))
    ));
    bytes32 node = sha256(abi.encodePacked(
      sha256(abi.encodePacked(transfer_data_node, this, bytes12(0))),
      sha256(abi.encodePacked(to_little_endian_256(nextTransferID), bytes32(0)))
    ));

    emit Hm(node);

    nextTransferID += 1;
    uint size = nextTransferID;
    for (uint height = 0; height < DEPOSIT_CONTRACT_TREE_DEPTH; height++) {
        if ((size & 1) == 1) {
            branch[height] = node;
            return;
        }
        node = sha256(abi.encodePacked(branch[height], node));
        size /= 2;
    }
  }

  // TODO: change header
  function to_little_endian_256(uint256 value) internal pure returns (bytes memory ret) {
    ret = new bytes(32);
    bytes32 bytesValue = bytes32(value);
    // Byteswapping during copying to bytes.
    for (uint i = 0; i < 32; i++) {
      ret[i] = bytesValue[32-i-1];
    }
    // emit Hm(ret);
  }
}