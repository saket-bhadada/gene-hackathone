import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9QoH__HaVHVSNbC5clGgHrafCxjHzr_A",
  authDomain: "genehackathon.firebaseapp.com",
  projectId: "genehackathon",
  storageBucket: "genehackathon.appspot.com",
  messagingSenderId: "540527978516",
  appId: "1:540527978516:web:8f9d7f272dfffa34a15f01",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Main App Component (Controller) ---
export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("register"); // Initial page is registration

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // You can replace this with a more sophisticated loading spinner
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} userData={userData} />;
  }

  switch (page) {
    case "login":
      return <LoginPage setPage={setPage} />;
    case "register":
    default:
      return <RegisterPage setPage={setPage} />;
  }
}

// --- Authentication Page Components ---

const RegisterPage = ({ setPage }) => {
  // This is the component adapted from your teammate's code
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f0f9ff",
      fontFamily: "sans-serif",
      padding: "1rem",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "24px",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      padding: "40px",
      width: "100%",
      maxWidth: "480px",
      border: "1px solid #e0e7ff",
    },
    header: { textAlign: "center", marginBottom: "24px" },
    title: { fontSize: "36px", fontWeight: "800", color: "#1d4ed8" },
    subtitle: { color: "#6b7280", fontSize: "18px" },
  };
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>CampusGuru</h1>
          <p style={styles.subtitle}>Create Account</p>
        </div>
        <SignUpForm />
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#6b7280" }}>
          Already have an account?{" "}
          <button
            onClick={() => setPage("login")}
            style={{
              color: "#1d4ed8",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "600",
            }}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

const LoginPage = ({ setPage }) => {
  // This is a new component for logging in, reusing the same style
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f0f9ff",
      fontFamily: "sans-serif",
      padding: "1rem",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "24px",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      padding: "40px",
      width: "100%",
      maxWidth: "480px",
      border: "1px solid #e0e7ff",
    },
    header: { textAlign: "center", marginBottom: "24px" },
    title: { fontSize: "36px", fontWeight: "800", color: "#1d4ed8" },
    subtitle: { color: "#6b7280", fontSize: "18px" },
  };
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back!</h1>
          <p style={styles.subtitle}>Login to your account</p>
        </div>
        <SignInForm />
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#6b7280" }}>
          Don't have an account?{" "}
          <button
            onClick={() => setPage("register")}
            style={{
              color: "#1d4ed8",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "600",
            }}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

// --- Form Components with Firebase Logic ---

