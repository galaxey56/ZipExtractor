import React from "react";
import ReactDom from "react-dom";
import Card from "../UI/Card";
import classes from "./Error.module.css";

const ModalOverlay = (props) => {
  return (
    <Card className={classes.modal}>
      <header className={classes.headers}>
        <h2>Warning!!</h2>
      </header>
      <div className={classes.content}>
        <p>File format Not Supported!!</p>
      </div>
      <button className="btn btn-secondary" onClick={props.onClick} >Okay</button>
    </Card>
  );
};
const BackDrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick} />;
};

const Error = (props) => {
  return (
    <>
      {ReactDom.createPortal(
        <BackDrop onClick={props.handler} />,
        document.getElementById("backdrop")
      )}
      {ReactDom.createPortal(
        <ModalOverlay onClick={props.handler} />,
        document.getElementById("backdrop")
      )}
    </>
  );
};

export default Error;
