import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeNav: "Dashboard",
  metrics: [
    { label: "Total Users",      value: "2,841", change: "+12%",   up: true  },
    { label: "Pending Requests", value: "34",    change: "+3",     up: false },
    { label: "Active Sessions",  value: "128",   change: "+8%",    up: true  },
    { label: "System Health",    value: "99.9%", change: "Stable", up: true  },
  ],
};

const homeSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setActiveNav(state, action) {
      state.activeNav = action.payload;
    },
  },
});

export const { setActiveNav } = homeSlice.actions;
export default homeSlice.reducer;
