import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../../types/types";
import axios from '../axios';

const initialState: AuthState = {
    token: null,
    status: null,
    isLoading: false,
    user: null,
    avatar: null
}

export const getMe = createAsyncThunk('auth/getUser', async () => {
    try {
        const { data } = await axios.get('/auth/me')
        return data
    } catch (e) {
        console.log(e)
    }
})

export const signupUser = createAsyncThunk
('auth/SignUp', async ({email, password, username}:any) => {
    try {
        const { data } = await axios.post('/auth/signup', {
            email, password, username
        })
        if (data.token) {
            window.localStorage.setItem('token', data.token)
        }
        return data
    } catch (e) {
        console.log(e)
    }
})

export const loginUser = createAsyncThunk('auth/loginUser', 
    async({password, email}: any) => {
        try {
            const { data } = await axios.post('/auth/login', {
              password, email
            })
            
            if (data.token) {
                window.localStorage.setItem('token', data.token)
            }

            return data
        } catch (e) {
            console.log(e)
        }
})

export const uploadAvatar = createAsyncThunk('auth/uploadAvatar',
async (params: any) => {
  try {
    const { data } = await axios.post('/auth/uploadavatar', params);
    return data;
  } catch(e) {
    console.log(e)
  }
})

export const updateUsername = createAsyncThunk('auth/updateUser',
async ({username}: any) => {
  try {
    const { data } = await axios.post('auth/changeusername', {username});
    return data;
  } catch (e) {
    console.log(e)
  }
})

export const updateEmail = createAsyncThunk('auth/updateEmail',
async ({email}: any) => {
  try {
    const { data } = await axios.post('auth/changeemail', {email});
    return data;
  } catch (e) {
    console.log(e)
  }
})

export const DeleteUser = createAsyncThunk('auth/deleteuserPage',
async () => {
  try {
    const { data } = await axios.post('auth/deleteuser');
    return data;
  } catch (e) {
    console.log(e)
  }
})

export const activateAccount = createAsyncThunk('auth/activateAccount',
async (activationLink: string) => {
  try {
    const { data } = await axios.get(`auth/activate/${activationLink}`)
    return data;
  } catch (e) {
    console.log(e)
  }
})

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async ({email}: any) => {
    try {
      const { data } = await axios.post('auth/requestreset', {email})
      return data;
    } catch (error) {
      console.log(error)
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, newPassword }: { resetToken: any, newPassword: string }) => {
    try {
      const { data } = await axios.post("auth/resetpassword", { resetToken, newPassword });
      return data
    } catch (error) {
      throw error;
    }
  }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.status = null
            state.token = null
            state.user = null
        }
    },
    extraReducers: (builder) => {
        //getMe
        builder.addCase(getMe.pending, (state) => {
          state.isLoading = true;
          state.status = null
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
          state.isLoading = false
          state.status = null
          state.user = action.payload.user
          state.token = action.payload.token
        });
        builder.addCase(getMe.rejected, (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.status = action.payload.message
        });
        
      //Register
      builder.addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.status = null
      });
      builder.addCase(signupUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.status = action.payload.message
        state.user = action.payload.user
        state.token = action.payload.token
      });
      builder.addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = action.error.message || 'Произошла ошибка.';
      });

      //login
      builder.addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.status = null
      });
      builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.status = action.payload.message
        state.user = action.payload.user
        state.token = action.payload.token
      });
      builder.addCase(loginUser.rejected, (state, action: any) => {
        state.isLoading = false;
        state.status = action.payload.message;
      });

      //avatar
        builder.addCase(uploadAvatar.pending, (state) => {
          state.isLoading = true;
        });
        builder.addCase(uploadAvatar.fulfilled, (state, action) => {
          state.isLoading = false;
          state.avatar = action.payload
        });
        builder.addCase(uploadAvatar.rejected, (state) => {
          state.isLoading = false;
        });

        //username
        builder.addCase(updateUsername.pending, (state) => {
          state.isLoading = true;
        });
        builder.addCase(updateUsername.fulfilled, (state, action) => {
          state.isLoading = false;
          state.status = action.payload.message
        });
        builder.addCase(updateUsername.rejected, (state) => {
          state.isLoading = false;
        });

        //email
        builder.addCase(updateEmail.pending, (state) => {
          state.isLoading = true;
        });
        builder.addCase(updateEmail.fulfilled, (state, action) => {
          state.isLoading = false;
          state.status = action.payload.message
        });
        builder.addCase(updateEmail.rejected, (state) => {
          state.isLoading = false;
        });

        //delete
        builder.addCase(DeleteUser.pending, (state) => {
          state.isLoading = true;
        });
        builder.addCase(DeleteUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.status = action.payload.message
        });
        builder.addCase(DeleteUser.rejected, (state) => {
          state.isLoading = false;
        });

        //requestpaaword
          builder.addCase(requestPasswordReset.pending, (state) => {
            state.isLoading = true;
            state.status = null
          });
          builder.addCase(requestPasswordReset.fulfilled, (state, action) => {
            state.isLoading = false;
            state.status = action.payload.message
          });
          builder.addCase(requestPasswordReset.rejected, (state, action: any) => {
            state.isLoading = false;
            state.status = action.payload.message || 'Произошла ошибка'
          });
          
          //resetPassword
          builder.addCase(resetPassword.pending, (state) => {
            state.isLoading = true;
            state.status = null
          });
          builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.status = action.payload.message
          });
          builder.addCase(resetPassword.rejected, (state, action: any) => {
            state.isLoading = false;
            state.status = action.payload.message || 'Произошла ошибка'
          });
    }
})

export const checkIsAuth = (state: AuthState) => {
  const localStorageToken = window.localStorage.getItem('token');
  return Boolean(state.token || localStorageToken);
};
export const {logout} = authSlice.actions
export default authSlice.reducer