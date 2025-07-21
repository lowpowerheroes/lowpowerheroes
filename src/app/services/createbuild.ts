import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createbuildInitialState } from "~/app/types/createbuild";

const createbuild = createSlice({
  name: "create-build",
  initialState: createbuildInitialState,
  reducers: {},
});

export default createbuild.reducer;
