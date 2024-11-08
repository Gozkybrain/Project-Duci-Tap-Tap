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
    // 5 seconds display
    const displayDuration = 5000;
    // 1 second fade-out
    const fadeDuration = 1000;

    const texts = [
        "Hello Sarcastic Geek Trybe,",
        "Ready to Tap Tap?",
        "Tap Tap to win!"
    ];

    useEffect(() => {
        const initAuthClient = async () => {
            const client = await AuthClient.create();
            setAuthClient(client);
            // Check if the user is already authenticated
            if (await client.isAuthenticated()) {
                const identity = client.getIdentity();
                const principal = identity.getPrincipal().toText();
                // Store principal and set authentication state
                localStorage.setItem('principal', principal);
                onAuthSuccess(principal);
            }
        };
        initAuthClient();
        // Only re-run when onAuthSuccess changes
    }, [onAuthSuccess]);

    useEffect(() => {
        // Always update the text when imageIndex changes
        setText(texts[imageIndex]);

        // Check if we're at the last image
        if (imageIndex === images.length - 1) return;

        // Start a timer for display duration, then trigger fade-out
        const displayTimer = setTimeout(() => {
            setFadeOut(true);
        }, displayDuration);

        // After fade-out duration, switch to the next image
        const fadeTimer = setTimeout(() => {
            setFadeOut(false);
            setImageIndex((prevIndex) => prevIndex + 1);
        }, displayDuration + fadeDuration);

        return () => {
            clearTimeout(displayTimer);
            clearTimeout(fadeTimer);
        };
    }, [imageIndex]);

    // handle the authentication with internet identity
    const handleAuthenticate = async () => {
        if (!authClient) return;

        try {
            await authClient.login({
                identityProvider: 'https://identity.ic0.app',
                onSuccess: async () => {
                    const identity = authClient.getIdentity();
                    const principal = identity.getPrincipal().toText();
                    // Store principal and pass as call back
                    localStorage.setItem('principal', principal);
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
