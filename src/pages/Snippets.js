import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Snippets.css";

const Snippets = () => {
    const [snippets, setSnippets] = useState([]);
    const [mySnippets, setMySnippets] = useState([]);
    const [title, setTitle] = useState("");
    const [snippet, setSnippet] = useState("");
    const [category, setCategory] = useState("");
    const [language, setLanguage] = useState("js");
    const [editingSnippet, setEditingSnippet] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [userLoggedIn, setUserLoggedIn] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        fetchSnippets();
        if (userLoggedIn) fetchMySnippets();
    }, [userLoggedIn]);

    // ✅ Fetch All Snippets (Public)
    const fetchSnippets = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/snippets");
            setSnippets(res.data);
        } catch (error) {
            console.error("Error fetching snippets:", error);
        }
    };

    // ✅ Fetch My Snippets (Only for Logged-in Users)
    const fetchMySnippets = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found in localStorage");
                return;
            }

            const res = await axios.get("http://localhost:4000/api/snippets/my-snippets", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("My snippets response:", res.data);
            setMySnippets(res.data);
        } catch (error) {
            console.error("Error fetching my snippets:", error.response?.data || error.message);
        }
    };

    // ✅ Add or Update Snippet
    const handleSnippetSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSnippet) {
                // Update existing snippet
                await axios.put(
                    `http://localhost:4000/api/snippets/${editingSnippet._id}`,
                    { title, category, snippet, language },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            } else {
                // Create new snippet
                await axios.post(
                    "http://localhost:4000/api/snippets",
                    { title, category, snippet, language },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
            }

            setTitle("");
            setSnippet("");
            setCategory("");
            setLanguage("js");
            setEditingSnippet(null);
            fetchSnippets();
            fetchMySnippets();
        } catch (error) {
            console.error("Error saving snippet:", error);
        }
    };

    // ✅ Edit Snippet
    const editSnippet = (snippet) => {
        setEditingSnippet(snippet);
        setTitle(snippet.title);
        setSnippet(snippet.snippet);
        setCategory(snippet.category);
        setLanguage(snippet.language);
    };

    // ✅ Delete Snippet
    const deleteSnippet = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/snippets/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchSnippets();
            fetchMySnippets();
        } catch (error) {
            console.error("Error deleting snippet:", error);
        }
    };

    // ✅ Download Snippet
    const downloadSnippet = async (id, title, language) => {
        try {
            const res = await axios.get(`http://localhost:4000/api/snippets/download/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${title}.${language}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading snippet:", error);
        }
    };

    return (
        <div className="snippet-container">
            <h2>📌 Snippet Manager</h2>

            {/* ✅ Search Box */}
            <input
                type="text"
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={fetchSnippets}>🔍 Search</button>

            {/* ✅ Add/Edit Snippet Form (Only for Logged-in Users) */}
            {userLoggedIn && (
                <form className="snippet-form" onSubmit={handleSnippetSubmit}>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="js">JavaScript</option>
                        <option value="py">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="php">PHP</option>
                        <option value="rb">Ruby</option>
                        <option value="swift">Swift</option>
                        <option value="go">Go</option>
                        <option value="kt">Kotlin</option>
                        <option value="r">R</option>
                        <option value="sh">Shell Script</option>
                        <option value="sql">SQL</option>
                        <option value="xml">XML</option>
                        <option value="yaml">YAML</option>
                        <option value="json">JSON</option>
                    </select>
                    <textarea placeholder="Code Snippet" value={snippet} onChange={(e) => setSnippet(e.target.value)} required />
                    <button type="submit">{editingSnippet ? "✏ Update Snippet" : "➕ Add Snippet"}</button>
                </form>
            )}

            {/* ✅ All Snippets (Public) */}
            <h3>🌎 All Snippets</h3>
            <ul>
                {snippets.map((s) => (
                    <li key={s._id}>
                        <strong>{s.title}</strong> ({s.language}) - {s.category}
                        <button onClick={() => window.open(`http://localhost:4000/api/snippets/${s._id}`, "_blank")}>👁 View</button>
                        <button onClick={() => downloadSnippet(s._id, s.title, s.language)}>⬇ Download</button>
                    </li>
                ))}
            </ul>

            {/* ✅ My Snippets (Logged-in Users) */}
            {userLoggedIn && (
                <>
                    <h3>📂 My Snippets</h3>
                    <ul>
                        {mySnippets.map((s) => (
                            <li key={s._id}>
                                <strong>{s.title}</strong> ({s.language}) - {s.category}
                                <button onClick={() => editSnippet(s)}>✏ Edit</button>
                                <button onClick={() => deleteSnippet(s._id)}>🗑 Delete</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Snippets;