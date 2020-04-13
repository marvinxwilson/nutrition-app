import React from "react";
import "./styles.css";

function Logout(props) {

  return (
    <button
    onClick={e => {
      localStorage.removeItem('user');
      props.setUser("");
    }}>
      Logout
    </button>
  );
}

export default Logout;