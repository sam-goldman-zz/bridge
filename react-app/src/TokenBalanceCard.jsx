import useBalance from './useBalance.jsx'

const tokenSymbols = {
  '0x1': 'ETH'
}

function TokenBalanceCard(props) {
  const {account, provider } = props;

  const decimals = 3;
  // const chainId = useChainId();
  const chainId= '0x1';
  const tokenSymbol = tokenSymbols[chainId];
  const balance = useBalance(chainId, account, provider, decimals)

  return (
    <div>
      {/* <EthLogo /> */}
      {balance}
      {tokenSymbol}
    </div>
  )
}

export default TokenBalanceCard;