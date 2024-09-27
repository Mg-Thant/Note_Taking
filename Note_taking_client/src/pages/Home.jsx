import React, { useEffect, useState } from "react";

import Note from "../components/Note";
import { Loading } from "./index";

const index = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotes, setTotalnotes] = useState(0);

  const fetchNotes = (pageNum) => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API}/notes?page=${pageNum}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setNotes(data.notes);
        setTotalnotes(data.totalNotes);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    fetchNotes(currentPage);
  }, [currentPage]);

  const handlePrevPage = (prev) => {
    if (currentPage > 1) {
      setCurrentPage(prev - 1);
    }
  };

  const handleNextPage = (prev) => {
    if (currentPage * 6 < totalNotes) {
      setCurrentPage(prev + 1);
    }
  };

  return (
    <>
      <section className="flex gap-6 mt-10 mx-auto flex-wrap justify-center w-10/12 mb-5">
        {loading ? (
          <Loading />
        ) : notes.length > 0 ? (
          <>
            {notes.map((note) => (
              <Note key={note._id} note={note} fetchNotes={fetchNotes} />
            ))}
          </>
        ) : (
          <p className="text-xl font-bold">Create your note!</p>
        )}
      </section>
      <div className="flex items-center justify-center gap-6 mx-auto">
        {currentPage > 1 && (
          <button
            type="button"
            className="text-white font-medium bg-teal-600 py-1 px-3 rounded-md"
            onClick={() => {
              handlePrevPage(currentPage);
            }}
          >
            Prev Page
          </button>
        )}
        {currentPage * 6 < totalNotes && (
          <button
            type="button"
            className="text-white font-medium bg-teal-600 py-1 px-3 rounded-md"
            onClick={() => {
              handleNextPage(currentPage);
            }}
          >
            Next Page
          </button>
        )}
      </div>
    </>
  );
};

export default index;
