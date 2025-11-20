# Stormer - Modern API Testing Platform 🚀

A hyper-visual, animated web application for API testing - a modern alternative to Postman with stunning animations and an intuitive interface.

![Stormer](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🎨 **Modern Design** - Beautiful, hyper-visual interface with smooth animations
- ⚡ **Fast & Responsive** - Built with React and Vite for optimal performance
- 🌈 **Animated UI** - Framer Motion animations throughout the app
- 🔥 **Full API Testing** - Support for GET, POST, PUT, PATCH, DELETE, and more
- 📁 **Collections** - Organize your requests into collections
- 🕐 **History** - Track all your API requests
- 🔐 **Authentication** - Bearer Token and Basic Auth support
- 🍪 **Cookies** - Manage cookies for your requests
- 📊 **Response Viewer** - Beautiful syntax highlighting for JSON responses
- 🎯 **Headers & Params** - Easy management of headers and query parameters
- 🌍 **Environments** - Manage different environments for your APIs

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Zustand (State Management)
- React Syntax Highlighter
- Axios

### Backend
- Node.js
- Express
- Axios (for proxying requests)
- CORS support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd Stormer
```

2. **Install all dependencies**
```bash
npm run install-all
```

This will install dependencies for both the server and client.

### Running the Application

**Option 1: Using the start script (Recommended)**
```bash
./start.sh
```

**Option 2: Development Mode** (runs both frontend and backend):
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5001`
- Frontend dev server on `http://localhost:3000`

**Option 3: Run servers separately**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run client
```

## 📖 Usage

1. **Send a Request**
   - Select HTTP method (GET, POST, PUT, etc.)
   - Enter your API URL
   - Add headers, parameters, or body as needed
   - Click "Send" to execute

2. **Manage Collections**
   - Click "New Collection" in the sidebar
   - Organize related requests together
   - Easy access to your saved requests

3. **View History**
   - All requests are automatically saved
   - Quick access to recent requests
   - View status and response time

4. **Authentication**
   - Select "Auth" tab
   - Choose Bearer Token or Basic Auth
   - Enter your credentials

5. **Cookies**
   - Select "Cookies" tab
   - Add cookie name and value
   - Cookies are automatically sent as Cookie header

## 🎨 Features Showcase

### Animated Background
- Particle system with connecting lines
- Floating gradient orbs
- Dynamic canvas animations

### Request Builder
- Smooth dropdown animations
- Tab transitions with Framer Motion
- Real-time input validation
- Syntax highlighting

### Response Viewer
- Beautiful JSON formatting
- Color-coded status indicators
- Response time and size tracking
- Error handling with detailed messages

### Sidebar
- Collections management
- Request history
- Environment variables
- Smooth slide animations

## 📁 Project Structure

```
Stormer/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── RequestBuilder.jsx
│   │   │   ├── ResponseViewer.jsx
│   │   │   └── BackgroundAnimation.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── store.js       # Zustand state management
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                # Backend Express server
│   └── index.js          # API server
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Backend API (Port 5001)
- `GET /api/health` - Health check
- `POST /api/execute` - Execute API request
- `GET /api/collections` - Get all collections
- `POST /api/collections` - Create collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection
- `GET /api/environments` - Get all environments
- `POST /api/environments` - Create environment
- `GET /api/history` - Get request history
- `DELETE /api/history` - Clear history

## 🎯 Roadmap

- [ ] Save collections to database (MongoDB/PostgreSQL)
- [ ] Export/Import collections
- [ ] WebSocket support
- [ ] GraphQL support
- [ ] Code generation for different languages
- [ ] Team collaboration features
- [ ] Cloud sync
- [ ] Dark/Light theme toggle
- [ ] Request chaining
- [ ] Pre-request scripts
- [ ] Tests and assertions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Postman
- Built with modern web technologies
- Animated with Framer Motion

---

Made with ❤️ by the Stormer Team
