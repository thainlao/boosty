import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { subState } from "../../types/types";
import axios from '../axios';

const initialState: subState = {
    status: null,
    user: null,
    isLoading: false,
    sub: null,
    issubnameAvalible: false
}

export const createSub = createAsyncThunk('/sub/creatingOfSub',
async({ subname, content18plus }: { subname: string, content18plus: boolean }) => {
        try {
            const { data } = await axios.post('sub/createsub', { subname: subname, content18plus });
            return data
        } catch (e) {
            console.log(e)
        }
})

export const getSubData = createAsyncThunk('auth/getsubinformation', async (subname: string | undefined) => {
  try {
      const { data } = await axios.get(`/sub/getsubdata/${subname}`)
      return data
  } catch (e) {
      console.log(e)
  }
})

export const isSubNameAvalibe = createAsyncThunk('sub/IsSubNameAvalibble',
async({subscription_name}: any) => {
  try {
    const { data } = await axios.post('/sub/isnameavalible', 
    {subscription_name});
    return data
  } catch (e) {
    console.log(e)
  }
})

export const uploadsubAvatar = createAsyncThunk('auth/uploadsubAvatar',
  async ({ dataInfo, subNameParams }: any) => {
    try {
      const formData = new FormData();
      formData.append('image', dataInfo);
      const { data } = await axios.post(`/sub/uploadsubavatar/${subNameParams}`, formData);
      return data;
    } catch (e) {
      console.log(e);
    }
  }
);

export const uploadsubBackground = createAsyncThunk('sub/uploadSubbackgrounD',
async ({ dataInfo, subNameParams }: any) => {
  try {
    const formData = new FormData();
    formData.append('image', dataInfo);
    const { data } = await axios.post(`/sub/uploadsubbackground/${subNameParams}`, formData);
    return data;
  } catch (e) {
    console.log(e);
  }
}
);

export const getallsubsdata = createAsyncThunk('sub/getallsubsdata',
async () => {
  try {
    const { data } = await axios.get('/sub/getallsubsdata');
    return data;
  } catch (e) {
    console.log(e);
  }
}
);

export const changeSubDescription = createAsyncThunk('sub/changesubdescription',
async({ sub_about, subNameParams }: any) => {
  try {
    const { data } = await axios.post(`/sub/changesubdescription/${subNameParams}`, {sub_about});
    return data
  } catch (e) {
    console.log(e)
  }
})

export const sibToSub = createAsyncThunk('sub/tosub',
async({ subNameParams }: any) => {
  try {
    const { data } = await axios.post(`/sub/subscribetosub/${subNameParams}`);
    return data
  } catch (e) {
    console.log(e)
  }
})

export const unsibToSub = createAsyncThunk('sub/untosub',
async({ subNameParams }: any) => {
  try {
    const { data } = await axios.post(`/sub/unsubscribetosub/${subNameParams}`);
    return data
  } catch (e) {
    console.log(e)
  }
})

export const createLinkedSub = createAsyncThunk('sub/Linkedsub',
async({ subNameParams, add_sub_name, add_sub_price, add_sub_about }: any) => {
  try {
    const numericPrice = parseFloat(add_sub_price);
    const { data } = await axios.post(`/sub/createlinkedsub/${subNameParams}`, {
      add_sub_price: numericPrice,
      add_sub_name, add_sub_about
    });
    return data
  } catch (e) {
    console.log(e)
  }
})

export const getSignSubData = createAsyncThunk('sub/presubdata',
async({subNameParams}: any) => {
  try {
    const { data } = await axios.get(`/sub/getpresubdata/${subNameParams}`,)
    return data;
  } catch (e) {
    console.log(e)
  }
})

export const subSlice = createSlice({
    name: 'sub',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        //createSub
        builder.addCase(createSub.pending, (state) => {
          state.isLoading = true;
          state.status = null
        });
        builder.addCase(createSub.fulfilled, (state, action) => {
          state.isLoading = false
          state.status = null
          state.user = action.payload.user
        });
        builder.addCase(createSub.rejected, (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.status = action.payload.message
        });

        //getSubData
        builder.addCase(getSubData.pending, (state) => {
          state.isLoading = true;
          state.status = null
        });
        builder.addCase(getSubData.fulfilled, (state, action) => {
          state.isLoading = false
          state.status = null
          state.user = action.payload.user
          state.sub = action.payload.sub
        });
        builder.addCase(getSubData.rejected, (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.status = action.payload.message
        });

        //isSubNameAvalibe
        builder.addCase(isSubNameAvalibe.pending, (state) => {
          state.isLoading = true;
          state.status = null
        });
        builder.addCase(isSubNameAvalibe.fulfilled, (state, action) => {
          state.isLoading = false
          state.status = null
          state.user = action.payload.user
          state.sub = action.payload.sub
          // Обновление subnameAvalible
          state.issubnameAvalible = action.payload.subnameAvalible;
        });
        builder.addCase(isSubNameAvalibe.rejected, (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.status = action.payload.message
        });

        //SubBackground
        builder.addCase(uploadsubAvatar.pending, (state) => {
          state.isLoading = true;
        });
        builder.addCase(uploadsubAvatar.fulfilled, (state) => {
          state.isLoading = false;
        });
        builder.addCase(uploadsubAvatar.rejected, (state) => {
          state.isLoading = false;
        });

        //getallsubdata
        builder.addCase(getallsubsdata.pending, (state) => {
          state.isLoading = true;
        });
        builder.addCase(getallsubsdata.fulfilled, (state, action) => {
          state.isLoading = false;
          state.sub = action.payload
        });
        builder.addCase(getallsubsdata.rejected, (state) => {
          state.isLoading = false;
        });

        //Subavatar
        builder.addCase(uploadsubBackground.pending, (state) => {
          state.isLoading = true;
        });
        builder.addCase(uploadsubBackground.fulfilled, (state) => {
          state.isLoading = false;
        });
        builder.addCase(uploadsubBackground.rejected, (state) => {
          state.isLoading = false;
        });

        //changeName
        builder.addCase(changeSubDescription.pending, (state) => {
          state.isLoading = true;
        });
        builder.addCase(changeSubDescription.fulfilled, (state, action) => {
          state.isLoading = false;
          state.status = action.payload.message
        });
        builder.addCase(changeSubDescription.rejected, (state) => {
          state.isLoading = false;
        });

        //subtoSubscribe
        builder.addCase(sibToSub.pending, (state) => {
          state.isLoading = true;
        });
        builder.addCase(sibToSub.fulfilled, (state, action) => {
          state.isLoading = false;
          state.status = action.payload.message;
        });
        builder.addCase(sibToSub.rejected, (state) => {
          state.isLoading = false;
        });

        //unsubtoSubscribe
        builder.addCase(unsibToSub.pending, (state) => {
          state.isLoading = true;
        });
        builder.addCase(unsibToSub.fulfilled, (state, action) => {
          state.isLoading = false;
          state.status = action.payload.message;
        });
        builder.addCase(unsibToSub.rejected, (state) => {
          state.isLoading = false;
        });
    }
})

export default subSlice.reducer