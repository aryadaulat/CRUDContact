import {createSlice} from '@reduxjs/toolkit';
import {deleteContact, getContact, postContact} from './actions';
import {Contacts} from '../../../types/ContactTypes';

export interface ContactState {
  contacts: Contacts;
}

const initialState: ContactState = {
  contacts: {
    status: false,
    data: [],
    isRefresh: true,
  },
};

export const contactSlice = createSlice({
  name: 'contactState',
  initialState: initialState,
  reducers: {
    clearMarker: state => {
      state.contacts = {status: false, data: [], isRefresh: false};
    },
  },
  extraReducers: builder => {
    builder.addCase(getContact.fulfilled, (state, action) => {
      state.contacts.data = action.payload.contact;
      state.contacts.isRefresh = false;
      state.contacts.status = false;
    });
    builder.addCase(getContact.rejected, (state, _action) => {
      state.contacts.isRefresh = true;
      state.contacts.status = false;
    });
    builder.addCase(getContact.pending, (state, _action) => {
      state.contacts.status = true;
    });
    builder.addCase(postContact.fulfilled, (state, _action) => {
      state.contacts.isRefresh = true;
      state.contacts.status = false;
    });
    builder.addCase(postContact.rejected, (state, _action) => {
      state.contacts.status = false;
    });
    builder.addCase(postContact.pending, (state, _action) => {
      state.contacts.status = true;
    });
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.contacts.data = state.contacts.data.filter(
        item => item.id !== action.payload.id,
      );
      state.contacts.status = false;
    });
    builder.addCase(deleteContact.rejected, (state, _action) => {
      state.contacts.status = false;
    });
    builder.addCase(deleteContact.pending, (state, _action) => {
      state.contacts.status = true;
    });
  },
});

export const {clearMarker} = contactSlice.actions;
