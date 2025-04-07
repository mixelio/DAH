import {Button, CircularProgress} from "@mui/material";
import {Dream} from "../../types/Dream";
import {useEffect, useRef, useState} from "react";
import {useAppDispatch} from "../../app/hooks";
import {acceptUnpaidDream, cancelUnpaidDream} from "../../features/currentDreamFeature";
import styles from "./ContributionMessage.module.scss";

type Props = {
  dream: Dream;
  isOpen: boolean;
  setOpenState: (state: boolean) => void;
}

export const ContributionMessage: React.FC<Props> = ({
  dream,
  isOpen,
  setOpenState,
}) => {
  const dialogForMessageRef = useRef<HTMLDialogElement>(null);
  const [waiting, setWaiting] = useState(false);

  const dispatch = useAppDispatch();

  const openDialog = () => {
    dialogForMessageRef.current?.showModal();
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  };

  const closeDialog = () => {
    dialogForMessageRef.current?.close();
    setOpenState(false);
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = `0px`;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const messageDialog = dialogForMessageRef.current;

    if (messageDialog && e.target === messageDialog) {
      closeDialog();
    }
  };

  const handleDreamAccept = async () => {
    setWaiting(true);
    if (dream.id) {
      try {
        await dispatch(
          acceptUnpaidDream({
            dreamId: +dream.id,
            token: localStorage.getItem("access") ?? "",
          })
        );
      } catch (e) {
        console.error(e);
        return;
      }
    }

    setWaiting(false);
    closeDialog();
    window.location.reload();
  };

  const handleDreamReject = async () => {
    setWaiting(true);
    if (dream.id) {
      try {
        await dispatch(
          cancelUnpaidDream({
            dreamId: +dream.id,
            token: localStorage.getItem("access") ?? "",
          })
        );
      } catch (e) {
        console.error(e);
        return;
      }
    }

    setWaiting(false);
    closeDialog();
  };

  useEffect(() => {
    if (isOpen && dialogForMessageRef.current) {
      openDialog();
    } else {
      closeDialog();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <dialog
      ref={dialogForMessageRef}
      onClick={handleBackdropClick}
      className={styles.contributionMessage}
    >
      <div className={styles.contributionMessage__messageContent}>
        <h3>{`${dream.contributions?.user.first_name} ${dream.contributions?.user.last_name}`}</h3>
        {dream.contributions?.description && (
          <p>{dream.contributions.description}</p>
        )}
        <div className={styles.contributionMessage__buttonContainer}>
          {waiting && <CircularProgress />}
          <Button type="button" variant="outlined" onClick={handleDreamReject}>
            Reject
          </Button>
          <Button type="button" variant="contained" onClick={handleDreamAccept}>
            Accept
          </Button>
        </div>
      </div>
    </dialog>
  );
};