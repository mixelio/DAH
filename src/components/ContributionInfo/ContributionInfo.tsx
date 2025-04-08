import {Dream} from "../../types/Dream";
import {useEffect, useRef, useState} from "react";
import styles from "../ContributionMessage/ContributionMessage.module.scss";

import CopyAllIcon from "@mui/icons-material/CopyAll";

type Props = {
  dream: Dream;
  isOpen: boolean;
  setOpenState: (state: boolean) => void;
}

export const ContributionInfo: React.FC<Props> = ({
  dream,
  isOpen,
  setOpenState,
}) => {
  const dialogForContributionInfoRef = useRef<HTMLDialogElement>(null);
  const [copyStatus, setCopyStatus] = useState("");

  const openDialog = () => {
    dialogForContributionInfoRef.current?.showModal();
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  };

  const closeDialog = () => {
    dialogForContributionInfoRef.current?.close();
    setOpenState(false);
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = `0px`;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const messageDialog = dialogForContributionInfoRef.current;

    if (messageDialog && e.target === messageDialog) {
      closeDialog();
    }
  };

  useEffect(() => {
    if (isOpen && dialogForContributionInfoRef.current) {
      openDialog();
    } else {
      closeDialog();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <dialog
      ref={dialogForContributionInfoRef}
      onClick={handleBackdropClick}
      className={styles.contributionMessage}
    >
      <div className={styles.contributionMessage__messageContent}>
        <h3 style={{marginBlockEnd: "16px"}}>{`${dream.contributions?.user.first_name} ${dream.contributions?.user.last_name}`}</h3>
        <p style={{marginBlockEnd: "16px"}}>{dream.contributions?.description}</p>
        <span
          style={{
            cursor: "pointer",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                dream.contributions?.user.email ?? ""
              );
              setCopyStatus("Copied to clipboard");
            } catch (error) {
              console.error("Failed to copy email: ", error);
              setCopyStatus("Failed to copy");
            } finally {
              setTimeout(() => {
                setCopyStatus("");
              }, 2000);
            }
          }}
        >
          {dream.contributions?.user.email}
          {!copyStatus && (
            <CopyAllIcon
              sx={{ width: "16px", height: "100%", objectFit: "contain", color: "#ccc" }}
            />
          )}
          {copyStatus && <span style={{ color: "#ccc", fontSize: "10px" }}> {copyStatus}</span>}
        </span>
      </div>
    </dialog>
  );
};