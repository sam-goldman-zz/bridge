import useBalance from './useBalance.jsx'

const chainIdToNativeToken = {
  '0x1': 'ETH',
  '0x64': 'XDAI',
  '0xa': 'ETH',
  '0xa4b1': 'ETH',
  '0x89': 'MATIC'
}

function TokenBalanceCard(props) {
  const {account, provider, chainId } = props;

  const roundedDigits = 3;
  const balance = useBalance(account, provider, roundedDigits)

  if (balance) {
    return (
      <div>
        {balance} {chainIdToNativeToken[chainId]}
      </div>
    )
  }

  return <div></div>
}

export default TokenBalanceCard;