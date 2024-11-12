import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess,
} from "./teacherSlice";

const REACT_APP_BASE_URL = "https://farajcoder.onrender.com";

// Helper function to extract error details
const extractErrorDetails = (error) => {
  const errorMessage = error.response?.data?.message || error.message;
  const errorCode = error.code || "UNKNOWN_ERROR";
  return { message: errorMessage, code: errorCode };
};

// Action to get all teachers
export const getAllTeachers = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${REACT_APP_BASE_URL}/Teachers/${id}`);
    // Assuming the API returns an object with a `data` key that holds the list of teachers
    if (result.data && result.data.length) {
      dispatch(getSuccess(result.data)); // Dispatch with teachers data
    } else {
      dispatch(getFailed("No teachers found"));
    }
  } catch (error) {
    const errorDetails = extractErrorDetails(error);
    dispatch(getError(errorDetails)); // Dispatch serializable error details
  }
};

// Action to get teacher details
export const getTeacherDetails = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${REACT_APP_BASE_URL}/Teacher/${id}`);
    if (result.data) {
      dispatch(doneSuccess(result.data)); // Dispatch with teacher details
    } else {
      dispatch(getFailed("Teacher not found"));
    }
  } catch (error) {
    const errorDetails = extractErrorDetails(error);
    dispatch(getError(errorDetails)); // Dispatch serializable error details
  }
};

// Action to update teacher subject
export const updateTeachSubject =
  (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());

    try {
      const data = { teacherId, teachSubject }; // Ensure the correct structure is being passed
      const response = await axios.put(
        `${REACT_APP_BASE_URL}/TeacherSubject`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        dispatch(postDone());
      } else {
        dispatch(getFailed("Failed to update teacher subject"));
      }
    } catch (error) {
      const errorDetails = extractErrorDetails(error);
      dispatch(getError(errorDetails)); // Dispatch serializable error details
    }
  };
