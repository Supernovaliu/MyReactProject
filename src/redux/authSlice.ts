import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isLoading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('authToken');
    }
  }
});

// Action creators are generated for each case reducer function
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;

export const login = ({ username, password, navigate }:any) => async (dispatch:any) => {
  try {
    dispatch(loginStart());
    const response = await axios.post('http://localhost:5174/api/Demo/CheckPwd', {
      username, password
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    const data = response.data;
    localStorage.setItem('authToken',data);
    if (response.status === 200) {
      dispatch(loginSuccess({ user: username, token: data }));
      navigate("/table");
    } else {
      dispatch(loginFailure(data));
    }
  } catch (error:any) {
    dispatch(loginFailure(error.toString()));
  }
};

