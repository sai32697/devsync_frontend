import "../styles/Home.css";

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to DevSync</h1>
            <p>A simple platform for managing your tasks and saving code snippets.</p>
            <div className="features">
                <div className="feature-box">
                    <h3>📝 Task Manager</h3>
                    <p>Organize your tasks efficiently with priority levels and deadlines.</p>
                </div>
                <div className="feature-box">
                    <h3>💻 Code Snippets</h3>
                    <p>Save and organize your frequently used code snippets.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;