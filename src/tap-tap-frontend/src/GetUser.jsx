import { useState, useEffect } from 'react';
import { tap_tap_backend } from 'declarations/tap-tap-backend';
import { Principal } from '@dfinity/principal';
import TapTap from './components/TapTap';
import roboMe from './images/robo-me.gif';
import './styles/GetUser.css';
import { FaCopy } from 'react-icons/fa';

function GetUser({ userId }) {
    const [balance, setBalance] = useState(0);
    const [showFullId, setShowFullId] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch balance when the userId changes
    useEffect(() => {
        fetchBalanceForUser(userId);
    }, [userId]);

    // Fetch balance for the user from the backend
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

    // Increment the user's balance
    const incrementBalance = async () => {
        try {
            const principal = Principal.fromText(userId);
            await tap_tap_backend.increment_balance_for_user(principal);
            await fetchBalanceForUser(userId); // Refresh balance
        } catch (error) {
            console.error('Failed to increment balance:', error);
        }
    };

    // Format user ID to hide middle part
    const formatUserId = (userId) => {
        const firstPart = userId.slice(0, 4);
        const lastPart = userId.slice(-3);
        return `${firstPart}****${lastPart}`;
    };

    // Copy the user ID to the clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(userId).then(() => {
            console.log('User ID copied to clipboard');
            // Show full ID temporarily
            setShowFullId(true);
            setTimeout(() => {
                // Hide full ID after 3 seconds
                setShowFullId(false);
            }, 3000);
        }).catch((error) => {
            console.error('Error copying to clipboard:', error);
        });
    };


    const openModal = () => setIsModalOpen(true);

    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className='user-id'>
                User id: {showFullId ? userId : formatUserId(userId)}
                <FaCopy onClick={copyToClipboard} style={{ cursor: 'pointer', marginLeft: '10px' }} />
            </div>

            <img src={roboMe} alt="" />

            <div className="balance" data-balance={balance !== null ? balance : 'Loading...'}>
                Balance: {balance !== null ? balance : 'Loading...'}
            </div>

            <button onClick={openModal}>Start Tap Tap</button>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={closeModal}>x</button>
                        <TapTap balance={balance} onIncrease={incrementBalance} />
                    </div>
                </div>
            )}
        </>
    );
}

export default GetUser;
