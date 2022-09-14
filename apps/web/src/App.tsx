import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import Spinner from './components/Spinner';

export default function App() {
  const [socketId, setSocketId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      return;
    }

    const socket = io('http://localhost:3000', {
      reconnection: false,
    });

    socket.once('id', (id) => {
      setSocketId(id);
      console.log(id);
    });

    socket.once('login', (data) => {
      if (data.success) {
        setLoggedIn(true);
        socket.disconnect();
      }
    });
  }, [loggedIn]);

  if (loggedIn) {
    const handleLogout = () => {
      setSocketId(null);
      setLoggedIn(false);
    };

    return (
      <div className="w-100 h-screen flex flex-col gap-2 justify-center items-center p-2">
        <p className="font-serif text-black text-lg">Seja bem-vindo, Lucas!</p>
        <button className="bg-red-500 text-white rounded p-2" onClick={handleLogout}>
          Deslogar
        </button>
      </div>
    );
  }

  return (
    <div className="w-100 h-screen flex justify-center items-center p-2">
      {socketId ? <QRCodeSVG value={socketId} size={300} /> : <Spinner />}
    </div>
  );
}
