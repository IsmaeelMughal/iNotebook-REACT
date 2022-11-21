import React from "react";

function Alert(props) {
  return (
    <div style={{ height: "70px" }}>
      <div className={`alert alert-${props.type}`} role="alert">
        {props.message}
      </div>
    </div>
  );
}

export default Alert;
