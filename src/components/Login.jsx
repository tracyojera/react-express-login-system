import { useState } from 'react';
import { useAuth } from './AuthContext';
import Register from './Register';

function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toggle, setToggle] = useState(true);

    function handleLoginSubmit(e) {
        e.preventDefault();
        login(email, password);
    }

    function handleToggle() {
        setToggle(!toggle); // This toggles the state directly
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    return (
        <div className="login-container">
        <div className="login-card">
            {toggle ? (
                <>
                    <div className="top-form">Please Login!</div>
                    <form onSubmit={handleLoginSubmit} autoComplete="off">
                        <input
                            type="email"
                            name="login-email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Email"
                            autoComplete="off"
                            required
                        />
                        <input
                            type="password"
                            name="login-password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Password"
                            autoComplete="off"
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                    <div className="bottom-form">
                        Don&apos;t have an account? Sign up{' '}
                        <span onClick={handleToggle}>here</span>
                    </div>
                </>
            ) : (
                <>
                    <Register />
                    <div className="bottom-form">
                        Already have an account? Login{' '}
                        <span onClick={handleToggle}>here</span>
                    </div>
                </>
            )}
        </div>
    </div>    
    );
}

export default Login;