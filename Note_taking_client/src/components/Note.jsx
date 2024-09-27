import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import React, { useContext } from "react";
import { Link, redirect } from "react-router-dom";
import formatISO9075 from "date-fns/formatISO9075";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserContext } from "../contexts/UserContext";

const Note = ({ note, fetchNotes }) => {
  const { token } = useContext(UserContext);

  const handleDeleteNote = async () => {
    const localToken = JSON.parse(localStorage.getItem("token"));
    if (!localToken) {
      localStorage.setItem("token", null);
      window.location.reload(false);
    }
    const res = await fetch(`${import.meta.env.VITE_API}/status`, {
      headers: {
        Authorization: `Beaer ${localToken.token}`,
      },
    });
    if (res.status === 401) {
      localStorage.setItem("token", null);
      window.location.reload(false);
    } else {
      deleteNote();
    }
  };

  const deleteNote = async () => {
    const res = await fetch(`${import.meta.env.VITE_API}/delete/${note._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    if (res.status === 204) {
      toast.success("Post Deleted", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
        onClose: () => {
          fetchNotes();
        },
      });
    } else {
      toast.error("Authorizatoin Failed", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
    }
  };

  return (
    <div className="w-1/4 h-fit border border-t-4 border-t-teal-600 shadow-slate-400 shadow-lg p-3">
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h3 className="text-xl font-medium mb-1 uppercase">
        {note.title.slice(0, 20)}
      </h3>
      {note.creator && (
        <div className="flex items-center gap-1 mb-5">
          <UserIcon width={20} />
          <p>{note.creator.username}</p>
        </div>
      )}
      <p className="text-md mb-4">{note.content.slice(0, 100)}</p>
      <hr />
      <div className="flex item-center justify-between gap-1 mt-2">
        <p className="text-sm">
          {formatISO9075(note.createdAt, { representation: "date" })}
        </p>
        <div className="flex items-center justify-end">
          {token ? (
            note.creator._id.toString() === token.userId ? (
              <>
                <TrashIcon
                  width={25}
                  className="text-red-600 cursor-pointer"
                  onClick={handleDeleteNote}
                />
                <Link to={`/edit/${note._id}`}>
                  <PencilSquareIcon width={25} className="text-teal-600" />
                </Link>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          <Link to={`/notes/${note._id}`}>
            <EyeIcon width={25} className="text-teal-600" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Note;
