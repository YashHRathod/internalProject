import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { ArrowRightIcon } from "@primer/octicons-react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
    const navigate = useNavigate();
 const handleSubmit = (e) => {
  e.preventDefault();

  const temp = {
    email: email,
    password: password,
  };

  localStorage.setItem("user", JSON.stringify(temp));
  navigate("/")
};


  return (
    <div className={styles.container}>
 
      <div className={styles.left}>
        <div className={styles.authBox}>
          <h1 className={styles.title}>Join QuickTask Link</h1>

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
              {show?<AiFillEye />:<AiFillEyeInvisible />}
              </button>
            </div>

            <button type="submit" className={styles.primaryBtn}>
              Create Account <ArrowRightIcon size={16} />
            </button>

            <div className={styles.divider} />

           
            <p className={styles.footerText}>
              Already have an account? <span><NavLink to="/login" className={styles.loginBtn}>
          login
        </NavLink></span>
            </p>
          </form>
        </div>
      </div>
      <div className={styles.verticaldivider}/>
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
