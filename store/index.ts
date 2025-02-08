import userReducer from "@/service/user";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
