// Essentials
import { createSlice } from '@reduxjs/toolkit';

// Interfaces
import { LoungeITF, MemberCollectionITF } from '@interfaces/LoungeITF';

interface LoungeStateITF {
  lounge: LoungeITF | null;
  loungeList: {
    list: LoungeITF[],
    total: number
  };
  accessList: LoungeITF[];
  loungeFilter: string;
  loungeSearch: string;
  loungeTrigger: boolean;
  
  memberCollection: MemberCollectionITF | null;
};

const initialState: LoungeStateITF = {
  lounge: null,
  loungeList: {
    list: [],
    total: 0
  },
  accessList: [],

  loungeFilter: 'discover',
  loungeSearch: '',
  loungeTrigger: false,

  memberCollection: null
};

export const loungeReducer = createSlice({
  name: 'lounge',
  initialState,
  reducers: {
    setLounge: (state, action) => {
      state.lounge = action.payload;
    },
    setLoungeList: (state, action) => {
      state.loungeList = action.payload;
    },
    setAccessList: (state, action) => {
      state.accessList = action.payload;
    },
    setLoungeFilter: (state, action) => {
      state.loungeFilter = action.payload;
    },
    setLoungeSearch: (state, action) => {
      state.loungeSearch = action.payload;
    },
    setLoungeTrigger: (state, action) => {
      state.loungeTrigger = action.payload;
    },
    setMemberCollection: (state, action) => {
      state.memberCollection = action.payload;
    },
  }
});

export const {
  setLounge, setLoungeList, setAccessList,
  setLoungeFilter, setLoungeSearch, setLoungeTrigger,
  setMemberCollection
} = loungeReducer.actions;

export default loungeReducer.reducer;