type InvalidTokenListener = (message?: string) => void;

const listeners = new Set<InvalidTokenListener>();

export const AUTH_INVALID_TOKEN_MESSAGE =
  "인증정보가 유효하지 않습니다. 재로그인해주세요";

export const subscribeInvalidTokenAlert = (
  listener: InvalidTokenListener,
): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const emitInvalidTokenAlert = (message?: string): void => {
  listeners.forEach((listener) => {
    try {
      listener(message);
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error("Failed to notify invalid token listener:", error);
      }
    }
  });
};

