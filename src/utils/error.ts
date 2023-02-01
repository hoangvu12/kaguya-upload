import axios from "axios";

type ErrorInput = {
  error: string;
  stack?: string;
  componentStack?: string;
  errorSource: string;
};

export const logError = ({
  error,
  stack,
  componentStack,
  errorSource,
}: ErrorInput) => {
  // if (!error || !errorSource) return;
  // return axios.post("/api/error-logger", {
  //   error,
  //   stack,
  //   componentStack,
  //   errorSource,
  // });
};
