import {Divider, IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {useContext} from "react";
import {DreamsContext} from "../../DreamsContext";
import {CommentType} from "../../types/Comment";

type Props = {
  comment: CommentType;
}

export const Comment: React.FC<Props> = ({ comment }) => {
  const { users, currentUser } = useContext(DreamsContext)

    const getUser = (userId: number) => {
      return users.find((user) => user.id === userId);
    }; 

  return (
    <div className="comment">
      <div className="comment-author">
        {getUser(comment.userId)?.first_name}
        {getUser(comment.userId)?.email === currentUser?.email ? (
          <div className="comment-tools">
            <IconButton aria-label="edit" sx={{ padding: 0.5 }}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="remove" sx={{ padding: 0.5 }}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </div>
        ) : null}
      </div>
      <Divider sx={{ mb: 1, mt: 1 }} />
      <div className="comment-body">{comment.text}</div>
    </div>
  );
}