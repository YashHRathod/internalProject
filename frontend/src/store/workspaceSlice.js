import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadInitialState = () => {
  try {
    const savedWorkspace = localStorage.getItem("selectedWorkspace");
    const savedAllWorkspaces = localStorage.getItem("allWorkspaces");

    if (savedWorkspace) {
      const parsed = JSON.parse(savedWorkspace);
      return {
        allWorkspaces: savedAllWorkspaces ? JSON.parse(savedAllWorkspaces) : [],
        currId: parsed.id || null,
        currName: parsed.name || "",
      };
    }
  } catch (error) {
    console.error("Error loading workspace from localStorage:", error);
  }
  return {
    allWorkspaces: [],
    currId: null,
    currName: "",
  };
};

const initialState = loadInitialState();

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setAllWorkspaces(state, action) {
      state.allWorkspaces = action.payload;
    
      
    },

    setCurrentWorkspace(state, action) {
      state.currId = action.payload.id;
      state.currName = action.payload.name;
     
    
    },

    clearWorkspace(state) {
      state.currId = null;
      state.currName = "";
      state.allWorkspaces = [];
    },
  },
});

export const { setAllWorkspaces, setCurrentWorkspace, clearWorkspace } =
  workspaceSlice.actions;

export default workspaceSlice.reducer;
