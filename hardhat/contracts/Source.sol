// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract Source {

  uint CONTRACT_FEE_BASIS_POINTS = 5;

  event Hm(bytes32);

  // struct TransferData {
  //   address tokenAddress;
  //   address destination;
  //   uint amount;
  //   uint fee;
  //   uint startTime;
  //   uint feeRampup;
  // }

  uint nextTransferID;

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

    bytes memory little_endian_amount = to_little_endian_256(amount);
    bytes memory little_endian_fee = to_little_endian_256(fee);
    bytes memory little_endian_startTime = to_little_endian_256(startTime);
    bytes memory little_endian_feeRampup = to_little_endian_256(feeRampup);

    bytes32 left_node = sha256(abi.encodePacked(tokenAddress, bytes12(0), destination, bytes12(0)));
    bytes32 mid_node = sha256(abi.encodePacked(little_endian_amount, little_endian_fee));
    bytes32 right_node = sha256(abi.encodePacked(little_endian_startTime, little_endian_feeRampup));
    bytes32 zero_hash = sha256(abi.encodePacked(bytes32(0), bytes32(0)));
    bytes32 node = sha256(abi.encodePacked(
      sha256(abi.encodePacked(left_node, mid_node)),
      sha256(abi.encodePacked(right_node, zero_hash))
    ));

    emit Hm(node);

    // nextTransferID += 1;

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