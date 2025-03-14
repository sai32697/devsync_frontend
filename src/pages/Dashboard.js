import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [snippets, setSnippets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taskRes = await axios.get("http://localhost:4000/api/tasks", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const snippetRes = await axios.get("http://localhost:4000/api/snippets", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                setTasks(taskRes.data);
                setSnippets(snippetRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Welcome to DevSync Dashboard</h1>
            <div className="dashboard-stats">
                <div className="stat-box">
                    <h2>📌 Total Tasks</h2>
                    <p>{tasks.length}</p>
                </div>
                <div className="stat-box">
                    <h2>📜 Total Snippets</h2>
                    <p>{snippets.length}</p>
                </div>
            </div>

            <div className="dashboard-actions">
                <Link to="/tasks" className="action-btn">Manage Tasks</Link>
                <Link to="/snippets" className="action-btn">Manage Snippets</Link>
            </div>
        </div>
    );
};

export default Dashboard;