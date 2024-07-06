import { ChangeEvent, useEffect, useState } from "react";
import styles from "./SpeechInput.module.scss";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {  } from "../../context/AuthContext";


interface Props {
  value: string,
  label: string,
  onChange: (x: string) => unknown,
  textArea?: boolean,
  [key: string]: any,
}

export const SpeechInput = ({value, onChange, label, textarea, ...props}: Props) => {
  const {
    transcript,
    finalTranscript,
    resetTranscript
    
  } = useSpeechRecognition();
  const [isTarget, setIsTarget] = useState(false);

  const handleChange = (x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(x.target.value);
  }

  const handleListen = () => {
    if (isTarget) {
      SpeechRecognition.stopListening();
      onChange((textarea ? (value + " ") : "") + transcript);
      setIsTarget(false);
      return;
    }
    resetTranscript();
    if (textarea) {
      SpeechRecognition.startListening({language: "ro-RO", continuous: true});
    }
    else {
      onChange("");
      SpeechRecognition.startListening({language: "ro-RO"});
    }
    setIsTarget(true);
  }

  useEffect(() => {
    if (finalTranscript && isTarget) {
      setIsTarget(false);
      onChange(value + finalTranscript);
    }
  }, [finalTranscript, isTarget])

  return (
    <div className = {styles.container}>
      {label !== "" && <p>{label}</p>}
      <div>
        <svg style = {{fill: isTarget ? "red" : ""}} onClick={handleListen} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/></svg>
        {textarea ? 
          <textarea disabled={isTarget} {...props} value = {(value === "" ? "" : value + " ") + (isTarget ? transcript : "")} onChange={handleChange}/> :
          <input disabled={isTarget} {...props} type="text" value = {(value === "" ? "" : value + " ") + (isTarget ? transcript : "")} onChange={handleChange}/>
        }
      </div>
      {/* <button onClick={handleListen}>AA</button> */}
    </div>
  )
}