// frontend/src/context/SocketContext.js
import React, {
    createContext,
    useContext,
    useEffect,
    useState
  } from 'react';
  import { io } from 'socket.io-client';
  
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';
  
  const SocketContext = createContext(null);
  
  export const SocketProvider = ({ children }) => {
    const [socketInstance, setSocketInstance] = useState(null);
  
    useEffect(() => {
      const socket = io(SOCKET_URL, {
        transports: ['websocket']
      });
  
      socket.on('connect', () => {
        console.log('[socket] Conectado:', socket.id);
      });
  
      setSocketInstance(socket);
  
      return () => socket.disconnect();
    }, []);
  
    return (
      <SocketContext.Provider value={socketInstance}>
        {children}
      </SocketContext.Provider>
    );
  };
  
  export const useSocket = () => useContext(SocketContext);
  