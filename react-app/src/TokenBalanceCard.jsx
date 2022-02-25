import useBalance from './useBalance.jsx'
import useMetamaskChainId from './useMetamaskChainId.jsx'

function TokenBalanceCard(props) {
  const {account, provider, chainId } = props;

  const decimals = 3;
  const balance = useBalance(chainId, account, provider, decimals)

  return (
    <div>
      {balance}
    </div>
  )
}

export default TokenBalanceCard;