enum EventType {
  Request = "REQUEST",
  Response = "RESPONSE",
}

type CustomEventDetail<T> = {
  endpoint: string;
  data: T;
  type: EventType.Response;
};

export const sendMessage = async <T, K>(
  endpoint: string,
  data?: T
): Promise<K> => {
  return new Promise((resolve, reject) => {
    console.log("send message to", endpoint, data);

    const handleBridgeResponse = (e: CustomEvent<CustomEventDetail<K>>) => {
      if (e?.detail?.endpoint !== endpoint) return;

      if (e?.detail?.type !== EventType.Response) {
        return reject(new Error("Invalid response from event"));
      }

      removeEventListener("bridge-response", handleBridgeResponse);

      resolve(e.detail.data);
    };

    addEventListener("bridge-response", handleBridgeResponse);

    dispatchEvent(
      new CustomEvent("bridge-request", {
        detail: {
          endpoint,
          data,
          type: EventType.Request,
        },
      })
    );
  });
};
