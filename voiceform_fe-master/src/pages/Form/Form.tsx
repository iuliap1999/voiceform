import { useContext, useEffect, useState } from "react";
import styles from "./Form.module.scss";
import { AddProfile, Profile } from "../../misc/types";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbarContext } from "../../context/SnackbarContext";
import { apiClient } from "../../misc/api";
import {SpeechInput} from "../../components/SpeechInput/SpeechInput"
import doctorImage from "../../assets/doctor.png";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";
// import { hasStrictPivilege } from "../../misc/utils";
import { Delete } from "@mui/icons-material";

export const Form = () => {
  const {user} = useContext(AuthContext);
  const {cnp} = useParams();
  const [data, setData] = useState <Profile | undefined | null> ();
  const [formData, setFormData] = useState <AddProfile | undefined> ();
  const [newComment, setNewComment] = useState ("");
  const {tryCatch} = useSnackbarContext();
  const navigate = useNavigate();

  useEffect(() => {
    tryCatch(async () => {
      const x = await apiClient.getProfile(cnp);
      setData(x);
      setFormData(x);
    })
  }, [cnp])

  const addComment = () => {
    tryCatch(async () => {  
      const c = await apiClient.addComment(cnp ?? user!.cnp, {content: newComment});
      setNewComment("");
      setData({
        ...data,
        //@ts-ignore
        comments: [c, ...data!.comments]
      })
    }, "Comentariul a fost adăugat")
  }

  const handleChange = (key: string) => (x: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [key]: x,
    })
  }

  const saveChanges = () => {
    tryCatch(async () => {
      const data = {...formData} as any;
      delete data.comments;
      await apiClient.setProfile(cnp ?? user!.cnp, data)
    }, "Datele au fost actualizate")
  }

  const deleteUser = () => {
    tryCatch(async () => {
      await apiClient.deleteUser(cnp ?? user!.cnp);
      navigate("/");
    }, "Profilul a fost sters cu succes");
  }

  const deleteComment = (x: number) => {
    tryCatch(async () => {
      await apiClient.deleteComment(x);
      setData({
        ...data,
        //@ts-ignore
        comments: data?.comments.filter(y => y.id !== x)
      })
    }, "Comentariul a fost șters")
  }

  if (!data) return <></>

  return (
    <div className = {styles.container}>
      <div className = {styles.inner_card}>
        <div className = {styles.user_card}>
          {/* <AccountCircle/> */}
          <h2>Dosarul Medical {cnp ? `#${cnp}` : "Personal"}</h2>
        </div>
        <h3>Date personale generale</h3>
        <div className = {styles.row}>
          <SpeechInput label = "Nume" value = {formData!.firstName} onChange={handleChange("firstName")}/>
          <SpeechInput label = "Prenume" value = {formData!.lastName} onChange={handleChange("lastName")}/>
        </div>
        <div className = {styles.row}>
          <SpeechInput label = "Adresă" value = {formData!.address} onChange={handleChange("address")}/>
        </div>
        <div className = {styles.row}>
          <SpeechInput label = "Data nașterii" value = {formData!.birthDate} onChange={handleChange("birthDate")}/>
          <SpeechInput label = "Grupă sanguină" value = {formData!.bloodType} onChange={handleChange("bloodType")}/>
        </div>
        <div className = {styles.row}>
          <SpeechInput label = "Gen" value = {formData!.gender} onChange={handleChange("gender")}/>
          <SpeechInput label = "Înălțime" value = {formData!.height} onChange={handleChange("height")}/>
          <SpeechInput label = "Greutate" value = {formData!.weight} onChange={handleChange("weight")}/>
        </div>
        <div className = {styles.controls}>
          {user!.role === "pacient" ? 
            <button className = {styles.return} onClick={() => navigate("/login")}>Ieși din cont</button>
            :
            <>
              <button className = {styles.return} onClick={() => navigate("/")}>Pagina principală</button>
              {/* {hasStrictPivilege(user?.role!, data.)} */}
              <button className = {styles.delete} onClick={deleteUser}>Șterge</button>
            </>
          }
          <button onClick={saveChanges}>Salvează</button>
        </div>
        <h3>Istoricul medical</h3>
        <div className = {styles.history}>
          {user!.role !== "pacient" && <div className = {styles.comment + " " + styles.add_comment}>
            <img src = {doctorImage}/>
              <div>
                <div className = {styles.titlerow}>
                  <p className = {styles.who}>Doctor <b>{user!.profile.lastName} {user!.profile.firstName}</b></p>
                  <p className = {styles.timestamp}>{moment().format("MMMM Do YYYY, HH:mm")}</p>
                </div>
                <SpeechInput label = "" textarea = {true} placeholder = "Adaugă raportul medical..." value = {newComment} onChange={(x) => setNewComment(x)}/>
                {/* <textarea placeholder="Type here..." value = {newComment} onChange = {handleNewComment}/> */}
                <button onClick={addComment}>Adaugă comentariu</button>
              </div>
          </div>}
          {data.comments.map(cm => (
            <div className = {styles.comment}>
              <img src = {doctorImage}/>
              <div>
                <div className = {styles.titlerow}>
                  <p className = {styles.who}>Doctor <b>{cm.author.lastName} {cm.author.firstName}</b></p>
                  <p className = {styles.timestamp}>{moment(cm.timestamp).format("MMMM Do YYYY, HH:mm")}</p>
                  {(cm.author.id === user!.profile.id || user?.role === "admin") && <Delete onClick= {() => deleteComment(cm.id)}/>}
                </div>
                <p>{cm.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}