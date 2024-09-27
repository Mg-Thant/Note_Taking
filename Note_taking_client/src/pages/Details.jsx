import React, { useEffect, useState } from "react";
import {
  ArrowLeftEndOnRectangleIcon,
  CalendarDaysIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import { Loading } from "./index";
import { formatISO9075 } from "date-fns";

const Details = () => {
  const params = useParams();
  const [note, setNote] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API}/notes/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setNote(data);
        const createdAt = formatISO9075(new Date(data.createdAt), {
          representation: "date",
        });
        setCreatedAt(createdAt);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <section className="w-4/6 px-10 mt-10 mx-auto">
      {loading && <Loading />}
      {!loading && note && (
        <div className="border border-t-4 border-t-teal-600 shadow-slate-400 shadow-lg p-3 w-4/6 mx-auto">
          <div className="flex justify-between">
            <h3 className="text-3xl font-medium">{note.title}</h3>
            <Link to={"/"}>
              <ArrowLeftEndOnRectangleIcon
                width={40}
                className="text-teal-600"
              />
            </Link>
          </div>
          {note.cover_image && (
            <img
              src={`${import.meta.env.VITE_API}/${note.cover_image}`}
              alt={note.title}
              className="my-4 h-72 w-full object-fill"
            />
          )}
          {note.creator ? (
            <div className="flex items-center gap-1">
              <UserIcon width={20} />
              <p>{note.creator.username}</p>
            </div>
          ) : (
            ""
          )}
          <div className="text-sm flex items-center gap-1 mt-1">
            <CalendarDaysIcon width={30} /> {createdAt}
          </div>
          <p className="text-base mt-2">{note.content}</p>
        </div>
      )}
    </section>
  );
};

export default Details;
