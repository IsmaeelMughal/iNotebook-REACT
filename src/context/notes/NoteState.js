import noteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
  //   const s1 = {
  //     name: "Ismaeel Mughal",
  //     class: "Master",
  //   };
  //   const [state, setState] = useState(s1);
  //   const update = () => {
  //     setTimeout(() => {
  //       setState({
  //         name: "MUGHAL",
  //         class: "SAME",
  //       });
  //     }, 2000);
  //   };

  const host = "http://localhost:5000";

  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // get all notes
  const getNotes = async () => {
    const url = `${host}/api/notes/fetchallnotes `;
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM2OGZlZjlkNzJhM2U3OGMzMDk3MmIwIn0sImlhdCI6MTY2NzgzMDAwN30.kvS76iwv46hXCPfRfyLXpNjo68DNX9T5jYrRoGOPLiQ",
      },
    });
    const json = await response.json();
    setNotes(json);
  };

  //  Add a note
  const addNote = async (title, description, tag) => {
    const url = `${host}/api/notes/addnote `;
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM2OGZlZjlkNzJhM2U3OGMzMDk3MmIwIn0sImlhdCI6MTY2NzgzMDAwN30.kvS76iwv46hXCPfRfyLXpNjo68DNX9T5jYrRoGOPLiQ",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const res = response.json();
    const note = {
      _id: "636eb1b3ef75b112126d060f9a8",
      user: "6368fef9d72a3e78c30972b0",
      title: title,
      description: description,
      tag: tag,
      date: "2022-11-11T20:33:55.857Z",
      __v: 0,
    };

    setNotes(notes.concat(note));
  };

  // Delete  a note
  const deleteNote = async (id) => {
    const url = `${host}/api/notes/deletenote/${id} `;
    const response = await fetch(url, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM2OGZlZjlkNzJhM2U3OGMzMDk3MmIwIn0sImlhdCI6MTY2NzgzMDAwN30.kvS76iwv46hXCPfRfyLXpNjo68DNX9T5jYrRoGOPLiQ",
      },
    });
    const res = response.json();
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    const url = `${host}/api/notes/updatenote/${id} `;
    const response = await fetch(url, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM2OGZlZjlkNzJhM2U3OGMzMDk3MmIwIn0sImlhdCI6MTY2NzgzMDAwN30.kvS76iwv46hXCPfRfyLXpNjo68DNX9T5jYrRoGOPLiQ",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const res = response.json();

    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        element.title = title;
        element.description = description;
        element.tag = description.tag;
      }
    }
  };

  return (
    <noteContext.Provider
      value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
