import useBalance from './useBalance.jsx'

const chainIdToSymbol = {
  '0x1': 'ETH',
  '0xa': 'ETH',
  '0xa4b1': 'ETH',
  '0x89': 'MATIC',
  '0x64': 'XDAI'
}

function TokenBalanceCard(props) {
  const {account, provider, chainId } = props;

  const decimals = 3;
  const balance = useBalance(chainId, account, provider, decimals)
  const tokenSymbol = chainIdToSymbol[chainId];

  if (balance) {
    return (
      <div>
        {balance} {tokenSymbol}
      </div>
    )
  }

  return <div></div>
}

export default TokenBalanceCard;