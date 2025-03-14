import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("https://devsync-backend-1.onrender.com/api/auth/forgot-password", { email });
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error sending email");
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleForgotPassword}>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Send Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;