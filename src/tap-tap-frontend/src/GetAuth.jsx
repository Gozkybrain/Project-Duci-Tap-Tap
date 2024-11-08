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
        try {
            const authClient = await AuthClient.create();
            await authClient.login({
                identityProvider: 'https://identity.ic0.app',
                onSuccess: async () => {
                    const identity = await authClient.getIdentity();
                    const principal = identity.getPrincipal().toText();
                    // Store principal
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
