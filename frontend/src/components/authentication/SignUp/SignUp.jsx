import React, { useState, useContext } from "react";
import styles from "./SignUp.module.css";
import { ArrowRightIcon } from "@primer/octicons-react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";

function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      console.log(email,name,password);

      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // only leaders allowed to signup; set role to "leader"
        body: JSON.stringify({ name, email, password, role: "leader" }),
      });
      console.log(res)
      if(res.status==400){
        toast.error("User with this email id already exist",{ transition: Bounce })
      }

      if (!res.ok) {
        const errorData = await res.json();
        // console.log("YASHMC!!")
        throw new Error(errorData.message || "Signup failed");
      }

      const data = await res.json();
      console.log(data)
      if (!res.ok) throw new Error(data.message || "Signup failed");

      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      console.log("Signup success:", data);
      toast.success("sucessfully login", { transition: Bounce });
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err.message);
        toast.error("Unable to SignUp", { transition: Bounce });
      // alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.authBox}>
          <h1 className={styles.title}>Join Orcas</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
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
              {loading ? "Creating..." : "Create Account"}
              <ArrowRightIcon size={16} />
            </button>

            <div className={styles.divider} />

            <p className={styles.footerText}>
              Already have an account?{" "}
              <span>
                <NavLink to="/login" className={styles.loginBtn}>
                  login
                </NavLink>
              </span>
            </p>
          </form>
        </div>
      </div>
      <div className={styles.verticaldivider} />
      <div className={styles.right}>
        <img
          src="\src\assets\authpage.png"
          alt="Illustration"
          className={styles.image}
        />
      </div>
    </div>
  );
}

export default SignUp;
