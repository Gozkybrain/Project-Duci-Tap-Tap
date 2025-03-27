# Project Duci: Tap Tap

## Problem Statement
Traditional gaming systems often manage in-game points, rewards, and user data on centralized Web2 databases, which can lead to transparency and security issues. Players have limited control and visibility over how their data and points are stored, accessed, and managed. Furthermore, such systems typically lack privacy in point balances and require players to rely on intermediaries for reward claims. This creates a gap in decentralized, user-controlled game economies, where players can securely store points, maintain privacy, and redeem tokens on their terms.


## Solution
This project introduces a decentralized gaming points tracker, leveraging blockchain technology to store all user points and data on-chain. By decentralizing the points management system, each player's balance remains private, visible only to the player until they choose to redeem it for tokens. This approach not only ensures security and transparency but also allows for more decentralized gaming ecosystems, where players have full ownership and control over their points. As an evolving system, it aims to include multiple games, offering users a unified platform to manage their points across various titles, securely and privately.


## Technologies and Languages

### Languages and Frameworks:
* `React.js:` For the front-end interface, providing an interactive and responsive experience.
* `Rust:` Backend logic that interacts with the Internet Computer (ICP) for secure, on-chain point storage and retrieval.

### Additional Libraries and Tools:
* `CSS Animations:` Adds interactive effects for button clicks and point accumulation.
* `LocalStorage:` For client-side state persistence during temporary events like waiting periods.
* `Timing Functions:` Implemented with setTimeout and setInterval to manage UI and countdown interactions.


## Logic and Functionality
### Point Increment Mechanism:
* Users tap on an interactive coin button to increment their points balance.
* Each tap adds a visible "+1" animation near the button, contributing to an engaging user experience.

### Temporary Cool down After Multiple Taps:
* After a specific number of taps (currently set to 18), the app enters a "cool down" phase where users must wait 60 seconds before tapping again.
* A countdown timer is displayed, and once it reaches zero, the tapping functionality is re-enabled.
* This countdown is managed via `setInterval` and persists even if the user navigates away, using `localStorage` to store the wait state and resume accurately.

### Point Display and Increment Feedback:
* The current balance is updated on each tap, displaying a cumulative "+balance" during active game play.
* Once tapping resumes after the cool down, the balance resets visually, ready for the next accumulation phase.


### Privacy and Security on the Blockchain:
* Points and user data are stored securely on ICP, ensuring that only the owner can access their balance until a redemption action is taken.
* This approach enhances data privacy and supports future scaling to integrate additional games under one system.

### Responsive and Interactive UI:
* The app uses CSS animations and styles to create a futuristic aesthetic, enhancing the user experience.
* Custom fonts, glow effects, and image scaling provide a dynamic, visually engaging interface for players.

## Future Scope
The app is designed to scale by adding multiple games that can share the same on-chain points system. This expansion would allow users to manage all their game points securely and privately on one platform. The system can also support token claims, where users redeem points in exchange for cryptocurrency, fostering a decentralized game economy.