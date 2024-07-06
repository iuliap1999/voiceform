import { Folder, Group, MedicalServices, Person } from "@mui/icons-material";
import { Navbar } from "../../components/Navbar/Navbar";
import styles from "./Dashboard.module.scss";
import { useContext, useEffect, useState } from "react";
import { PrivateUser, PublicUser, Stats } from "../../misc/types";
import { SnackbarContext } from "../../context/SnackbarContext";
import { apiClient } from "../../misc/api";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { narrow } from "../../misc/utils";
import { Link, useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const {tryCatch} = useContext(SnackbarContext);
  const {user} = useContext(AuthContext);
  const [users, setUsers] = useState <PublicUser[]> ([]);
  const navigate = useNavigate();
  const [stats, setStats] = useState <undefined | Stats> ();

  const getUsers = () => {tryCatch(async () => {
    const data = await apiClient.listUsers();
    setUsers(data);
  })};

  useEffect(() => {
    if (user && user.role === "pacient") navigate("/form")
  }, [user])

  useEffect(() => {
    tryCatch(async  () => {
      setStats(await apiClient.getStats());
    })
  }, [users])

  useEffect(() => {
    tryCatch(async () => {

      if (user!.role !== "pacient") getUsers();
    });
  }, []);
  
  if (!stats) return <></>

  return (
    <div className = {styles.container}>
      <Navbar getUsers={getUsers}/>
      <div className = {styles.content}>
        <div className = {styles.card}>
          <div className = {styles.stat}>
            <Person/>
            <p className = {styles.label}>
              Pacienți totali
            </p>
            <p className = {styles.value}>
              {stats.pacients}
            </p>
          </div>
          <div className = {styles.stat}>
            <Group/>
            <p className = {styles.label}>
              Doctori totali
            </p>
            <p className = {styles.value}>
              {stats.doctors}
            </p>
          </div>
          <div className = {styles.stat}>
            <MedicalServices/>
            <p className = {styles.label}>
              Comentarii totale
            </p>
            <p className = {styles.value}>
              {stats.comments}
            </p>
          </div>
          <div className = {styles.stat}>
            <Folder/>
            <p className = {styles.label}>
              Comentarii în ultimele 24h
            </p>
            <p className = {styles.value}>
              {stats.recentComments}
            </p>
          </div>
        </div>
        <div className = {styles.table}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nume și prenume</TableCell>
                  <TableCell>CNP/ID</TableCell>
                  <TableCell>Rol</TableCell>
                  {user?.role === "admin" && <TableCell>Parolă</TableCell>}
                  <TableCell>Accesare raport medical</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((x) => (
                  <TableRow
                    key={x.id}
                  >
                    <TableCell component="th" scope="row">
                      {x.profile.firstName + " " + x.profile.lastName}
                    </TableCell>
                    <TableCell>{x.cnp}</TableCell>
                    <TableCell>{x.role}</TableCell>
                    {user!.role === "admin" && narrow <PrivateUser> (x) && <TableCell>{x.password}</TableCell>}
                    <TableCell>
                      <Link className = {styles.formular} to = {"/form/" + x.cnp}>
                        Accesează formular
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  )
}