import { useState, useEffect } from 'react';
import { tap_tap_backend } from 'declarations/tap-tap-backend'; // Import canister methods
import { AuthClient } from '@dfinity/auth-client'; // Correct import for AuthClient
import { Principal } from '@dfinity/principal'; // Import Principal for encoding

function App() {
  const [greeting, setGreeting] = useState('');
  const [userId, setUserId] = useState('');
  const [balance, setBalance] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This effect checks for authentication when the app is mounted
  useEffect(() => {
    async function checkAuthentication() {
      try {
        // Try to get the principal from localStorage
        const storedPrincipal = localStorage.getItem('principal');
        
        if (storedPrincipal) {
          // If a principal ID is found in localStorage, set user data
          setUserId(storedPrincipal);

          // Fetch balance for the user
          await fetchBalanceForUser(storedPrincipal); // Fetch balance after authentication
          setIsAuthenticated(true); // User is authenticated
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        setIsAuthenticated(false); // If an error occurs, the user is not authenticated
      }
    }

    checkAuthentication(); // Run the authentication check on component mount
  }, []);

  // Fetch user balance from the backend using get_balance_for_user method
  const fetchBalanceForUser = async (principalId) => {
    try {
      const principal = Principal.fromText(principalId); // Convert string to Principal
      const balance = await tap_tap_backend.get_balance_for_user(principal); // Call the backend query
      setBalance(balance.toString()); // Ensure balance is converted to string
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0); // Set balance to 0 if there's an error
    }
  };

  // Handle authentication on button click
  const handleAuthenticate = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: 'https://identity.ic0.app', // URL for Internet Identity login
        onSuccess: async () => {
          const identity = await authClient.getIdentity();
          const principal = identity.getPrincipal().toText(); // Get user principal ID
          setUserId(principal);

          // Store the principal ID in localStorage
          localStorage.setItem('principal', principal); 

          // Fetch balance after login for the authenticated user
          await fetchBalanceForUser(principal); // Fetch balance for the authenticated user
          setIsAuthenticated(true); // Set authenticated state to true
        }
      });
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Remove the principal from local storage
    localStorage.removeItem('principal');
    setUserId('');
    setBalance(0);
    setIsAuthenticated(false);
  };

  // Handle name submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    tap_tap_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
  };

  // Handle increment balance
  const handleIncrement = async () => {
    try {
      const principal = Principal.fromText(userId); // Convert string to Principal
      // Call the backend to increment the balance for the current user
      await tap_tap_backend.increment_balance_for_user(principal); // Increment balance
      await fetchBalanceForUser(userId); // Re-fetch the balance after increment
    } catch (error) {
      console.error('Failed to increment balance:', error);
    }
  };

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />

      {/* Display authentication button if not authenticated */}
      {!isAuthenticated ? (
        <div>
          <h3>Authenticate with Dfinity</h3>
          <button onClick={handleAuthenticate}>Authenticate</button> {/* Authentication button */}
        </div>
      ) : (
        <div>
          <h3>User Information</h3>
          <p>User ID: {userId}</p> {/* Display User ID (Principal) */}
          <p>Balance: {balance !== null ? balance : 'Loading...'}</p>
          <button onClick={handleIncrement}>Increase Balance</button>
          <form action="#" onSubmit={handleSubmit}>
            <label htmlFor="name">Enter your name: </label>
            <input id="name" type="text" />
            <button type="submit">Submit</button>
          </form>
          <section>{greeting}</section>

          {/* Logout Button */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </main>
  );
}

export default App;
