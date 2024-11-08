import { useState, useEffect } from 'react';
import GetAuth from './GetAuth';
import GetUser from './GetUser';
import './styles/App.css';

function App() {
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // Track active modal

  useEffect(() => {
    const storedPrincipal = localStorage.getItem('principal');
    if (storedPrincipal) {
      setUserId(storedPrincipal);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (principal) => {
    setUserId(principal);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
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
          <GetAuth onAuthSuccess={handleAuthSuccess} />
        ) : (
          <>
            <GetUser userId={userId} onLogout={handleLogout} />
            {/* Bottom tab bar */}
            <div className="bottomTabBar">
              <button onClick={() => openModal('tab1')}>Tab 1</button>
              <button onClick={() => openModal('tab2')}>Tab 2</button>
              <button onClick={() => openModal('tab3')}>Tab 3</button>
            </div>
          </>
        )}



      </div>

      {/* Bottom tab bar */}
      {/* <div className="bottomTabBar">
        <button onClick={() => openModal('tab1')}>Tab 1</button>
        <button onClick={() => openModal('tab2')}>Tab 2</button>
        <button onClick={() => openModal('tab3')}>Tab 3</button>
      </div> */}

      {/* Modals */}
      {activeModal === 'tab1' && (
        <div className="modal">
          <div className="modalContent">
            <h2>Tab 1 Content</h2>
            <p>This is the content for Tab 1.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
      {activeModal === 'tab2' && (
        <div className="modal">
          <div className="modalContent">
            <h2>Tab 2 Content</h2>
            <p>This is the content for Tab 2.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
      {activeModal === 'tab3' && (
        <div className="modal">
          <div className="modalContent">
            <h2>Tab 3 Content</h2>
            <p>This is the content for Tab 3.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
