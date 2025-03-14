import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Check if user is logged in

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h1 className="logo">DevSync</h1>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/tasks">Tasks</Link>
                <Link to="/snippets">Snippets</Link>

                {/* Show Login/Register if user is NOT logged in */}
                {!token ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    // Show Logout Button if user IS logged in
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;