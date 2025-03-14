import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Tasks.css"; // ✅ Import the CSS file

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState("Not Started");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/tasks", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:4000/api/tasks",
                { title, description, priority, deadline, status },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setTitle("");
            setDescription("");
            setPriority("Medium");
            setDeadline("");
            setStatus("Not Started");
            fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const updateTask = async (id, updatedStatus) => {
        try {
            await axios.put(`http://localhost:4000/api/tasks/${id}`, { status: updatedStatus }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const getProgressPercentage = (status) => {
        switch (status) {
            case "Not Started": return 0;
            case "In Progress": return 50;
            case "Completed": return 100;
            default: return 0;
        }
    };

    return (
        <div className="task-container">
            <h2>📝 Task Management</h2>
            <form className="task-form" onSubmit={addTask}>
                <label>Task Title:</label>
                <input
                    type="text"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label>Description:</label>
                <textarea
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="task-row">
                    <div>
                        <label>Priority:</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div>
                        <label>Status:</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                        </select>
                    </div>
                </div>
                <label>Deadline:</label>
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
                <button type="submit">➕ Add Task</button>
            </form>
            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task._id} className="task-item">
                        <strong>{task.title}</strong> - {task.description}
                        <br />
                        <span>📌 Priority: {task.priority}</span> |
                        <span> 📆 Deadline: {new Date(task.deadline).toLocaleString()}</span> |
                        <span> 🚀 Status: {task.status}</span>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${getProgressPercentage(task.status)}%` }}>
                                {getProgressPercentage(task.status)}%
                            </div>
                        </div>
                        {task.status !== "Completed" ? (
                            <>
                                <button className="btn-progress" onClick={() => updateTask(task._id, "In Progress")}>
                                    🚀 Mark as In Progress
                                </button>
                                <button className="btn-complete" onClick={() => updateTask(task._id, "Completed")}>
                                    ✅ Mark as Completed
                                </button>
                            </>
                        ) : (
                            <button className="btn-delete" onClick={() => deleteTask(task._id)}>❌ Delete Task</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;