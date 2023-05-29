import {
  Box,
  Avatar,
  Typography,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { Edit, AutoStories, Inventory } from "@mui/icons-material";
import { Forum, DirectionsCar } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { useState } from "react";
import { WrittenComs } from "../main/about_page/WrittenComs";
import { useDispatch } from "react-redux";
import { getCommentsCollection } from "../../store/slicers/commentSlice";
import { userStyles } from "./styles";
import { MyBookings } from "./MyBookings";
import MyCars from "./MyCars";

const User = () => {
  const [comp, setComp] = useState("bookings");
  const { userInfo } = useAuth();
  const registered = auth.currentUser.metadata.creationTime;
  const disp = useDispatch();
  const [activeOpt, setActiveOpt] = useState("all-services");

  const currentComponent = (cmpName) => {
    switch (cmpName) {
      case "comments":
        disp(getCommentsCollection());
        return <WrittenComs dontShowAll />;
      case "bookings":
        return <MyBookings />;
      case "driverCars":
        return <MyCars />;
      default:
        break;
    }
  };

  const userMenuTheme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            "&.active-opt": {
              background: "#F2B90D",
              color: "#192026",
              "&:hover": {
                background: "#E8AE00",
              },
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={userMenuTheme}>
      <Box sx={{ minHeight: "600px" }}>
        <Box sx={userStyles.mainBox}>
          <Box sx={userStyles.personal}>
            <Avatar
              src={userInfo?.photoURL}
              sizes=""
              sx={{ width: 200, height: 200 }}
            />
            <Typography variant="h4" color="wheat">
              {userInfo.fullName}
              {userInfo.type === "driver" && "(driver)"}
            </Typography>
          </Box>
        </Box>
        <Box sx={userStyles.content}>
          <Box sx={userStyles.contentLeft}>
            <Link to="/settings">
              <Button
                sx={{
                  bgcolor: "#192026",
                  textTransform: "capitalize",
                  height: "60px",
                  fontSize: "20px",
                  "&:hover": { bgcolor: "rgb(37, 47, 57)" },
                }}
                fullWidth
                variant="contained">
                <Edit />
                Edit profile
              </Button>
            </Link>
            <Button
              sx={{
                bgcolor: "#192026",
                textTransform: "capitalize",
                height: "60px",
                fontSize: "20px",
                "&:hover": { bgcolor: "rgb(37, 47, 57)" },
              }}
              onClick={() => {
                setComp("bookings");
                setActiveOpt("all-services");
              }}
              className={activeOpt === "all-services" ? "active-opt" : ""}
              fullWidth
              variant="contained">
              <AutoStories />
              &nbsp;all services order
            </Button>
            <Button
              sx={{
                bgcolor: "#192026",
                textTransform: "capitalize",
                height: "60px",
                fontSize: "20px",
                "&:hover": { bgcolor: "rgb(37, 47, 57)" },
              }}
              fullWidth
              variant="contained"
              className={activeOpt === "all-comments" ? "active-opt" : ""}
              onClick={() => {
                setComp("comments");
                setActiveOpt("all-comments");
              }}>
              <Forum />
              My comments
            </Button>
            {userInfo.type === "driver" && (
              <Button
                sx={{
                  bgcolor: "#192026",
                  textTransform: "capitalize",
                  height: "60px",
                  fontSize: "20px",
                  "&:hover": { bgcolor: "rgb(37, 47, 57)" },
                }}
                fullWidth
                variant="contained"
                className={activeOpt === "all-my-cars" ? "active-opt" : ""}
                onClick={() => {
                  setComp("driverCars");
                  setActiveOpt("all-my-cars");
                }}>
                <DirectionsCar />
                my cars
              </Button>
            )}
            <Typography>I have been registered </Typography>
            <Typography>{registered} </Typography>
          </Box>
          <Box sx={userStyles.contentRight}>{currentComponent(comp)}</Box>
        </Box>
      </Box>
      <Box sx={userStyles.content}>
        <Box sx={userStyles.contentLeft}>
          <Link to="/settings">
            <Button
              sx={{ height: "60px", fontSize: "20px" }}
              color="secondary"
              fullWidth
              variant="contained">
              <Edit />
              Edit profile
            </Button>
          </Link>
          <Button
            onClick={() => setComp("bookings")}
            sx={{ height: "60px", fontSize: "20px" }}
            color="secondary"
            fullWidth
            variant="contained">
            <AutoStories />
            &nbsp;all services order
          </Button>
          <Button
            sx={{ height: "60px", fontSize: "20px" }}
            color="secondary"
            fullWidth
            variant="contained">
            <Inventory />
            all bought cars
          </Button>
          <Button
            sx={{ height: "60px", fontSize: "20px" }}
            color="secondary"
            fullWidth
            variant="contained"
            onClick={() => setComp("comments")}>
            <Forum />
            my comments
          </Button>
          {userInfo.type === "driver" && (
            <Button
              sx={{ height: "60px", fontSize: "20px" }}
              color="secondary"
              fullWidth
              variant="contained"
              onClick={() => setComp("driverCars")}>
              <DirectionsCar />
              my cars
            </Button>
          )}
          <Typography>I have been registered </Typography>
          <Typography>{registered} </Typography>
        </Box>
        <Box sx={userStyles.contentRight}>{currentComponent(comp)}</Box>
      </Box>
    </ThemeProvider>
  );
};

export default User;
