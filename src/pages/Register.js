import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Forms.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        // ✅ Strong Password Validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("❌ Password must be at least 8 characters long, include a number, and a special character.");
            setLoading(false);
            return;
        }

        // ✅ Check if passwords match
        if (password !== confirmPassword) {
            setError("❌ Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await axios.post("http://localhost:4000/api/auth/register", {
                name, email, password, confirmPassword
            });

            setMessage("✅ Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            setError(error.response?.data?.message || "❌ Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
            </form>
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
};

export default Register;