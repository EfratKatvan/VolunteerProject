import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export type HelpRequestStatus = "Pending" | "Matched" | "InProgress" | "Completed" | "Cancelled";

export type HelpRequestType = {
  id: number;
  needyID: number;
  categoryID: number;
  description: string;
  status: HelpRequestStatus;
  createdAt: string;
  latitude: number;
  longitude: number;
};

// GET
export const fetchHelpRequests = createAsyncThunk(
  "helpRequests/fetchHelpRequests",
  async () => {
    const res = await api.get<HelpRequestType[]>("/api/HelpRequests");
    return res.data;
  }
);

// ADD
export const addRequestAsync = createAsyncThunk(
  "helpRequests/addRequest",
  async (request: Omit<HelpRequestType, "id">) => {
    const res = await api.post<HelpRequestType>("/api/HelpRequests", request);
    return res.data;
  }
);

// UPDATE
export const updateRequestAsync = createAsyncThunk(
  "helpRequests/updateRequest",
  async (request: HelpRequestType) => {
    await api.put(`/api/HelpRequests/${request.id}`, request);
    return request;
  }
);

// DELETE
export const deleteRequestAsync = createAsyncThunk(
  "helpRequests/deleteRequest",
  async (id: number) => {
    await api.delete(`/api/HelpRequests/${id}`);
    return id;
  }
);

// STATUS UPDATE
export const updateStatusAsync = createAsyncThunk(
  "helpRequests/updateStatus",
  async ({ id, status }: { id: number; status: HelpRequestStatus }) => {
    await api.patch(`/api/HelpRequests/${id}/status`, { status });
    return { id, status };
  }
);

type HelpRequestsState = {
  items: HelpRequestType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: HelpRequestsState = {
  items: [],
  status: "idle",
  error: null,
};

const helpRequestsSlice = createSlice({
  name: "helpRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchHelpRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHelpRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchHelpRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load";
      })

      // ADD
      .addCase(addRequestAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // UPDATE
      .addCase(updateRequestAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteRequestAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(r => r.id !== action.payload);
      })

      // STATUS
      .addCase(updateStatusAsync.fulfilled, (state, action) => {
        const r = state.items.find(r => r.id === action.payload.id);
        if (r) {
          r.status = action.payload.status;
        }
      });
  },
});

export default helpRequestsSlice.reducer;

