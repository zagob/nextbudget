export const successServer = (message: string, data?: unknown) => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorServer = (error: unknown, message: string) => {
  return {
    error,
    success: false,
    message: (error as Error).message || message,
  };
};
