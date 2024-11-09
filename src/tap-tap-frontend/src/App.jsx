import { useState, useEffect } from 'react';
import GetAuth from './GetAuth';
import GetUser from './GetUser';
import MoreGames from './components/MoreGames';
import './styles/App.css';

function App() {
  // State to hold the user's ID, authentication status, and active modal
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // check if the user's principal is saved in localStorage
  useEffect(() => {
    const storedPrincipal = localStorage.getItem('principal');
    if (storedPrincipal) {
      // If found, set the user ID and mark the user as authenticated
      setUserId(storedPrincipal);
      setIsAuthenticated(true);
    }
  }, []);

  // handle modal actions
  useEffect(() => {
    if (activeModal) {
      // Disable scrolling when modal is active
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [activeModal]);

  // to handle successful authentication
  const handleAuthSuccess = (principal) => {
    // Store the principal (user ID) in state and mark user as authenticated
    setUserId(principal);
    setIsAuthenticated(true);
  };

  // handle user logout
  const handleLogout = () => {
    // Remove the user’s principal from localStorage and update state
    localStorage.removeItem('principal');
    setUserId('');
    setIsAuthenticated(false);
  };


  const openModal = (modal) => setActiveModal(modal);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="cover">
      <div className="sideMobile">
        <img src="/logo2.svg" alt="DFINITY logo" />
        <br />
        <br />

        {!isAuthenticated ? (
          // If not authenticated, show the GetAuth component
          <GetAuth onAuthSuccess={handleAuthSuccess} />
        ) : (
          <>
            {/* If authenticated, show the GetUser component with userId */}
            <GetUser userId={userId} onLogout={handleLogout} />

            <div className="bottomTabBar">
              <button onClick={() => openModal('tab1')}>More Games</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {activeModal === 'tab1' && (
        <div className="modal">
          <div className="modalContent">
            <button onClick={closeModal}>x</button>
            <MoreGames />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
