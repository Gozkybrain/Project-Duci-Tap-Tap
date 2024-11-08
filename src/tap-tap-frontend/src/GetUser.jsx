import { useState, useEffect } from 'react';
import { tap_tap_backend } from 'declarations/tap-tap-backend';
import { Principal } from '@dfinity/principal';
import TapTap from './TapTap';
import roboMe from './images/robo-me.gif';
import './styles/GetUser.css';
import { FaCopy } from 'react-icons/fa';

function GetUser({ userId, onLogout }) {
    const [balance, setBalance] = useState(0);
    const [showFullId, setShowFullId] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
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

    const incrementBalance = async () => {
        try {
            const principal = Principal.fromText(userId);
            await tap_tap_backend.increment_balance_for_user(principal);
            await fetchBalanceForUser(userId); // Refresh the balance
        } catch (error) {
            console.error('Failed to increment balance:', error);
        }
    };

    const formatUserId = (userId) => {
        const firstPart = userId.slice(0, 4);
        const lastPart = userId.slice(-3);
        return `${firstPart}****${lastPart}`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(userId).then(() => {
            console.log('User ID copied to clipboard');
            setShowFullId(true);
            setTimeout(() => {
                setShowFullId(false);
            }, 3000);
        }).catch((error) => {
            console.error('Error copying to clipboard:', error);
        });
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <div className='user-id'>
                User ID: {showFullId ? userId : formatUserId(userId)}
                <FaCopy onClick={copyToClipboard} style={{ cursor: 'pointer', marginLeft: '10px' }} />
            </div>
            <img src={roboMe} alt="" />
            <div className="balance" data-balance={balance !== null ? balance : 'Loading...'}>
                Balance: {balance !== null ? balance : 'Loading...'}
            </div>
            <button onClick={openModal}>Increase Balance</button>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Increase Balance</h2>
                        <TapTap balance={balance} onIncrease={incrementBalance} />
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetUser;