function SignUpForm() {
  const [role, setRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for all form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [courseProgram, setCourseProgram] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        fullName,
        role,
      };

      if (role === "Teacher") {
        userData.specialization = specialization;
      } else {
        userData.courseProgram = courseProgram;
      }

      await setDoc(doc(db, "users", user.uid), userData);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
    setLoading(false);
  };

  const styles = {
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    label: {
      fontWeight: "600",
      color: "#374151",
      marginBottom: "4px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "none",
      fontSize: "16px",
      boxSizing: "border-box",
      outline: "none",
      backgroundColor: "transparent",
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      paddingRight: "12px",
    },
    iconButton: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "0",
      color: "#6b7280",
    },
    button: {
      width: "100%",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      padding: "16px",
      borderRadius: "16px",
      fontSize: "18px",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "12px",
    },
    tabs: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      backgroundColor: "#e0f2fe",
      borderRadius: "9999px",
      padding: "4px",
      marginBottom: "24px",
    },
    tab: {
      padding: "8px",
      borderRadius: "9999px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
    },
  };

  const activeTabStyle = {
    ...styles.tab,
    backgroundColor: "#ffffff",
    color: "#1d4ed8",
  };
  const inactiveTabStyle = {
    ...styles.tab,
    backgroundColor: "transparent",
    color: "#374151",
  };

  return (
    <form onSubmit={handleRegister} style={styles.form}>
      <div style={styles.tabs}>
        <button
          type="button"
          onClick={() => setRole("Student")}
          style={role === "Student" ? activeTabStyle : inactiveTabStyle}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole("Teacher")}
          style={role === "Teacher" ? activeTabStyle : inactiveTabStyle}
        >
          Teacher
        </button>
      </div>

      <div>
        <label style={styles.label}>Full Name</label>
        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label style={styles.label}>Email Address</label>
        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label style={styles.label}>Password</label>
        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            style={styles.iconButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>
      <div>
        <label style={styles.label}>Confirm Password</label>
        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            style={styles.iconButton}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      {role === "Teacher" && (
        <div>
          <label style={styles.label}>Specialization</label>
          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g., Mathematics, Physics"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
            />
          </div>
        </div>
      )}
      {role === "Student" && (
        <div>
          <label style={styles.label}>Course/Program</label>
          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g., B.Tech in CSE"
              value={courseProgram}
              onChange={(e) => setCourseProgram(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <button style={styles.button} type="submit" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
    setLoading(false);
  };

  const styles = {
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    label: {
      fontWeight: "600",
      color: "#374151",
      marginBottom: "4px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "none",
      fontSize: "16px",
      boxSizing: "border-box",
      outline: "none",
      backgroundColor: "transparent",
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      paddingRight: "12px",
    },
    iconButton: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "0",
      color: "#6b7280",
    },
    button: {
      width: "100%",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      padding: "16px",
      borderRadius: "16px",
      fontSize: "18px",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "12px",
    },
  };

  return (
    <form onSubmit={handleLogin} style={styles.form}>
      <div>
        <label style={styles.label}>Email Address</label>
        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label style={styles.label}>Password</label>
        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            style={styles.iconButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <button style={styles.button} type="submit" disabled={loading}>
        {loading ? "Logging In..." : "Login"}
      </button>
    </form>
  );
}

// --- Dashboard Component (For Logged-In Users) ---
const Dashboard = ({ user, userData }) => {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch courses in real-time
  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coursesData = [];
      querySnapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() });
      });
      setCourses(coursesData);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle || !courseDesc) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "courses"), {
        title: courseTitle,
        description: courseDesc,
        educatorId: user.uid,
        educatorName: userData.fullName,
        createdAt: new Date(),
      });
      setCourseTitle("");
      setCourseDesc("");
    } catch (error) {
      console.error("Error creating course: ", error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Welcome, {userData?.fullName || "User"}!
          </h1>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "1.1rem",
              color: "#374151",
            }}
          >
            Your role is: <strong>{userData?.role}</strong>
          </p>
        </div>
        <button
          onClick={() => signOut(auth)}
          style={{
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </header>

      {userData?.role === "Teacher" && (
        <div
          style={{
            marginBottom: "2rem",
            padding: "2rem",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Create a New Course
          </h2>
          <form
            onSubmit={handleCreateCourse}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="text"
              placeholder="Course Title"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              required
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            />
            <textarea
              placeholder="Course Description"
              value={courseDesc}
              onChange={(e) => setCourseDesc(e.target.value)}
              required
              style={{
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                minHeight: "100px",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </form>
        </div>
      )}

      <div
        style={{
          marginTop: "2rem",
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          Available Courses
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#1d4ed8",
                  }}
                >
                  {course.title}
                </h3>
                <p style={{ marginTop: "0.5rem", color: "#6b7280" }}>
                  {course.description}
                </p>
                <p
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.875rem",
                    color: "#4b5563",
                  }}
                >
                  <em>Taught by: {course.educatorName}</em>
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: "#6b7280" }}>
              No courses have been created yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Helper SVG Icon Components ---
const EyeIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />{" "}
    <circle cx="12" cy="12" r="3" />{" "}
  </svg>
);
const EyeOffIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />{" "}
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />{" "}
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />{" "}
    <line x1="2" x2="22" y1="2" y2="22" />{" "}
  </svg>
);
