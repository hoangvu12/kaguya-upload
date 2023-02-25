import config from "@/config";
import { useUser } from "@/contexts/AuthContext";
import useCreateSubscription from "@/hooks/useCreateSubscription";
import useIsSavedSub from "@/hooks/useIsSavedSub";
import { base64ToUint8Array } from "@/utils";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

const isDev = process.env.NODE_ENV === "development";

const subscriptionAtom = atom<PushSubscription>(null as PushSubscription);

export const SubscriptionContextProvider: React.FC = ({ children }) => {
  const [sub, setSub] = useAtom(subscriptionAtom);

  const user = useUser();
  const { data: isSavedSub, isLoading } = useIsSavedSub();
  const createSubscription = useCreateSubscription();
  const isSubscriptionSent = useRef(false);

  useEffect(() => {
    if (!user || isDev || isLoading) return;

    if (isSubscriptionSent.current) return;

    if (isSavedSub) {
      isSubscriptionSent.current = true;

      return;
    }

    navigator.serviceWorker.getRegistration().then(async (registration) => {
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription || !isSavedSub) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToUint8Array(config.webPushPublicKey),
        });
      }

      setSub(subscription);
    });
  }, [isLoading, isSavedSub, setSub, user]);

  useEffect(() => {
    if (!user || !sub || isDev) return;

    if (isSubscriptionSent.current) return;

    isSubscriptionSent.current = true;

    createSubscription.mutate(sub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub, user]);

  return null;
};

export const useSubscription = () => {
  return useAtomValue(subscriptionAtom);
};
