import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    async function register(name, email, password, confirmPassword) {
        try {
            const response = await axios.post('/register', {
                name,
                email,
                password,
                confirmPassword
            }, { withCredentials: true });

            if (response.data.success) {
                setUser(response.data.user);
            } else {
                alert(response.data.message || "An error occurred");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message || "An error occurred");
            } else {
                alert("An error occurred");
            }
            console.error("Registration error:", error);
        }
    }

    async function login(email, password) {
        try {
            const response = await axios.post('/login', {
                email,
                password
            }, { withCredentials: true });

            if (response.data.success) {
                setUser(response.data.user);
            } else {
                alert(response.data.message || "An error occurred");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message || "An error occurred");
            } else {
                alert("An error occurred");
            }
            console.error("Login error:", error);
        }
    }


    async function logout() {
        try {
            const response = await axios.post('/logout', {}, { withCredentials: true });

            if (response.data.success) {
                setUser(null);
            } else {
                alert(response.data.message || "An error occurred");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message || "An error occurred");
            } else {
                alert("Unable to log out. Please try again.");
            }
            console.error("Logout error:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };