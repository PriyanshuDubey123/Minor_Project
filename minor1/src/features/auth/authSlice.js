import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, createUser, signOut, checkAuth} from './authAPI';

import { updateUser } from '../user/userAPI';

const initialState = {
  loggedInUserToken: null,
  status: 'initial',
  error : null,

};

export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (userData,{rejectWithValue}) => {
    
    try {
      const response = await createUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error)
    }
  }
);

export const loginUserAsync = createAsyncThunk(
  'user/loginUser',
  async (loginInfo, {rejectWithValue}) => {
    try{
    const response = await loginUser(loginInfo);
    return response.data;
    }
    catch(err){
    console.log(err);
    return rejectWithValue(err);
    }
  }
);



export const signOutAsync = createAsyncThunk(
  'user/signOut',
  async (role) => {
    const response = await signOut(role);
    return response.data;
  }
);

export const updateUserAsync = createAsyncThunk(
  'user/updateUser',
  async (update) => {
    const response = await updateUser(update);
    return response.data;
  }
);

export const authSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setLoggedInUserToken: (state, action) => {
      state.loggedInUserToken = action.payload;
      state.status = "idle";
    },
    setLoggedInUserStatus:(state,action)=>{
      state.status = action;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = null;
      })
  
  
  },
});

export const selectLoggedInUser = (state)=>state.auth.loggedInUserToken;

export const selectError = (state)=>state.auth.error;

export const { setLoggedInUserToken,setLoggedInUserStatus } = authSlice.actions;



export default authSlice.reducer;
