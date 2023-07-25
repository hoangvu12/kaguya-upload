enum EventType {
  Request = "REQUEST",
  Response = "RESPONSE",
}

export const sendMessage = async <T, K>(
  endpoint: string,
  data?: T
): Promise<K> => {
  return new Promise((resolve, reject) => {
    const extId = window.__kaguya__?.extId;

    if (!extId)
      reject(
        new Error(
          "No extension ID is found, please check your extension again."
        )
      );

    chrome.runtime.sendMessage(
      extId,
      {
        endpoint,
        data,
        type: EventType.Request,
      },
      (response) => {
        if (!response?.type) {
          return reject("Unknown error, please try again.");
        }

        if (response.type === "error") {
          console.log(response.error);

          return reject(new Error(response.error));
        }

        resolve(response.data);
      }
    );
  });
};
