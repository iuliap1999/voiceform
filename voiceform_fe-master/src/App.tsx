import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export const App = () => {
  const {user, fetchUserData} = useContext(AuthContext);

  return (
    <div>
      <button onClick={fetchUserData}>Get user data</button>
      <p>{user!.id}</p>
      <p>{user!.cnp}</p>
      <p>{user!.role}</p>
      {/* <button onClick={login}>Login</button> */}
    </div>
  )
}