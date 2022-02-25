import useBalance from './useBalance.jsx'

function BalanceText(props) {
  const { chainId, account, provider } = props;

  const decimals = 5;
  const balance = useBalance(chainId, account, provider, decimals)
  return (
    <div>
      Balance: {balance}
    </div>
  )
}

export default BalanceText;