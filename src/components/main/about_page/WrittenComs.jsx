import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { Box, Button } from "@mui/material";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { getCommentsCollection } from "../../../store/slicers/commentSlice";
import { useAuth } from "../../../hooks/useAuth";

function formatDate(timestamp) {
  var date = new Date(timestamp);
  var day = ("0" + date.getDate()).slice(-2);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear().toString().slice(-2);
  var hours = ("0" + date.getHours()).slice(-2);
  var minutes = ("0" + date.getMinutes()).slice(-2);

  return day + "." + month + "." + year + " " + hours + ":" + minutes;
}

export const WrittenComs = () => {
  const dispatch = useDispatch();
  const commentsArr = useSelector((state) => state.comments.commentsCol);
  const curArr = [...commentsArr];
  console.log(curArr);
  const auth = useAuth();

  const onHandleIcons = async (id, icon) => {
    const mainRef = doc(db, "comments", id);
    const currentCommentRef = await getDoc(mainRef);
    const { thumbUp, thumbDown, favorite, handleLikedPeople } =
      currentCommentRef.data();

    const { thumbUpList, thumbDownList, favoriteList } = handleLikedPeople;
    if (icon === "thumbUp") {
      const index = thumbUpList.indexOf(auth.id);
      const indexDown = thumbDownList.indexOf(auth.id);
      const isDisliked = indexDown !== -1;
      const d = index === -1 ? 1 : -1;

      await updateDoc(mainRef, {
        thumbUp: +thumbUp + d,
        thumbDown: isDisliked ? +thumbDown - 1 : +thumbDown,
        handleLikedPeople: {
          thumbUpList:
            index === -1
              ? [...thumbUpList, auth.id]
              : [...thumbUpList.filter((id) => id !== auth.id)],
          thumbDownList: isDisliked
            ? [...thumbDownList.filter((id) => id !== auth.id)]
            : thumbDownList,
          favoriteList,
        },
      });
      dispatch(getCommentsCollection());
    }
    if (icon === "thumbDown") {
      const index = thumbDownList.indexOf(auth.id);
      const indexUp = thumbUpList.indexOf(auth.id);
      const isLiked = indexUp !== -1;
      const d = index === -1 ? 1 : -1;

      await updateDoc(mainRef, {
        thumbDown: +thumbDown + d,
        thumbUp: isLiked ? +thumbUp - 1 : thumbUp,
        handleLikedPeople: {
          thumbDownList:
            index === -1
              ? [...thumbDownList, auth.id]
              : [...thumbDownList.filter((id) => id !== auth.id)],
          thumbUpList: isLiked
            ? thumbDownList.filter((id) => id !== auth.id)
            : thumbUpList,
          favoriteList,
        },
      });
      dispatch(getCommentsCollection());
    }
    if (icon === "favorite") {
      const index = favoriteList.indexOf(auth.id);
      const d = index === -1 ? 1 : -1;

      await updateDoc(mainRef, {
        favorite: +favorite + d,
        handleLikedPeople: {
          favoriteList:
            index === -1
              ? [...favoriteList, auth.id]
              : [...favoriteList.filter((id) => id !== auth.id)],
          thumbUpList,
          thumbDownList,
        },
      });
      dispatch(getCommentsCollection());
    }
  };

  return (
    <div style={{ overflow: "auto", maxHeight: "400px" }}>
      <List sx={{ width: "100%", maxWidth: 800, bgcolor: "lightgray" }}>
        {curArr.map((m) => {
          const time = formatDate(m.commentTime);
          const { thumbUpList, thumbDownList, favoriteList } =
            m.handleLikedPeople;
          const isThumbedUp = thumbUpList.includes(auth.id);
          const isThumbedDown = thumbDownList.includes(auth.id);
          const isFavorite = favoriteList.includes(auth.id);
          return (
            <React.Fragment key={Math.random()}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={m?.photoURL} />
                </ListItemAvatar>
                <ListItemText
                  sx={{ mt: 2 }}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline", mr: "10px" }}
                        component="span"
                        variant="body2"
                        color="text.primary">
                        {m.fullName}
                      </Typography>
                      <Typography variant="body1">{m.comment}</Typography>
                      <Typography variant="subtitle2">{time}</Typography>
                      <Box sx={{ display: "flex", ml: 1 }}>
                        <Button onClick={() => onHandleIcons(m.id, "thumbUp")}>
                          {isThumbedUp ? (
                            <ThumbUpAltIcon />
                          ) : (
                            <ThumbUpOffAltIcon />
                          )}
                          {m.thumbUp}
                        </Button>
                        <Button onClick={() => onHandleIcons(m.id, "favorite")}>
                          {isFavorite ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                          {m.favorite}
                        </Button>
                        <Button
                          onClick={() => onHandleIcons(m.id, "thumbDown")}>
                          {isThumbedDown ? (
                            <ThumbDownAltIcon />
                          ) : (
                            <ThumbDownOffAltIcon />
                          )}
                          {m.thumbDown}
                        </Button>
                      </Box>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
};
