import React, {FC, ReactElement} from 'react';
import Modal from 'react-modal';
import styles from "./Modal.module.scss";

interface Props {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  conStyle?: object;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 0,
    border: "none",
    background: "none",
  },
  overlay: {
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
};

const ModalWrapper: FC<Props> = (props: Props): ReactElement => {

  return (
    <Modal 
      isOpen={props.isOpen} 
      onRequestClose={props.onClose} 
      style={{...customStyles}} 
      ariaHideApp={false}
    >
      <div className={styles.modal} style={{...props.conStyle}}>
        {props.children}
      </div>
    </Modal>
  );
};

export default ModalWrapper;