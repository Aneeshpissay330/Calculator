import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number; // optional: for sorting or display
}

const initialState: HistoryItem[] = [];

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem: (state, action: PayloadAction<HistoryItem>) => {
      state.push(action.payload);
    },
    clearHistory: () => [],
  },
});

export const { addHistoryItem, clearHistory } = historySlice.actions;
export default historySlice.reducer;
