import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Forms.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:4000/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            setMessage("✅ Login successful! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (error) {
            setError(error.response?.data?.message || "❌ Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            </form>

            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
};

export default Login;