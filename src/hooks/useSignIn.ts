import supabaseClient from "@/lib/supabase";
import { UserCredentials } from "@supabase/supabase-js";
import { useMutation } from "react-query";

interface UseSignInOptions {
  redirectTo?: string;
  scopes?: string;
}

const useSignIn = (supabaseOptions?: UseSignInOptions) => {
  return useMutation((credentials: UserCredentials) => {
    return supabaseClient.auth.signIn(credentials, supabaseOptions);
  });
};

export default useSignIn;
