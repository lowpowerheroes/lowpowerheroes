import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createbuildInitialState,
  type CreateBuildArgs,
} from "~/app/types/createbuild";

const createbuild = createSlice({
  name: "create-build",
  initialState: createbuildInitialState,
  reducers: {
    updateBuild: (state, action: PayloadAction<Partial<CreateBuildArgs>>) => {
      return { ...state, ...action.payload };
    },

    resetBuild: () => createbuildInitialState,
  },
});

export const { updateBuild, resetBuild } = createbuild.actions;

export default createbuild.reducer;
