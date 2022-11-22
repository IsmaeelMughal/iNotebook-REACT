import React, { useContext } from "react";
import noteContext from "../context/notes/NoteContext";

function NoteItem(props) {
  const { note, updateNote } = props;
  const context = useContext(noteContext);
  const { deleteNote } = context;
  return (
    <div className="col-md-4 my-3">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{note.title}</h5>
            <i
              className="fa-solid fa-trash mx-3"
              onClick={() => {
                deleteNote(note._id);
              }}
            ></i>
            <i
              className="fa-solid fa-pen-to-square mx-3 "
              onClick={() => {
                updateNote(note);
              }}
            ></i>
          </div>
          <h6 className="card-subtitle mb-2 text-muted">{note.tag}</h6>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
}

export default NoteItem;
