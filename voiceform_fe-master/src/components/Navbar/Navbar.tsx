import styles from "./Navbar.module.scss";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, useContext, useState } from "react";
import ModalWrapper from "../Modal/Modal.tsx";
import { AuthContext } from "../../context/AuthContext.tsx";
import { AccountCircle, LocalHospital, PersonAdd} from "@mui/icons-material";
import { AddUser, PrivateUser } from "../../misc/types.ts";
import { apiClient } from "../../misc/api.ts";
import { SnackbarContext } from "../../context/SnackbarContext.tsx";

interface Props {
  getUsers: () => unknown,
}

export const Navbar = ({getUsers}: Props) => {
  const {tryCatch} = useContext(SnackbarContext);
  const {user, logout} = useContext(AuthContext);
  const [modal, setModal] = useState <null | "doctor" | "pacient" | "form"> (null);
  const [form, setForm] = useState <AddUser>({cnp: "", role: "pacient", firstName: "", lastName: ""});
  const [newUser, setNewUser] = useState <null | PrivateUser> (null);
  const [pacient, setPacient] = useState ("");
  const navigate = useNavigate();

  const closeModal = () => {
    setModal(null);
    setForm({cnp: "", role: "pacient", firstName: "", lastName: ""})
    setPacient("");
  }

  const handleForm = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [key]: e.target.value
    })
  }

  const addUser = async (e: unknown) => {
    (e as {preventDefault: () => void}).preventDefault();
    tryCatch(async () => {
      const data = await apiClient.createUser({
        ...form,
        role: modal as "doctor" | "pacient"
      });
      closeModal();
      setNewUser(data);
      getUsers();
    }, "Utilizator nou creat", "CNP există deja");
  }

  const handlePacient = async (e: ChangeEvent<HTMLInputElement>) => {
    setPacient(e.target.value);
  }

  const searchPacient = async () => {
    navigate("/form/" + pacient);
  }

  return (
    <>
      <ModalWrapper isOpen = {modal === "form"} onClose={closeModal}>
        <div className = {styles.add_modal}>
          <p>Deschide formular</p>
          <form onSubmit={searchPacient}>
            <div className = {styles.inputContainer}>
              <p>CNP:</p>
              <input value = {pacient} onChange={handlePacient}/>
            </div>
            <div className = {styles.controls}>
              <input type = "submit" value = "Deschide"/>
              <button onClick={closeModal}>Închide</button>
            </div>
          </form>
        </div>
      </ModalWrapper>
      <ModalWrapper isOpen = {modal === "doctor" || modal === "pacient"} onClose={() => setModal(null)}>
        <div className = {styles.add_modal}>
          <p>Adaugă {modal}</p>
          <form onSubmit={addUser}>
            <div className = {styles.inputContainer}>
              <p>CNP/ID:</p>
              <input value = {form.cnp} onChange={handleForm("cnp")}/>
            </div>
            <div className = {styles.inputContainer}>
              <p>Nume:</p>
              <input value = {form.firstName} onChange={handleForm("firstName")}/>
            </div>
            <div className = {styles.inputContainer}>
              <p>Prenume:</p>
              <input value = {form.lastName} onChange={handleForm("lastName")}/>
            </div>
            <div className = {styles.controls}>
              <input type = "submit" value = "Adaugă"/>
              <button onClick={closeModal}>Închide</button>
            </div>
          </form>
        </div>
      </ModalWrapper>
      <ModalWrapper isOpen = {!!newUser} onClose={() => setNewUser(null)}>
        {!!newUser && 
          <div className = {styles.add_modal}>
            <p>Informații utilizator nou</p>
            <form onSubmit={addUser}>
              <div className = {styles.inputContainer}>
                <p>CNP/ID: {newUser!.cnp}</p>
              </div>
              <div className = {styles.inputContainer}>
                <p>Nume: {newUser!.profile.firstName}</p>
              </div>
              <div className = {styles.inputContainer}>
                <p>Prenume: {newUser!.profile.lastName}</p>
              </div>
              <div className = {styles.inputContainer}>
                <p>Parolă: {newUser!.password}</p>
              </div>
              <div className = {styles.controls}>
                <button onClick={() => setNewUser(null)}>Close</button>
              </div>
            </form>
            {}
          </div>
        }
      </ModalWrapper>
      {}
      <div className={`${styles.container}`}>
        <div className = {styles.logo}>
          <Link to = "/">
            MedVox
          </Link>
        </div>
        {/* <Link to = "/" className = {styles.link}>
          <House/>
          <p>Home</p>
        </Link> */}
        {user!.role === "admin" && 
            <div className = {styles.link} onClick={() => setModal("doctor")}>
            <PersonAdd/>
            <p>Adaugă doctor</p>
          </div>
        }
        <div className = {styles.link} onClick={() => setModal("pacient")}>
          <PersonAdd/>
          <p>Adaugă pacient</p>
        </div>
        <div className = {styles.link} onClick={() => setModal("form")}>
          <LocalHospital/>
          <p>Deschide dosar medical</p>
        </div>
        <div className = {styles.bottom}>
          <div className = {styles.user_card}>
            <div className = {styles.user_container}>
              <AccountCircle/>
              <div>
                <p className = {styles.name}>{user?.profile.firstName + " " + user?.profile.lastName}</p>
                <p className = {styles.email}>{user?.cnp}</p>
              </div>
            </div>
          </div>
          <div className = {`${styles.option} ${styles.warn}`} onClick={logout}>
            <PowerSettingsNewIcon/>
            <p>Ieși din cont</p>
          </div>
        </div>
      </div>
    </>
  )
}
