// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// export default function Join() {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) return;

//     const joinWorkspace = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/workspace/join/${token}`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           alert(data.message || "Join failed");
//           return;
//         }
//         localStorage.setItem("data",JSON.stringify(data.user));

//         localStorage.setItem("role",data.role)
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("workspaceId", data.workspaceId);

//         navigate("/");
//       } catch (err) {
//         console.error(err);
//         alert("Something went wrong");
//       }
//     };

//     joinWorkspace();
//   }, [token, navigate]);

//   return <p>Joining workspace...</p>;
// }

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Join() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { refreshAuth } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    const joinWorkspace = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/workspace/join/${token}`,
          { method: "POST" },
        );

        const data = await res.json();
        // console.log(data);
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem("token", data.token);
        localStorage.setItem("workspace",data.workspaceId);

        await refreshAuth(); // 🔑 THIS IS THE FIX
        navigate("/");
      } catch {
        alert("Join failed");
      }
    };

    joinWorkspace();
  }, [token]);

  return <p>Joining workspace...</p>;
}
