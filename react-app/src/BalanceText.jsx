import useERC20Balance from './useERC20Balance.jsx'

function BalanceText(props) {
  const { account, provider, token, erc20Address } = props;

  const roundedDigits = 5;
  const balance = useERC20Balance(account, provider, roundedDigits, token, erc20Address);
  return (
    <div>
      Balance: {balance}
    </div>
  )
}

export default BalanceText;