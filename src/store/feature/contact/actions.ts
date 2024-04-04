import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from '../../index';
import {server} from '../../../config';
import {Contact} from '../../../types/ContactTypes';

const Server = axios.create({
  baseURL: server,
});

export const getContact = createAsyncThunk<any, undefined, {state: RootState}>(
  'contact',
  async (_, {rejectWithValue}) => {
    try {
      const response = await Server.get('/contact', {
        headers: {Accept: 'application/json'},
      });

      let messages = 'something went wrong';
      if (response.status !== 200) {
        throw new Error(messages);
      }
      const data = response.data.data;

      return {
        contact: Object.values(data),
        status: response.status,
      };
    } catch (e: any) {
      return rejectWithValue(e.response.data);
    }
  },
);

export const postContact = createAsyncThunk<
  any,
  {
    firstName: string;
    lastName: string;
    age: number;
    photo: string;
  },
  {state: RootState}
>('postContact', async (datas, {rejectWithValue}) => {
  try {
    let dataUser = {
      firstName: datas.firstName,
      lastName: datas.lastName,
      age: datas.age,
      photo: datas.photo,
    };

    const response = await Server.post('/contact', dataUser, {
      headers: {Accept: 'application/json'},
    });

    let messages = 'something went wrong';
    if (response.status !== 201) {
      throw new Error(messages);
    }

    return {status: response.status};
  } catch (e: any) {
    return rejectWithValue(e.response.data);
  }
});

export const deleteContact = createAsyncThunk<
  any,
  {
    data: Contact;
  },
  {state: RootState}
>('deleteContact', async (datas, {rejectWithValue}) => {
  try {
    const response = await Server.delete(`/contact/${datas.data.id}`, {
      headers: {Accept: 'application/json'},
    });
    console.log('response ', response);

    let messages = 'something went wrong';
    if (response.status !== 201) {
      throw new Error(messages);
    }

    // return {id: datas.id};
  } catch (e: any) {
    console.log('error ', e);
    return rejectWithValue(e.response.data);
  }
});

export const editContact = createAsyncThunk<
  any,
  {
    firstName: string;
    lastName: string;
    age: number;
    photo: string;
    id: string;
  },
  {state: RootState}
>('editContact', async (datas, {rejectWithValue}) => {
  try {
    let dataUser = {
      firstName: datas.firstName,
      lastName: datas.lastName,
      age: datas.age,
      photo: datas.photo,
    };
    const response = await Server.put(`/contact/${datas.id}`, dataUser, {
      headers: {Accept: 'application/json'},
    });

    let messages = 'something went wrong';
    if (response.status !== 201) {
      throw new Error(messages);
    }

    return {status: response.status};
  } catch (e: any) {
    return rejectWithValue(e.response.data);
  }
});
