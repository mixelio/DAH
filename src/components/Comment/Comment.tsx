import {Divider, IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {CommentType} from "../../types/Comment";

type Props = {
  comment: CommentType;
}

export const Comment: React.FC<Props> = ({ comment }) => {
  const currentUser = localStorage.getItem('currentUser') || "";

  return (
    <div className="comment">
      <div className="comment-author">
        {comment.user?.first_name}
        {currentUser && comment.user?.id === +currentUser ? (
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