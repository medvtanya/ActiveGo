import { useEffect } from "react";
import { useAppDispatch } from "../shared/hooks/reduxHooks";
import "./styles/index.css";

import Router from "./Router/Router";
import { refreshTokenThunk } from "@/entities/user/api/userApi";
import DesktopNotSupported from "@/components/DesktopNotSupported";

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshTokenThunk());
  }, [dispatch]);

  return (
    <>
      <DesktopNotSupported />
      <Router />
    </>
  );
}
