import MaxAmountButton from "./MaxAmountButton";

function BalanceControls(props) {
  const { account, provider, token, erc20Address, useBalance, handleClick } = props;

  const balance = useBalance(account, provider, token, erc20Address);
  const roundedBalance = Number(balance).toLocaleString(undefined, { maximumFractionDigits: 5 });

  return (
    <div>
      <MaxAmountButton onClick={() => handleClick(balance)}/>
      <div>
        Balance: {roundedBalance}
      </div>
    </div>
  )
}

export default BalanceControls;