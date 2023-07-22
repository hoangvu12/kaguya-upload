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
        resolve(response);
      }
    );
  });
};
