import {Avatar, IconButton, LinearProgress} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import {CommentType} from "../../types/Comment";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {commentEdit, commentRemove, commentsInit} from "../../features/currentDreamFeature";
import {useState, useRef} from "react";

type Props = {
  comment: CommentType;
}

export const Comment: React.FC<Props> = ({ comment }) => {
  const {commentsDeleting} = useAppSelector(store => store.currentDream)
  const currentUser = localStorage.getItem('currentUser') || ""
  const [editingComment, setEditingComment] = useState<boolean>(false)
  const commentRef = useRef<HTMLDivElement | null>(null)
  const inputForChangeRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useAppDispatch();

  const handleEditOn = () => {
    setTimeout(() => {
      if (inputForChangeRef.current) {
        inputForChangeRef.current.focus();
      }
    }, 0);
    setEditingComment(true);
  }

  const handleEditSubmit = async () => {
    if(inputForChangeRef.current?.value.trim() === '') {
      return
    }
    
    try {
      const accessToken = localStorage.getItem("access");

      if (comment && inputForChangeRef.current && accessToken) {
        await dispatch(commentEdit({
          dreamId: comment.dream,
          commentId: comment.id,
          data: {text: inputForChangeRef.current.value.trim()},
          token: accessToken,
        }))
      }
    } catch (e) {
      console.log(e)
    } finally {
      await dispatch(commentsInit(comment.dream.toString())).unwrap();
      setEditingComment(false)
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access");
      
      if(token) {
        await dispatch(commentRemove({
          dreamId: comment.dream, 
          commentId: comment.id, 
          token: token
        }));
      }
    } catch (e) {
      console.log(e);
    } finally{
      await dispatch(commentsInit(comment.dream.toString())).unwrap();
    }
  }

  return (
    <div ref={commentRef} className={`comment comment--${comment.id}`}>
      <div className="comment-author">
        <div className="comment__personal-info">
          {comment.user.photo_url ? (
            <Avatar
              src={comment.user?.photo_url}
              alt=""
              className="comment__author-image"
            />
          ) : (
            <Avatar />
          )}

          {comment.user?.first_name}
        </div>
        {currentUser && comment.user?.id === +currentUser ? (
          <div className="comment-tools">
            {editingComment ? (
              <IconButton
                aria-label="doneEniting"
                sx={{ padding: 0.5 }}
                onClick={handleEditSubmit}
              >
                <DoneIcon />
              </IconButton>
            ) : (
              <IconButton
                aria-label="edit"
                sx={{ padding: 0.5 }}
                onClick={handleEditOn}
              >
                <EditIcon />
              </IconButton>
            )}

            <IconButton
              aria-label="remove"
              sx={{ padding: 0.5 }}
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : null}
      </div>
      <div className="comment-body">
        {editingComment ? (
          <input
            ref={inputForChangeRef}
            className="comment-editInput"
            defaultValue={comment.text}
            type="text"
          />
        ) : (
          comment.text
        )}
      </div>
      <div className="comment-date">
        {new Date(comment.created_at).toLocaleString("ua", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>
      {commentsDeleting &&
        commentRef.current?.classList.contains(`comment--${comment.id}`) && (
          <LinearProgress sx={{ height: "2px", marginTop: "4px" }} />
        )}
    </div>
  );
}