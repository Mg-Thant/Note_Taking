import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/solid";
import { Link, Navigate, useParams } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";


import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../contexts/UserContext";

const NoteForm = ({ isCreate }) => {
  const [redirect, setRedirect] = useState(false);
  const [oldData, setOldData] = useState({});
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef();

  const { token } = useContext(UserContext);

  const params = useParams();
  const { id } = params;

  const getOldData = () => {
    fetch(`${import.meta.env.VITE_API}/notes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOldData(data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Zoom,
        });
      });
  };

  useEffect(() => {
    if (!isCreate) {
      getOldData();
    }
  }, []);

  const initialValues = {
    title: oldData?.title || "",
    content: oldData?.content || "",
    note_id: oldData?._id || "",
    image: oldData?.image || null,
  };

  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

  const NoteFormSchema = Yup.object({
    title: Yup.string()
      .min(4, "Title is too short!")
      .max(100, "Title is too long!")
      .required("Title is required!"),
    content: Yup.string()
      .min(5, "Content is too short!")
      .required("Content is required!"),
    image: Yup.mixed()
      .nullable()
      .test(
        "FILE_FORMAT",
        "File type isn't support!",
        (value) => !value || SUPPORTED_FORMATS.includes(value.type)
      ),
  });

  const handleImageChange = (event, setFieldValue) => {
    const sel_image = event.target.files[0];
    if (sel_image) {
      setPreviewImg(URL.createObjectURL(sel_image));
      setFieldValue("image", sel_image);
    }

    event.target.value = null;
  };

  const clearPreviewImg = (setFieldValue) => {
    setPreviewImg(null);
    setFieldValue("image", null);
    imgRef.current.value = null;
  };

  const submitHandler = async (values) => {
    setLoading(true);
    let API = `${import.meta.env.VITE_API}/create`;
    let method = "POST";

    if (!isCreate) {
      API = `${import.meta.env.VITE_API}/edit`;
      method = "PATCH";
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("image", values.image);
    formData.append("note_id", values.note_id);
    console.log(values);

    const res = await fetch(API, {
      method,
      body: formData,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    if (res.status === 201 || res.status === 200) {
      setRedirect(true);
    } else {
      toast.error("Something went wrong", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
    }
    setLoading(false);
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <section className="w-3/6 mx-auto">
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-center">
          {isCreate ? "Create New Note" : "Edit Note"}
        </h1>
        <Link to={"/"}>
          <ArrowLeftEndOnRectangleIcon
            width={40}
            className="text-teal-600 text-right"
          />
        </Link>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={NoteFormSchema}
        onSubmit={submitHandler}
        enableReinitialize={true}
      >
        {({ errors, touched, values, setFieldValue }) => {
          return (
            <Form encType="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="title" className="font-medium block mb-1">
                  Note Title <span className="text-red-600">*</span>
                </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="text-lg border-2 border-teal-600 py-1 px-2 w-full rounded-lg"
                />
                <ErrorMessage name="title" />
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="font-medium block mb-1">
                  Note content <span className="text-red-600">*</span>
                </label>
                <Field
                  as="textarea"
                  rows={6}
                  type="text"
                  name="content"
                  id="content"
                  className="text-lg border-2 border-teal-600 py-1 px-2 w-full rounded-lg"
                />
                <ErrorMessage name="content" />
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="image" className="font-medium block mb-1">
                    Enter Image
                  </label>
                  {previewImg && (
                    <p
                      className="font-medium cursor-pointer text-teal-600"
                      onClick={() => {
                        clearPreviewImg(setFieldValue);
                      }}
                    >
                      Clear
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  name="image"
                  id="image"
                  ref={imgRef}
                  onChange={(e) => {
                    handleImageChange(e, setFieldValue);
                  }}
                  className="text-lg border-2 border-teal-600 py-1 px-2 w-full rounded-lg"
                  hidden
                />
                <div
                  className="border-2 border-dashed border-teal-600 text-teal-600 mt-1 flex items-center justify-center h-72 rounded-md cursor-pointer overflow-hidden"
                  onClick={() => {
                    imgRef.current.click();
                    console.log(imgRef.current);
                  }}
                >
                  {isCreate ? (
                    previewImg ? (
                      <img
                        src={previewImg}
                        alt={"preview"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ArrowUpTrayIcon width={30} height={30} />
                    )
                  ) : previewImg || oldData.cover_image ? (
                    <img
                      src={
                        previewImg
                          ? previewImg
                          : `${import.meta.env.VITE_API}/${oldData.cover_image}`
                      }
                      alt={"preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ArrowUpTrayIcon width={30} height={30} />
                  )}
                </div>
                <ErrorMessage name="image" />
              </div>
              <Field name="note_id" id="note_id" hidden />
              <button
                className="text-white bg-teal-600 py-3 font-medium w-full text-center rounded-md"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="mx-auto w-fit h-fit">
                    <ReactLoading
                      type={"spin"}
                      color={"#fff"}
                      height={35}
                      width={35}
                    />
                  </div>
                ) : isCreate ? (
                  "Share Note"
                ) : (
                  "Update Note"
                )}
              </button>
            </Form>
          );
        }}
      </Formik>
    </section>
  );
};

export default NoteForm;
