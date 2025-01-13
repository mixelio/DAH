import {IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {CommentType} from "../../types/Comment";
import {useAppDispatch} from "../../app/hooks";
import {commentRemove, commentsInit} from "../../features/currentDreamFeature";

type Props = {
  comment: CommentType;
}

export const Comment: React.FC<Props> = ({ comment }) => {
  const currentUser = localStorage.getItem('currentUser') || "";

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    console.log('delete')
    try {
      const token = localStorage.getItem("access");
      
      if(token) {
        await dispatch(commentRemove({
        dreamId: comment.dream, 
        commentId: comment.id, 
        token: token
      
      }
      ));
      }
    } catch (e) {
      console.log(e);
    } finally{
      await dispatch(commentsInit(comment.dream.toString()));
    }
  }

  return (
    <div className="comment">
      <div className="comment-author">
        <div className="comment__personal-info">
          <img
            src={comment.user?.photo_url}
            alt=""
            className="comment__author-image"
          />
          {comment.user?.first_name}
        </div>
        {currentUser && comment.user?.id === +currentUser ? (
          <div className="comment-tools">
            <IconButton aria-label="edit" sx={{ padding: 0.5 }}>
              <EditIcon />
            </IconButton>
            <IconButton 
              aria-label="remove" 
              sx={{ padding: 0.5 }}
              onClick={handleDelete}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </div>
        ) : null}
      </div>
      <div className="comment-body">{comment.text}</div>
      <div className="comment-date">
        {new Date(comment.created_at).toLocaleString('ua', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </div>
    </div>
  );
}