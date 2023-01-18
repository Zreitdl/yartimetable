import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import Header from "../Header";
// import NavLink from "../NavLink";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewListIcon from "@mui/icons-material/ViewList";

import style from "./_.module.scss";
import { NavLink } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      {/* <Header />
      <div className={style.container}>
        <div className={style.sideMenu}>
          <NavLink to="/">
            <Typography variant="body" color="text">
              Timetable
            </Typography>
          </NavLink>
          <NavLink to="/list">Timetable records</NavLink>
        </div>
        
      </div> */}
      <Box className={style.boxContainer}>
        <div className={style.aside}>
          <Typography className={style.logo} color={"text"} variant="h6">
            Yartimetable
          </Typography>
          <List
          // subheader={
          //   <Box sx={{ pl: 3, mb: 1.5 }}>
          //     <Typography variant="subtitle2" color="textSecondary">
          //       {"Hello"}
          //     </Typography>
          //     {/* only available in paid version */}
          //   </Box>
          // }
          >
            <NavLink
              to={"/"}
              className={style.navLink}
              children={({ isActive }) => {
                return (
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 28,
                        // display: "flex",
                        // alignItems: "center",
                      }}
                    >
                      <CalendarMonthIcon
                        color={isActive ? "primary" : "inherit"}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          color={isActive ? "primary" : "text"}
                          variant="body1"
                        >
                          Timetable
                        </Typography>
                      }
                    />
                  </ListItemButton>
                );
              }}
            />
            <NavLink
              to={"/list"}
              className={style.navLink}
              children={({ isActive }) => {
                return (
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 28,
                      }}
                    >
                      <ViewListIcon color={isActive ? "primary" : "inherit"} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          color={isActive ? "primary" : "text"}
                          variant="body1"
                        >
                          Timetable records list
                        </Typography>
                      }
                    />
                  </ListItemButton>
                );
              }}
            />
          </List>
        </div>
        <Header className={style.header} />
        <Box className={style.main}>
          <div className={style.content}>{children}</div>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
