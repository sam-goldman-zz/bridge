import useNativeTokenBalance from './useNativeTokenBalance.jsx'

const chainIdToNativeToken = {
  '0x1': 'ETH',
  '0x64': 'XDAI',
  '0xa': 'ETH',
  '0xa4b1': 'ETH',
  '0x89': 'MATIC'
}

function TokenBalanceCard(props) {
  const {account, provider, chainId } = props;

  const balance = useNativeTokenBalance(account, provider);
  const roundedBalance = parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 3 })

  if (roundedBalance) {
    return (
      <div>
        {roundedBalance} {chainIdToNativeToken[chainId]}
      </div>
    )
  }

  return <div></div>
}

export default TokenBalanceCard;