import { configureStore } from "@reduxjs/toolkit";
import createbuild from "~/app/services/createbuild";
import builds from "~/app/services/builds";

export const store = configureStore({
  reducer: {
    createbuild,
    builds,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
