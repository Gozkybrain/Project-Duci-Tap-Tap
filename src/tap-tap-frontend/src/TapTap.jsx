function TapTap({ balance, onIncrease }) {
    return (
      <div>
        <h3>User Balance: ${balance}</h3>
        <button onClick={onIncrease}>Increase</button>
      </div>
    );
  }
  
  export default TapTap;
  