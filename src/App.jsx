import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import OTP from './components/OTP';
import RoomDoor from './components/RoomDoor';
import RoomPage from './components/RoomPage';
import JoinChat from './components/JoinChat';
import ProtectedRoute from './components/ProtectedRoute';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar content={<Register />} /></>
    },
    {
      path: "/login",
      element: <><Navbar content={<Login />} /></>
    },
    {
      path: "/Chat/:code",
      element: (
        <ProtectedRoute>
            <Chat />
        </ProtectedRoute>
    ),
    },
    {
      path: "/OTP",
      element: <OTP />,
    },
    {
      path: "/RoomDoor",
      element: (
        <ProtectedRoute>
            <RoomDoor />
        </ProtectedRoute>
    ),
    },
    {
      path: "/room/:roomId",
      element: (
        <ProtectedRoute>
            <RoomPage />
        </ProtectedRoute>
    ),
    },
    {
      path: "/joinChat",
      element: (
        <ProtectedRoute>
            <JoinChat />
        </ProtectedRoute>
    ),
    }
  ])
    
    return (
        <>
            <RouterProvider router={router} />
            
        </>
    );
}

export default App;
