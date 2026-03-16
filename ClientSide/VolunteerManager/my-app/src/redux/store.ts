// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./slices/categoriesSlice";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/homeSlice";
import helpRequestsReducer from "./slices/helpRequestsSlice";
import volunteersReducer from "./slices/volunteerSlice";
import needyReducer from "./slices/needySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    categories: categoriesReducer, // ← חייב להיות כאן
        helpRequests: helpRequestsReducer,
    volunteers: volunteersReducer,
    needy: needyReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
