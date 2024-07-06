import React, { useContext } from 'react'
import { useState } from 'react';
import "./Login.scss";
import {useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import { SnackbarContext } from '../../context/SnackbarContext';
import { AuthContext } from '../../context/AuthContext';


const Login = () => {
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(true);
  const [formData, setFormData] = useState({cnp: "", password: ""});
  const {tryCatch} = useContext(SnackbarContext);

  const handleFormChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [key]: e.target.value})
  }

  const togglePassword = () => {
    setHidden(!hidden);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    tryCatch(async () =>  {
      await login(formData.cnp, formData.password);
      navigate("/");
    }, "Logat cu succes");

  }

  return (
      <div className="auth"> 
        <div className="header">
          <p>MedVox - Dosare medicale simplificate prin recunoaștere vocală!</p>
        </div>
        <form onSubmit = {handleSubmit}>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faAt}/>
            <input onChange={handleFormChange("cnp")} type="text" required placeholder="CNP"/>
          </div>
          <div className="input-wrapper">
            <FontAwesomeIcon icon = {faLock}/>
            <input onChange={handleFormChange("password")} type = {hidden ? "password" : "text"} required placeholder="Parola"/>
            {hidden ? 
              <FontAwesomeIcon icon = {faEye} onClick={togglePassword}/> : 
              <FontAwesomeIcon icon = {faEyeSlash} onClick={togglePassword}/>
            }
          </div>
          <input type = "submit" value = "Intră în cont"/>
        </form>
        {/* <Link to = "/forgot" className = "mirror">Forgot Password?</Link> */}
        {/* {user && <Link to = "/" className = "mirror">Go to home</Link>} */}
      </div>
  );
}

export default Login;