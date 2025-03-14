import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:4000/api/auth/reset-password", { token, newPassword });
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleResetPassword}>
                <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;