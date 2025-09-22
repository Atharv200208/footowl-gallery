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

Atharv Raut
