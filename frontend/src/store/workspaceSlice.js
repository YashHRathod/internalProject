import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workspaceId: null,
  workspaceName: "",
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspace(state, action) {
      state.workspaceId = action.payload.id;
      state.workspaceName = action.payload.name;
    },
    clearWorkspace(state) {
      state.workspaceId = null;
      state.workspaceName = "";
    },
  },
});

export const { setWorkspace, clearWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
