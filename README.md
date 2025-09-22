# 📸 FootOwl Gallery

A modern and responsive **React Native gallery app** for browsing, searching, and managing favorite images.

---

## 📑 Table of Contents
1. [Introduction](#introduction)  
2. [Features](#features)  
3. [Installation](#installation)  
4. [Usage](#usage)  
5. [Folder Structure](#folder-structure)  
6. [Technologies Used](#technologies-used)  
7. [Testing](#testing)  
8. [Contributing](#contributing)  
9. [License](#license)  

---

## 🚀 Introduction
FootOwl Gallery is a **React Native application** designed to provide a seamless experience for browsing and managing images.  
It supports **offline caching**, **infinite scrolling**, and the ability to **favorite images** for quick access.

---

## ✨ Features
- 🖼️ **Image Browsing** – View images in a grid layout with infinite scrolling.  
- 🔍 **Search** – Search for images by name or URL.  
- ❤️ **Favorites Management** – Add or remove images from your favorites.  
- 📶 **Offline Support** – Cached images are available even without internet.  
- 🌗 **Dark/Light Theme** – Supports both dark and light themes.  
- ♿ **Accessibility** – Optimized for screen readers and keyboard navigation.  

---

## ⚡ Installation
Clone the repository:
```bash
git clone https://github.com/your-username/footowl-gallery.git
cd footowl-gallery
```
Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm start
```
Run the app:
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```
📱 Usage

Launch the app on your device or emulator.

Browse the gallery and search for images.

Tap the ❤️ heart icon to add/remove favorites.

Access your favorites in the "Favorites" tab.

📂 Folder Structure
```
footowl-gallery/
 ├── src/
 │   ├── components/   # Reusable UI components
 │   ├── screens/      # App screens (Home, Favorites, Settings, etc.)
 │   ├── state/        # Zustand state management
 │   ├── services/     # API and utility services
 │   ├── theme/        # Theme provider and styles
 │   └── hooks/        # Custom React hooks
 ├── __tests__/        # Unit and integration tests
 ├── assets/           # Static assets (images, fonts, etc.)
 ├── App.tsx           # Entry point of the app
 └── README.md         # Project documentation
```
🛠️ Technologies Used
```
React Native
Zustand
Expo Image
FlashList
AsyncStorage
Toast
```
🧪 Testing

Unit Tests are located in the __tests__ folder.

Uses Testing Library for React Native components.

Run tests with:
```bash
npm test
```
🤝 Contributing

Contributions are welcome! 🚀

1.Fork the repository

2.Create a new branch:
```bash
git checkout -b feature/your-feature-name
```
3. Commit your changes:
4.Commit your changes:
 ```bash
   git commit -m "Add your message here"
```
5. Open a Pull Request

📜 License
This project is licensed under the MIT License.


---Architecture overview
1. High level: The app is a React Native (Expo) application. UI is organized using a screens/ components/ state/ folder structure:

2. screens/ — Home, ImageViewer, Favorites, Settings

3. components/ — lightweight presentational components (GridItem, ImageModal, Header)

4. state/ — Zustand / Redux / Context (pick one; whichever you used) for favorites, theme, and network state

5. services/ — networking and caching layers

6. utils/ — helpers (formatting, offline helpers)

7. Data & offline: Images are requested from API_BASE_URL. Responses are cached in a lightweight store + filesystem cache (expo-file-system or react-native-fs) for offline viewing of previously seen images. The app uses an LRU-ish strategy: cap cached images to N MB / M items and evict oldest.

8. Trade-offs: I used a simple client-side cache and a memory-efficient grid (FlashList/FlatList with windowing) for fast development and stable UX. This trades off advanced server-driven pagination or persistent DB (SQLite/Realm). This approach gives good performance for a small/medium dataset and is quicker to implement in a short timeline.

---Performance notes (what I did for smooth scroll & memory)

1. Use FlashList (or FlatList with getItemLayout and initialNumToRender) to enable smooth infinite scroll.

2. Image optimization:
Request appropriately sized thumbnails from server (or use resize params).
Use expo-image or Image with cache enabled so images are cached and not repeatedly decoded.

3. Memoization:
React.memo on GridItem.
useCallback for item renderers and handlers.
Windowing & virtualization: keep windowSize small enough for memory but large enough for smoothness.
Limit the in-memory image count; use filesystem cache for older images.
Avoid heavy synchronous work on the JS thread — defer non-urgent tasks with setTimeout or InteractionManager.
Clean up listeners on unmount.

---Known limitations + next steps

Known limitations
```
Favorites are stored locally; no server sync.
Cache eviction is naive (based on total files, not strict LRU).
No offline-first full sync; newly added data requires connectivity.
Only a basic accessibility pass — needs further ARIA/AccessibilityLabel work for full accessibility compliance.
Swipe-to-change-image functionality is not implemented due to gesture handling conflicts with the FlashList component and current navigation setup
```
2. Next steps
```
Add server-backed favorites + authentication.
Replace cache with SQLite/Realm for robust offline sync.
Add E2E tests (Detox) and production CI/CD.
Improve accessibility and internationalization.
```
Atharv Raut
