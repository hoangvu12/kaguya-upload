import React from "react";
import Sidebar from "./Sidebar";
import ViewPanel from "./ViewPanel";

interface ReadPanelProps {
  children: React.ReactNode;
}

const ReadPanel: React.FC<ReadPanelProps> = ({ children }) => {
  return (
    <div className="flex w-full h-screen overflow-y-hidden">
      <Sidebar />
      <ViewPanel>{children}</ViewPanel>
    </div>
  );
};

export default ReadPanel;
