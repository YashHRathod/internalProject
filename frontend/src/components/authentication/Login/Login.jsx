import React, { useState, useContext } from "react";
import styles from "./Login.module.css";
import { ArrowRightIcon } from "@primer/octicons-react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
// const url = "/authpage.png";
function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ email, password });
    const temp = {
      email: email,
      password: password,
    };
    console.log(temp);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,password }),
      });

      const data = await res.json();
      // console.log(data);
      if (!res.ok) throw new Error(data.message || "Login failed");

      
      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));

      setUser(data);
      toast.success("sucessfully login", { transition: Bounce });
      navigate("/");
      
      // console.log("YASHMC!!");
    } catch (err) {
      console.log(err);
      toast.error("Unable to Login", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };
  // if(loading)return <h2>loafing</h2>

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.authBox}>
          <h1 className={styles.title}>Start Orcas</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Work Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />

            <div className={styles.passwordBox}>
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
              <button
                type="button"
                className={styles.eye}
                onClick={() => setShow((prev) => !prev)}
              >
                {show ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>

            <button type="submit" className={styles.primaryBtn}>
              {loading ? "Login..." : "Login"} <ArrowRightIcon size={16} />
            </button>

            <div className={styles.divider} />

            <p className={styles.footerText}>
              Don't have an account?{" "}
              <span>
                <NavLink to="/Signup" className={styles.loginBtn}>
                  SignUp
                </NavLink>
              </span>
            </p>
          </form>
        </div>
      </div>
      <div className={styles.verticaldivider} />
      <div className={styles.right}>
        <img
          src= "/authpage.png"
          alt="Illustration"
          className={styles.image}
        />
      </div>
    </div>
  );
}

export default Login;
