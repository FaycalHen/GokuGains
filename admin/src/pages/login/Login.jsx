import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/apiCalls";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isFetching, error, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      navigate("/"); // Navigate to home page after login
    }
  }, [currentUser, navigate]);

  const handleClick = (e) => {
    e.preventDefault();
    login(dispatch, { username, password });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <input
          style={{ padding: 10, marginBottom: 20 }}
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={{ padding: 10, marginBottom: 20 }}
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <span style={{ color: "red", marginBottom: 20 }}>Invalid username or password!</span>}
        <button onClick={handleClick} style={{ padding: 10, width: 100 }} disabled={isFetching}>
          {isFetching ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
