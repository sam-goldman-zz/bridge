import useBalance from './useBalance.jsx'

function BalanceText(props) {
  const { account, provider, token, tokenAddress } = props;
  
  const roundedDigits = 5;
  const balance = useBalance(account, provider, roundedDigits, token, tokenAddress);
  return (
    <div>
      Balance: {balance}
    </div>
  )
}

export default BalanceText;