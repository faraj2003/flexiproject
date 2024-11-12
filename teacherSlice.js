import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teachersList: [], // Stores list of teachers
  teacherDetails: [], // Stores details of a specific teacher
  loading: false, // Indicates if data is being loaded
  error: null, // Holds error information
  response: null, // May hold response message or status
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    doneSuccess: (state, action) => {
      state.teacherDetails = action.payload; // Store teacher details
      state.loading = false;
      state.error = null;
      state.response = null; // Optional: clear the response message
    },
    getSuccess: (state, action) => {
      state.teachersList = action.payload; // Store the list of teachers
      state.loading = false;
      state.error = null;
      state.response = null; // Optional: clear the response message
    },
    getFailed: (state, action) => {
      state.response = action.payload; // Store failure response message
      state.loading = false;
      state.error = null; // Optional: set error to null or store error message here
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Store the actual error message
    },
    postDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null; // Reset state after posting data
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  doneSuccess,
  postDone,
} = teacherSlice.actions;

export const teacherReducer = teacherSlice.reducer;
