import useBalance from './useBalance.jsx'
import useMetamaskChainId from './useMetamaskChainId.jsx'

const nativeTokenSymbols = {
  '0x1': 'ETH',
  '0xa': 'ETH',
  '0xa4b1': 'ETH',
  '0x89': 'MATIC',
  '0x64': 'XDAI'
}

function TokenBalanceCard(props) {
  const {account, provider } = props;

  const decimals = 3;
  const chainId = useMetamaskChainId();
  const balance = useBalance(chainId, account, provider, decimals)
  const tokenSymbol = nativeTokenSymbols[chainId];

  return (
    <div>
      {/* <EthLogo /> */}
      {balance}
      {tokenSymbol}
    </div>
  )
}

export default TokenBalanceCard;