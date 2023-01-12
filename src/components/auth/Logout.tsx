import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { blue } from "@mui/material/colors";

interface Props {
  navigateTo?: string;
}

const Logout = ({ navigateTo = "/login" }: Props) => {
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const logout = () => {
    setDisabled(true);
    signOut(auth)
      .then(() => {
        navigate(navigateTo);
      })
      .catch((error) => {
        console.error(error);
        setDisabled(false);
      });
  };

  return (
    <div>
      {/* TODO: Link component */}
      <div style={{color: blue[300], cursor: 'pointer'}} onClick={logout}>
        Logout
      </div>
    </div>
  );
};

export default Logout;
