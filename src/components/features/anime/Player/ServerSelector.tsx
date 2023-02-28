import Button from "@/components/shared/Button";
import { AnimeServer } from "@/types";
import classNames from "classnames";
import React from "react";

export interface ServerSelectorProps {
  servers: AnimeServer[];
  onServerChange: (server: AnimeServer) => void;
  activeServer: AnimeServer;
}

const ServerSelector: React.FC<ServerSelectorProps> = ({
  servers,
  onServerChange,
  activeServer,
}) => {
  return (
    <div className="bg-background-900 min-w-[15rem] max-h-96 p-3 space-y-3 rounded-md overflow-y-auto">
      <p className="font-semibold text-xl">Servers:</p>

      <div className="flex flex-col gap-2">
        {servers.map((server) => (
          <Button
            key={server.id}
            className={classNames(
              "w-full text-center rounded-md px-3 py-2 line-clamp-1",
              server.id === activeServer.id
                ? "!bg-primary-600"
                : "!bg-background-600"
            )}
            onClick={() => onServerChange(server)}
          >
            {server.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ServerSelector;
