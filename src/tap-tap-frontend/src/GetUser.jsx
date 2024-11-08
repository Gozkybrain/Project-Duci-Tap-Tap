import { useState, useEffect } from 'react';
import { tap_tap_backend } from 'declarations/tap-tap-backend';
import { Principal } from '@dfinity/principal';

function GetUser({ userId, onLogout }) {
  const [greeting, setGreeting] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Fetch user balance on component mount
    fetchBalanceForUser(userId);
  }, [userId]);

  const fetchBalanceForUser = async (principalId) => {
    try {
      const principal = Principal.fromText(principalId);
      const balance = await tap_tap_backend.get_balance_for_user(principal);
      setBalance(balance.toString());
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
    }
  };

  const handleIncrement = async () => {
    try {
      const principal = Principal.fromText(userId);
      await tap_tap_backend.increment_balance_for_user(principal);
      await fetchBalanceForUser(userId);
    } catch (error) {
      console.error('Failed to increment balance:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    tap_tap_backend.greet(name).then((greeting) => setGreeting(greeting));
  };

  return (
    <div>
      <h3>User Information</h3>
      <p>User ID: {userId}</p>
      <p>Balance: {balance !== null ? balance : 'Loading...'}</p>
      <button onClick={handleIncrement}>Increase Balance</button>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: </label>
        <input id="name" type="text" />
        <button type="submit">Submit</button>
      </form>
      <section>{greeting}</section>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default GetUser;
