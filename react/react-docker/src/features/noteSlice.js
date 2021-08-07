import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "http://localhost:8000/";

export const fetchAsyncGetMyNotes = createAsyncThunk(
    "mynotes/get",
    async () => {
        const res = await axios.get(`${apiUrl}api/mynotes/`, {
            headers: {
                Authorization: `token ${localStorage.token}`,
            },
        });
        return res.data;
    }
);
export const fetchAsyncCreateNote = createAsyncThunk(
    "note/post",
    async (note) => {
        const res = await axios.post(`${apiUrl}api/notes/`, note, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `token ${localStorage.token}`,
            },
        });
        return res.data;
    }
);
export const fetchAsyncUpdateNote = createAsyncThunk(
    "note/put",
    async (note) => {
        const res = await axios.put(`${apiUrl}api/notes/${note.id}/`, note,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `token ${localStorage.token}`,
                },
            }
        );
        return res.data;
    }
);
export const fetchAsyncDeleteNote = createAsyncThunk(
    "note/delete",
    async (id) => {
        const res = await axios.delete(`${apiUrl}api/notes/${id}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `token ${localStorage.token}`,
            },
        });
        return id;
    }
);
export const noteSlice = createSlice({
    name: "note",
    initialState: {
        notes: [
            {
                id: 0,
                title: "",
                body: "",
            },
        ],
        editedNote: {
            id: 0,
            title: "",
            body: "",
        },
    },
    reducers: {
        editNote(state, action) {
            state.editedNote = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncGetMyNotes.fulfilled, (state, action) => {
            return {
                ...state,
                notes: action.payload,
            };
        });
        builder.addCase(fetchAsyncCreateNote.fulfilled, (state, action) => {
            return {
                ...state,
                notes: [...state.notes, action.payload],
            };
        });
        builder.addCase(fetchAsyncUpdateNote.fulfilled, (state, action) => {
            return {
                ...state,
                notes: state.notes.map((note) =>
                    note.id === action.payload.id ? action.payload : note
                ),
            };
        });
        builder.addCase(fetchAsyncDeleteNote.fulfilled, (state, action) => {
            return {
                ...state,
                notes: state.notes.filter(
                    (note) => note.id !== action.payload
                ),
            };
        });
    },
});

export const { editNote } = noteSlice.actions;

export const selectNotes = (state) => state.note.notes;
export const selectEditedNote = (state) => state.note.editedNote;

export default noteSlice.reducer;