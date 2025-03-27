import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import roboWait from './images/robo-wait.png';
import roboGreet from './images/robo-greet.png';
import roboSearch from './images/robo-search.png';
import './styles/GetAuth.css';

function GetAuth({ onAuthSuccess }) {
    const [imageIndex, setImageIndex] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [text, setText] = useState('');
    const [authClient, setAuthClient] = useState(null); 

    const images = [roboWait, roboGreet, roboSearch];
    const displayDuration = 5000;
    const fadeDuration = 1000;

    const texts = [
        "Hello Sarcastic Geek Trybe,",
        "Ready to Tap Tap?",
        "Tap Tap to win!"
    ];

    useEffect(() => {
        // Always update the text when imageIndex changes
        setText(texts[imageIndex]);

        if (imageIndex === images.length - 1) return;

        const displayTimer = setTimeout(() => {
            setFadeOut(true);
        }, displayDuration);

        const fadeTimer = setTimeout(() => {
            setFadeOut(false);
            setImageIndex((prevIndex) => prevIndex + 1);
        }, displayDuration + fadeDuration);

        return () => {
            clearTimeout(displayTimer);
            clearTimeout(fadeTimer);
        };
    }, [imageIndex]);

    // Initialize AuthClient when the component is mounted
    useEffect(() => {
        const initAuthClient = async () => {
            try {
                const client = await AuthClient.create();
                setAuthClient(client);
            } catch (error) {
                console.error('Error initializing AuthClient:', error);
            }
        };

        initAuthClient();
    }, []);

    // Handle the authentication with Internet Identity
    const handleAuthenticate = async () => {
        if (!authClient) {
            console.error('AuthClient is not initialized.');
            return;
        }

        try {
            await authClient.login({
                identityProvider: 'https://identity.ic0.app',
                onSuccess: async () => {
                    const identity = await authClient.getIdentity();
                    const principal = identity.getPrincipal().toText();
                    localStorage.setItem('principal', principal);
                    // Callback to set authenticated state
                    onAuthSuccess(principal); 
                },
            });
        } catch (error) {
            console.error('Authentication failed:', error);
        }
    };

    return (
        <div className="auth-container">
            <h3 className='tap-tap'>Project Duci</h3>
            <div className={`image-container ${fadeOut ? 'fade-out' : ''}`}>
                <img src={images[imageIndex]} alt={`robot-stage-${imageIndex}`} />
            </div>
            <div className="typed-text">{text}</div>
            <button onClick={handleAuthenticate}>Authenticate to get started</button>
        </div>
    );
}

export default GetAuth;
