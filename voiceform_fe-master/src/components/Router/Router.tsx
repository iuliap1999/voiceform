import { useContext } from "react";
import { Outlet, Navigate, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Login from "../../pages/Login/Login";
import {Form} from "../../pages/Form/Form.tsx"
import { Dashboard } from "../../pages/Dashboard/Dashboard";

const ProtectedRoute = () => {
  const {user} = useContext(AuthContext);
  console.log(user);

  if (user === undefined) return <></>
  if (user === null) return <Navigate to = "/login"/>
  return <Outlet/>

}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element = {<ProtectedRoute/>}>
        <Route path="/" element = {<Dashboard/>}/>
      </Route> 
      <Route path="/form/:cnp?" element = {<Form/>}/>
      <Route path="/login" element = {<Login/>}/>
    </>
  )
)