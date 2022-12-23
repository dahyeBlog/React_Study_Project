import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route
                    path="/*"
                    element={
                <PrivateRoute>
                <Home />
                </PrivateRoute>
                    }
                />
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />}/>
                <Route
                    path="/profile"
                    element={
                <PrivateRoute>
                <Profile />
                </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
