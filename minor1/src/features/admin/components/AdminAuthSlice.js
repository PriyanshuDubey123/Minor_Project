import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, signOut } from '../../auth/authAPI';


const initialState = {
  adminLoginInfo: null,
  status: 'initial',
  error : null,
};



export const loginAdminAsync = createAsyncThunk(
  'admin/loginAdmin',
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
  'admin/signOut',
  async () => {
    const response = await signOut("admin");
    return response.data;
  }
);



export const adminAuthSlice = createSlice({
  name: 'admin',
  initialState,

  reducers: {
    setAdminLoginInfo: (state, action) => {
      state.adminLoginInfo = action.payload;
      state.status = "idle";
    },
    setLoggedInAdminStatus:(state,action)=>{
      state.status = action;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginAdminAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginAdminAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.adminLoginInfo = action.payload;
      })
      .addCase(loginAdminAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.adminLoginInfo = null;
      })
  
  
  },
});

export const selectAdminLoginInfo = (state)=>state.adminAuth.adminLoginInfo;

export const selectError = (state)=>state.adminAuth.error;

export const selectLoading = (state)=>state.adminAuth.status;

export const { setAdminLoginInfo,setLoggedInAdminStatus } = adminAuthSlice.actions;



export default adminAuthSlice.reducer;
