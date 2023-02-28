import Popup from "@/components/shared/Popup";
import { ControlButton, Popover } from "netplayer";
import React from "react";
import { FiServer } from "react-icons/fi";
import ControlsIcon from "./ControlsIcon";
import ServerSelector, { ServerSelectorProps } from "./ServerSelector";

const DesktopServerSelector: React.FC<ServerSelectorProps> = (props) => {
  return (
    <Popup
      portalSelector=".netplayer-container"
      reference={
        <ControlButton tooltip="Servers">
          <ControlsIcon Icon={FiServer} />
        </ControlButton>
      }
      placement="top"
      type="click"
    >
      <ServerSelector {...props} />
    </Popup>
  );
};

export default DesktopServerSelector;
