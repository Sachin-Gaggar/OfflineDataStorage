import AllStrings from "@/constants/AllStrings";
import Urls from "@/constants/URLs";
import { RootState } from "@/store";
import { createUsers } from "@/store/userDB";
import { User } from "@/types/User";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user: User[] | null;
  loading: "success" | "error" | "loading";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: "loading",
  error: null,
};

export const fetchUserData = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("getUsers/all", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(Urls.getAllUser, { method: "GET" });

    if (!response.ok) {
      const errorMessage = `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    const json: User[] = await response.json();
    return json;
  } catch (e: any) {
    return rejectWithValue(e.message || "Something went wrong");
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserState: (state, action: PayloadAction<User[]>) => {
      state.user = action.payload;
      state.loading = "success";
    },
    updateError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = "error";
    },
    updateLoader: (state) => {
      state.loading = "loading";
    },
    updateNewUser: (state, action: PayloadAction<User>) => {
      state.loading = "loading";
      state.user = [action.payload, ...(state.user || [])];
      state.loading = "success";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = "success";
        state.error = null;
        createUsers(action.payload);
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch users";
        state.loading = "error";
      });
  },
});

export const { updateError, updateUserState, updateLoader, updateNewUser } =
  userSlice.actions;
export const selectUserFetchError = (state: RootState) =>
  state.userReducer.error;
export const selectUserData = (state: RootState) => state.userReducer.user;
export const selectUserLoader = (state: RootState) => state.userReducer.loading;

export default userSlice.reducer;
