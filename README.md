# 🚀 Tasklo – Trello-Inspired Task Management App (Frontend, React)

Tasklo is a modern, feature-rich frontend for a Trello-inspired task management application.  
Built with React, Vite, and a modular architecture, it provides a fast, interactive, and scalable user experience.

---

## ✨ Features

- 🧭 Full SPA flow (Homepage → Signup/Login → Boards)
- 🧩 Create and manage Boards, Groups, and Tasks
- 🖱️ Drag-and-drop support for moving tasks between groups
- 🔍 Advanced filtering by keyword, members, status, due date, and labels
- 🔄 Real-time updates via WebSockets (Socket.IO)
- 🔐 Authentication (signup, login, session persistence)
- 📱 Responsive and clean UI
- 🧠 AI-powered board creation using Google Gemini API
- 🗃️ Persistent data via backend integration
- ⚙️ Dev-friendly, scalable file structure

---

## 🛠️ Tech Stack

- 🧬 **React** – Functional components and hooks
- 📦 **Redux** – State management
- 🧭 **React Router** – Client-side routing
- ⚡ **Vite** – Build tool for lightning-fast development
- 🌐 **Axios** – HTTP client for API communication
- 🎨 **SCSS** – Modular and clean styling
- 🧲 **react-beautiful-dnd** – Smooth drag-and-drop UX
- 🛰️ **Socket.IO** – Real-time task updates and collaboration
- 🤖 **Google Gemini API** – AI-generated project boards
- 🪝 **Custom hooks** – Reusable logic
- 🧱 **Modular architecture** – Maintainable and scalable file structure

---

## 📁 Project Structure

```
Tasklo---FE/
│
├── public/                # Static assets (images, icons)
├── src/
│   ├── assets/            # Fonts, images, styles (SCSS)
│   ├── cmps/              # React components (Board, Task, Modals, etc.)
│   ├── customHooks/       # Custom React hooks
│   ├── data/              # Sample/mock data
│   ├── pages/             # Page-level components (BoardIndex, BoardDetails, etc.)
│   ├── services/          # API and utility services
│   ├── store/             # Redux store, actions, reducers
│   ├── svg/               # SVG assets
│   ├── App.jsx            # Main app component
│   ├── index.jsx          # Entry point
│   └── RootCmp.jsx        # Root component
├── .env                   # Environment variables
├── vite.config.js         # Vite configuration
├── package.json
├── README.md
└── index.html
```

---

## ⚡ Getting Started

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Set up environment variables**  
   Create a `.env` file in the root directory with relevant variables like:

   ```
   VITE_API_URL=http://localhost:3030
   ```

3. **Run the development server**

   ```sh
   npm run dev
   ```

4. **Build for production**
   ```sh
   npm run build
   ```
   The build output will be placed in your backend's `public/` folder for deployment.

---

## 🔗 Backend Integration

- The frontend expects the backend API to be available at `http://localhost:3030` (or as configured).
- For full functionality, clone and run the [Tasklo backend](https://github.com/Maor4214/Tasklo---BE).

---

## 📝 License

This project is licensed under the MIT License.

---

**Tasklo Frontend** – Built with ❤️ using React, Vite, and modern web technologies.
