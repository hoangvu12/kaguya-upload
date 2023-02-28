import { ControlButton, Dialog } from "netplayer";
import React from "react";
import { FiServer } from "react-icons/fi";
import ServerSelector, { ServerSelectorProps } from "./ServerSelector";

const MobileServerSelector: React.FC<ServerSelectorProps> = (props) => {
  return (
    <Dialog
      portalSelector=".netplayer-container"
      reference={
        <ControlButton tooltip="Timestamps">
          <FiServer />
        </ControlButton>
      }
    >
      <ServerSelector {...props} />
    </Dialog>
  );
};

export default MobileServerSelector;
