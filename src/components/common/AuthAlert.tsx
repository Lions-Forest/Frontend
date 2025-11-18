import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  AUTH_INVALID_TOKEN_MESSAGE,
  subscribeInvalidTokenAlert,
} from "@/utils/authAlert";

type AlertState = {
  id: number;
  message: string;
};

function AuthAlert() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeInvalidTokenAlert((message) => {
      setAlert({
        id: Date.now(),
        message: message ?? AUTH_INVALID_TOKEN_MESSAGE,
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!alert) return;

    const timerId = window.setTimeout(() => {
      setAlert(null);
      navigate("/", { replace: true });
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [alert, navigate]);

  if (!alert) return null;

  return <ErrorBanner role="alert">{alert.message}</ErrorBanner>;
}

export default AuthAlert;

const ErrorBanner = styled.div`
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 280px;
  max-width: 480px;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(255, 77, 79, 0.9);
  color: #fff;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  line-height: 1.5;
  word-break: keep-all;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
  z-index: 9999;
  white-space: pre-line;
`;

