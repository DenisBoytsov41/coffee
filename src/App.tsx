import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/navigation/Home";
import Buy from "./components/navigation/Buy";
import Faq from "./components/navigation/Faq";
import Shipment from "./components/navigation/Shipment";
import Liked from "./components/navigation/Liked";
import Basket from "./components/navigation/basket";
import Opt from "./components/navigation/Opt";
import Reg from "./components/navigation/Reg";
import About from "./components/navigation/About";
import Reset from "./components/navigation/Reset";
import Login from "./components/navigation/Login";
import Admin from "./components/navigation/Admin";
import ResetURL from "./components/navigation/ResetURL";
import Profile from "./components/navigation/Profile";
import { useAuth } from './components/navigation/AuthContext';
import { jwtDecode, JwtPayload } from "jwt-decode";
import clearExpiredTokens from './components/navigation/tokenUtils';
import checkRefreshToken from './components/navigation/refreshTokenUtils';
import ErrorBoundary from './components/errors/ErrorBoundary';
import CustomErrorComponent from './components/errors/CustomErrorComponent';
import NotFound from './components/errors/NotFound';
import { BotProvider } from "./components/navigation/Bot/BotContext"
import Chat  from "./components/navigation/Bot/Chat"
import chat from './images/chat-svgrepo-com.svg'

const schedule = require('node-schedule');

interface MyJwtPayload extends JwtPayload {
  username: string;
  guestMode: boolean;
  currentTheme: string;
  error: string;
}

const decodeToken = (token: string): MyJwtPayload => {
  return jwtDecode(token) as MyJwtPayload;
};

function App() {
  const [showPersonalCabinet, setShowPersonalCabinet] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();

  const [username, setUsername] = useState('');
  const [jwtToken, setJwtToken] = useState('');
  const [guestMode, setGuestMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('');
  const [error, setError] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); 

  useEffect(() => {
    const loggedInState = localStorage.getItem('isLoggedIn');
    if (loggedInState === 'true') {
      setShowPersonalCabinet(true);
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const decodedToken = decodeToken(accessToken);
        setUsername(decodedToken.username);
        setJwtToken(accessToken);
        setGuestMode(decodedToken.guestMode);
        setCurrentTheme(decodedToken.currentTheme);
        setError(decodedToken.error);
      }
    } else {
      setShowPersonalCabinet(false);
    }
  }, [isLoggedIn, login, logout]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decodedToken = decodeToken(accessToken);
      setUsername(decodedToken.username);
      setJwtToken(accessToken);
      setGuestMode(decodedToken.guestMode);
      setCurrentTheme(decodedToken.currentTheme);
      setError(decodedToken.error);
    }
  }, [localStorage.getItem('accessToken')]);

  const handleLoginBtnClick = () => {
    setShowPersonalCabinet(false);
  };

  const handleRegisterBtnClick = () => {
    setShowPersonalCabinet(false);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      window.location.reload();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLoginSuccess = () => {
    setShowPersonalCabinet(true);
    login();
  };

  const handleLogout = () => {
    setShowPersonalCabinet(false);
    logout();
  };

  useEffect(() => {
    const job = schedule.scheduleJob('*/1 * * * *', () => {
      clearExpiredTokens();
      setTimeout(() => {
        checkRefreshToken();
      }, 2000);
    });

    return () => {
      job.cancel();
    };
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    
    <div className="App Comissioner">
      <BotProvider>
        <ErrorBoundary errorElement={<CustomErrorComponent />}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/shipment" element={<Shipment />} />
              <Route path="/liked" element={<Liked />} />
              <Route path="/basket" element={<Basket />} />
              <Route path="/opt" element={<Opt />} />
              <Route path="/reg" element={<Reg />} />
              <Route path="/about" element={<About />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/resetURL/:email/:token" element={<ResetURL />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <div className="chatbot-icon-container" onClick={toggleChat}>
            <img src={chat} alt="Chat Icon" />
          </div>
          {isChatOpen && <Chat onClose={handleCloseChat} />}
        </ErrorBoundary>
      </BotProvider>
    </div>
  );
}

export default App;
