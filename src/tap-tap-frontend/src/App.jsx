import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

const BACKEND_CANISTER_ID = 'b77ix-eeaaa-aaaaa-qaada-cai';

const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get_balance': IDL.Func([], [IDL.Nat], ['query']), // No input needed for `get_balance`
    'increment_balance': IDL.Func([], [], ['update']),
    'get_user_id': IDL.Func([], [IDL.Text], ['query']),
  });
};

const tap_tap_backend = {
  get_balance: async () => {
    const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' });
    agent.fetchRootKey();
    const backendActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: BACKEND_CANISTER_ID,
    });
    const balance = await backendActor.get_balance();
    return balance.toString();
  },

  increment_balance: async () => {
    const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' });
    agent.fetchRootKey();
    const backendActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: BACKEND_CANISTER_ID,
    });
    await backendActor.increment_balance();
  },
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState(null);
  const [principalId, setPrincipalId] = useState(null);
  const [authClient, setAuthClient] = useState(null);

  const initializeAuthClient = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);
      const isAuthenticated = await client.isAuthenticated();

      if (isAuthenticated) {
        const identity = client.getIdentity();
        const principalId = identity.getPrincipal().toText();
        setPrincipalId(principalId);
        setIsAuthenticated(true);
        fetchUserData();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to initialize auth client:', error);
    }
  };

  const handleLogin = async () => {
    if (authClient) {
      await authClient.login({
        identityProvider: 'https://identity.ic0.app/',
        onSuccess: async () => {
          await handleAuthSuccess(authClient);
        },
        onError: (error) => {
          console.error('Authentication error:', error);
        },
      });
    }
  };

  const handleAuthSuccess = async (client) => {
    try {
      const identity = client.getIdentity();
      const principalId = identity.getPrincipal().toText();
      setPrincipalId(principalId);
      setIsAuthenticated(true);
      fetchUserData();
    } catch (error) {
      console.error('Error during authentication success:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userBalance = await tap_tap_backend.get_balance();
      setBalance(userBalance);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleIncrementBalance = async () => {
    try {
      await tap_tap_backend.increment_balance();
      fetchUserData();
    } catch (error) {
      console.error('Error incrementing balance:', error);
    }
  };

  useEffect(() => {
    initializeAuthClient();
  }, []);

  return (
    <div className="App">
      {isAuthenticated ? (
        <div>
          <h1>Welcome, {principalId}</h1>
          <h2>User Balance: {balance !== null ? balance : 'Loading...'}</h2>
          <button onClick={handleIncrementBalance}>Increment Balance</button>
        </div>
      ) : (
        <div>
          <h2>Please log in to view your account</h2>
          <button onClick={handleLogin}>Login with Auth</button>
        </div>
      )}
    </div>
  );
}

export default App;