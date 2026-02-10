import React from 'react'
import styles from "./Home.module.css"
import { FcCheckmark } from "react-icons/fc";
export default function checkIcon() {
  return (
    <div>
        <div className={styles.checkbox}/>
        <FcCheckmark  color={"blue"}/>
    </div>
  )
}
