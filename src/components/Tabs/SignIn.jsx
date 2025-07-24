import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import mockUsers from "../../data/mockUsers";

const SignIn = () => {
  const [email, setEmail] = useState("Loisbecket@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);

const validateForm = () => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    setToast("Invalid email format.");
    return false;
  }
  if (password.trim().length === 0) {
    setToast("Password cannot be empty.");
    return false;
  }
  if (password.length < 6) {
    setToast("Password must be at least 6 characters long.");
    return false;
  }
  return true;
};

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userMatch = mockUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (userMatch) {
      setToast("Login successful!");
      setTimeout(() => navigate("/Dashboard"), 1500);
    } else {
      setToast("Invalid email or password.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #bfdbfe, #ddd6fe, #fbcfe8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "1.5rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#ffffff",
        borderRadius: "1.5rem",
        padding: "2rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        margin: "0 auto",
        animation: "fadeIn 1s ease-in-out"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#121820ff",
            marginBottom: "0.5rem"
          }}>
            Sign in to your Account
          </h2>
          <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>
            Enter your email and password to log in
          </p>
        </div>

        <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              width: "90%",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              color: "black",
              border: "1px solid #919fbdff",
              backgroundColor: "#fbcfe8"
            }}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: "75%",
                padding: "0.75rem 1rem",
                color: "black",
                paddingRight: "3rem",
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
                backgroundColor: "#fbcfe8"
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer"
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.875rem"
          }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#4b5563"
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#9333ea",
              color: "white",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              fontWeight: "500",
              border: "none",
              cursor: "pointer"
            }}
          >
            Log in
          </button>

          <div style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "0.875rem"
          }}>
            Or
          </div>

          <button
            type="button"
            style={{
              width: "100%",
              color: "black",
              border: "1px solid #e5e7eb",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              backgroundColor: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: "20px", height: "20px", marginRight: "0.5rem" }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </form>

        {toast && (
          <div style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            backgroundColor: "#f87171",
            color: "white",
            fontSize: "0.875rem",
            textAlign: "center",
            animation: "fadeIn 0.3s ease"
          }}>
            {toast}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SignIn;
