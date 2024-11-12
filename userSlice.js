import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  userDetails: null, // Changed to null as a safer initial state
  tempDetails: null, // Changed to null as a safer initial state
  loading: false,
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  currentRole: (JSON.parse(localStorage.getItem("user")) || {}).role || null,
  error: null,
  response: null,
  darkMode: JSON.parse(localStorage.getItem("darkMode")) || true, // Persist dark mode in localStorage
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.status = "loading";
    },
    underControl: (state) => {
      state.status = "idle";
      state.response = null;
    },
    stuffAdded: (state, action) => {
      state.status = "added";
      state.tempDetails = action.payload;
      state.response = null;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.status = "success";
      state.currentUser = action.payload;
      state.currentRole = action.payload.role;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.response = null;
      state.error = null;
    },
    authFailed: (state, action) => {
      state.status = "failed";
      state.response = action.payload;
    },
    authError: (state, action) => {
      state.status = "error";
      state.error = action.payload;
    },
    authLogout: (state) => {
      localStorage.removeItem("user");
      state.currentUser = null;
      state.status = "idle";
      state.error = null;
      state.currentRole = null;
    },
    doneSuccess: (state, action) => {
      state.userDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getDeleteSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getRequest: (state) => {
      state.loading = true;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode)); // Persist dark mode preference
    },
  },
});

export const {
  authRequest,
  underControl,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  toggleDarkMode,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
