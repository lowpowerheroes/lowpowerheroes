import { configureStore } from "@reduxjs/toolkit";
import createbuild from "~/app/services/createbuild";

export const store = configureStore({
  reducer: {
    createbuild,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
