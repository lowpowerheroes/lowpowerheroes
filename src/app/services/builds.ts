import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Build } from "../types/createbuild";

const builds = createSlice({
  name: "builds",
  initialState: [] as Array<Build>,
  reducers: {
    resetLoadedBuilds: () => {
      return [];
    },
    setLoadedBuilds: (_state, action: PayloadAction<Array<Build>>) => {
      return action.payload;
    },
  },
});

export const { resetLoadedBuilds, setLoadedBuilds } = builds.actions;
export default builds.reducer;
