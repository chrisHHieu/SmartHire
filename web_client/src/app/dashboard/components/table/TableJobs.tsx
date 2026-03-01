"use client";
import React, { useMemo } from "react";

import { createColumnHelper, Row } from "@tanstack/react-table";
import { TablePagination, Skeleton } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import UseTableTanStackSSR from "@/app/hooks/react-table/useTableTanStackSSR";
import { Dialog, Transition } from "@headlessui/react";
import {
  useJobDetailData,
  useFAQData,
  useDetailFAQData,
  useDeleteFAQData,
  useAddFAQData,
  useUpdateFAQData,
} from "@/app/hooks/react-query/logging/faq/useFAQData";
import "react-quill/dist/quill.snow.css"; // Import Quill
import JobDetailDrawer from "../../components-new/JobDetailDrawer";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCalendar, FiBriefcase } from "react-icons/fi";
import dynamic from "next/dynamic";

type Props = {};

interface InputItem {
  documentname: string;
  page: number;
}

type FormModel = {
  job_name: string;
  job_description: string;
};

interface DataFormModel {
  _id?: string;
  job_name: string;
  job_description: string;
}

const TableJobs = (props: Props) => {
  const [jobId, setJobId] = React.useState<string>("id");
  const jobDetailQuery = useJobDetailData(jobId);
  const [isOpenDrawer, setIsOpenDrawer] = React.useState<boolean>(false);

  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [isOpenModalDelete, setIsOpenModalDelete] =
    React.useState<boolean>(false);
  const [isOpenModalAdd, setIsOpenModalAdd] = React.useState<boolean>(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] =
    React.useState<boolean>(false);
  const [fetching, setIsFetching] = React.useState<boolean>(false);
  const [faqId, setFaqId] = React.useState<number>(-1);
  const [inputs, setInputs] = React.useState<InputItem[] | []>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [dataForm, setDataForm] = React.useState<DataFormModel>({
    job_name: "",
    job_description: "",
  });
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const { data, isLoading, isError, isPreviousData, refetch } = useFAQData(
    currentPage + 1,
    pageSize
  );
  const {
    data: detailFAQData,
    isLoading: isDetailFAQLoading,
    refetch: refetchDetailFAQData,
    isSuccess,
  } = useDetailFAQData(faqId);

  const { mutate: deleteFAQ } = useDeleteFAQData(faqId);
  const { mutate: addFAQ } = useAddFAQData(dataForm);
  const { mutate: updateFAQ } = useUpdateFAQData(dataForm, faqId);

  const [text, setText] = React.useState<string>("");

  const handleChange = (value: any) => {
    setText(value);
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormModel>({
    defaultValues: {
      job_name: "",
      job_description: `<h2>Job Brief:</h2>
      <p>We're seeking an AI Engineer to develop and implement AI solutions. You'll work on cutting-edge projects, designing, training, and integrating machine learning models.</p>

      <h3>Responsibilities:</h3>
      <ol>
        <li>Develop and optimize AI algorithms/models.</li>
        <li>Collaborate on cross-functional projects.</li>
        <li>Implement and integrate AI solutions.</li>
        <li>Evaluate and experiment with AI technologies.</li>
        <li>Ensure system scalability and performance.</li>
        <li>Provide documentation and technical support.</li>
      </ol>

      <h3>Requirements:</h3>
      <ul>
        <li>Bachelor's degree in Computer Science or related field.</li>
        <li>1-3 years of AI/machine learning experience.</li>
        <li>Proficiency in Python or TensorFlow.</li>
        <li>Strong understanding of ML algorithms.</li>
        <li>Experience with deep learning frameworks.</li>
        <li>Knowledge of NLP and CV a plus.</li>
        <li>Problem-solving skills.</li>
        <li>Excellent communication and teamwork.</li>
      </ul>`,
    },
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    control: control2,
    reset: reset2,
    formState: { errors: errors2 },
  } = useForm<FormModel>({
    defaultValues: { job_name: detailFAQData?.job_name },
  });

  const handlePageOnchange = (event: any, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(event.target.value);
  };

  // Column Definitions - Premium Refactoring
  const columnHelper = createColumnHelper<JobModel>();
  const columns = [
    columnHelper.display({
      header: "#",
      cell: ({ row }: { row: Row<any> }) => (
        <span className="text-xs font-bold text-slate-400 font-mono">
          {(currentPage * pageSize) + (row.index + 1)}
        </span>
      ),
    }),
    columnHelper.display({
      header: "Job Position",
      cell: ({ row }: { row: Row<any> }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FiBriefcase className="text-sm" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">{row.original.job_name}</span>
        </div>
      ),
    }),
    columnHelper.accessor("job_description", {
      header: "Description",
      cell: ({ row }: { row: Row<any> }) => {
        const [showFull, setShowFull] = React.useState(false);
        if (!row.original.job_description) return <span className="text-slate-300 italic text-xs">No description</span>;

        let plainText = row.original.job_description.replace(/<[^>]*>?/gm, '');
        const content = showFull ? plainText : plainText.slice(0, 150);

        return (
          <div className="max-w-md text-left">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {content}{!showFull && plainText.length > 150 ? '...' : ''}
            </p>
            {plainText.length > 150 && (
              <button
                className="mt-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 uppercase tracking-widest"
                onClick={() => setShowFull(!showFull)}
              >
                {showFull ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Date Posted",
      cell: (props) => (
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-xs">
          <FiCalendar className="opacity-70 text-slate-400 dark:text-slate-500" />
          <span>{new Date(props.getValue()).toLocaleDateString('en-US')}</span>
        </div>
      ),
    }),
    columnHelper.display({
      header: "Actions",
      cell: ({ row }: { row: Row<any> }) => (
        <div className="flex items-center justify-center gap-2">
          <button
            title="Edit Position"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-sm transition-all shadow-xs"
            onClick={() => handleModifyFAQ(row.original._id)}
          >
            <FiEdit2 className="text-xs" />
          </button>
          <button
            title="Delete Position"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500 hover:shadow-sm transition-all shadow-xs"
            onClick={() => handleDeleteFAQ(row.original._id)}
          >
            <FiTrash2 className="text-xs" />
          </button>
          <button
            className="btn btn-primary px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest"
            onClick={() => handleDetail(row.original._id)}
          >
            <FiEye className="text-sm" />
            <span>Details</span>
          </button>
        </div>
      ),
    }),
  ];


  if (isLoading) {
    return (
      <div className="px-4 pt-6 mt-2">
        <div className="font-medium text-xl p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-sm">
          <Skeleton variant="rectangular" width="100%" height={300} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <h4 className="text-center text-red-500 font-medium text-xl">
        System error, please try again later!
      </h4>
    );
  }

  const handleModifyFAQ = async (faqId: number) => {
    await setFaqId(faqId);
    refetchDetailFAQData();
    try {
      // const newInputs = (detailFAQData?.documents || []).map((document: any) => ({
      //   documentname: document.document,
      //   page: parseInt(document.page)
      // }));

      // setInputs([...inputs, ...newInputs]);
      setIsOpenModalUpdate(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFAQ = () => {
    setIsOpenModalAdd(true);
  };

  const confirmDeleteFAQ = () => {
    deleteFAQ(
      {},
      {
        onError: (error: any) => {
          console.log("Delete FAQ error:", error.response.status);
          setIsOpenModalDelete(false);
          toast.error("Delete job failed");
        },
        onSuccess: async () => {
          setIsOpenModalDelete(false);
          refetch();
          toast.success("Delete job successfully");
        },
      }
    );
  };

  if (isSuccess) {
    setValue2("job_name", detailFAQData.job_name);
    setValue2("job_description", detailFAQData.job_description);
  }

  //Submit form add FAQ
  const confirmAddFAQ = async (data: FormModel): Promise<void> => {
    setLoading(true);
    const params = {
      job_name: data.job_name,
      job_description: data.job_description,
    };

    if (data.job_name.trim().length === 0) {
      alert("Job name is required!");
      return;
    }

    if (data.job_description.trim().length < 100) {
      alert("Job description is too short!");
      return;
    }
    console.log(params);
    await setDataForm(params);

    addFAQ(
      {},
      {
        // onSettled
        onError: (error: any) => {
          setLoading(false);
          console.log("Create New Job error:", error.response.status);
          toast.error("Create new job failed");
        },
        onSuccess: async () => {
          setLoading(false);
          setIsOpenModalAdd(false);
          setInputs([]);
          refetch();
          reset();
          toast.success("Create new job successfully");
        },
      }
    );
  };

  //Submit form update FAQ
  const confirmUpdateFAQ = async (data: FormModel) => {
    setLoading(true);
    const params = {
      job_name: data.job_name,
      job_description: data.job_description,
    };

    // if (Array.isArray(inputs) && inputs.every((input) => input.documentname.trim().length > 0)) {
    //   params.documents = inputs.map((input) => ({
    //     page: input.page.toString(),
    //     document: input.documentname,
    //   }));
    // } else {
    //   alert('Document name is required.');
    //   return;
    // }

    await setDataForm(params);
    console.log(params);
    updateFAQ(
      {},
      {
        onError: (error: any) => {
          setLoading(false);
          console.log("Update FAQ error:", error.response.status);
          toast.error("Update job failed");
        },
        onSuccess: async () => {
          setLoading(false);
          setIsOpenModalUpdate(false);
          setInputs([]);
          refetch();
          reset();
          toast.success("Update job successfully");
        },
      }
    );
  };

  const handleDeleteFAQ = (faqId: number) => {
    setIsOpenModalDelete(true);
    setFaqId(faqId);
  };

  const closeModal = () => {
    setIsOpenModalDelete(false);
    setIsOpenModalAdd(false);
    setIsOpenModalUpdate(false);
    setInputs([]);
    reset();
  };

  const validateDocumentName = (documentname: string) => {
    return documentname.trim().length > 0;
  };

  const addInput = (): void => {
    setInputs([...inputs, { documentname: "", page: 0 }]);
  };

  const handleInputChange = (index: number, event: any) => {
    const { name, value } = event.target;
    const updatedInputs = [...inputs];
    updatedInputs[index] = { ...updatedInputs[index], [name]: value };
    setInputs(updatedInputs);
  };

  const handleDrawerClose = () => {
    setIsOpenDrawer(false);
  };

  const handleDetail = async (jobId: string) => {
    await setJobId(jobId);
    await jobDetailQuery.refetch();
    if (jobDetailQuery.isLoading) {
      setIsFetching(true);
    }
    setIsFetching(false);
    setIsOpenDrawer(true);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-jakarta mb-1">
            Job Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Create and manage your open positions easily.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary px-6 shadow-indigo-100"
          onClick={() => handleAddFAQ()}
        >
          <FiPlus className="text-lg" />
          <span>New Position</span>
        </button>
      </div>
      <UseTableTanStackSSR columns={columns} data={data.results} />

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        className="dark:text-white"
        count={data.total_job}
        page={currentPage}
        onPageChange={handlePageOnchange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal delete */}
      <Transition appear show={isOpenModalDelete} as={React.Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Notification
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this job?
                    </p>
                  </div>

                  <div className="mt-8 text-end">
                    <button
                      type="button"
                      className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => confirmDeleteFAQ()}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      No
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Drawer */}
      {isOpenDrawer && jobDetailQuery.data && (
        <JobDetailDrawer
          job={jobDetailQuery.data}
          onClose={handleDrawerClose}
        />
      )}

      {/* Modal Add FAQ */}
      <Transition appear show={isOpenModalAdd} as={React.Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Create New Job
                  </Dialog.Title>
                  <form
                    className="w-full"
                    onSubmit={handleSubmit(confirmAddFAQ)}
                  >
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5 mt-8">
                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Position Name
                        </label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="AI Engineer"
                          {...register("job_name")}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                      <div className="sm:col-span-2 h-72">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Job Description
                        </label>
                        {/* <textarea
                          className="h-60 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                          {...register("job_description")}
                        /> */}

                        <Controller
                          name="job_description"
                          control={control}
                          render={({ field }) => (
                            <ReactQuill
                              {...field}
                              theme="snow"
                              scrollingContainer={"#list-faq"}
                              className="h-60 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                              modules={{
                                toolbar: [
                                  ["bold", "italic", "underline", "strike"],
                                  [{ list: "ordered" }, { list: "bullet" }],
                                  ["link", "image"],
                                ],
                              }}
                              formats={[
                                "bold",
                                "italic",
                                "underline",
                                "strike",
                                "list",
                                "bullet",
                                "link",
                                "image",
                              ]}
                            />
                          )}
                        />
                      </div>
                    </div>
                    {/* <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          value="FAQ Category 1"
                          disabled
                        />
                      </div>
                    </div> */}
                    {/* <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                      <div className="sm:col-span-2">
                        <label className="inline-block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Documents
                        </label>
                        <button
                          onClick={addInput}
                          type="button"
                          className="inline-block ml-2 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          +
                        </button>
                        {inputs.map((input, index) => (
                          <div className="flex space-x-4 mt-2" key={index}>
                            <div className="w-3/4">
                              <input
                                type="text"
                                name="documentname"
                                value={input.documentname}
                                onChange={(event) => handleInputChange(index, event)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              />
                              {!validateDocumentName(input.documentname) && (
                                <p className="error-message text-sm text-red-600">* Document name is required.</p>
                              )}
                            </div>
                            <div className="w-1/4">
                              <input
                                type="number"
                                name="page"
                                value={input.page}
                                onChange={(event) => handleInputChange(index, event)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div> */}
                    <div className="mt-8 text-end">
                      {loading === false ? (
                        <>
                          <button
                            type="submit"
                            className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                            Yes
                          </button>

                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={closeModal}
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            disabled={true}
                            className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-500"
                          >
                            Yes
                          </button>

                          <button
                            type="button"
                            disabled={loading}
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-500"
                            onClick={closeModal}
                          >
                            No
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal Update FAQ */}
      <Transition appear show={isOpenModalUpdate} as={React.Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Update Job
                  </Dialog.Title>
                  <form
                    className="w-full"
                    onSubmit={handleSubmit2(confirmUpdateFAQ)}
                  >
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5 mt-8">
                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Position Name
                        </label>
                        <input
                          type="text"
                          // name="job_name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          {...register2("job_name")}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Job Description
                        </label>
                        <Controller
                          name="job_description"
                          control={control2}
                          defaultValue={detailFAQData?.job_description}
                          render={({ field }) => (
                            <ReactQuill
                              {...field}
                              theme="snow"
                              scrollingContainer={"#list-faq"}
                              className="h-60 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 resize-none"
                              modules={{
                                toolbar: [
                                  ["bold", "italic", "underline", "strike"],
                                  [{ list: "ordered" }, { list: "bullet" }],
                                  ["link", "image"],
                                ],
                              }}
                              formats={[
                                "bold",
                                "italic",
                                "underline",
                                "strike",
                                "list",
                                "bullet",
                                "link",
                                "image",
                              ]}
                            />
                          )}
                        />
                      </div>
                    </div>
                    {/* <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          value="FAQ Category 1"
                          disabled
                        />
                      </div>
                    </div> */}
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                      <div className="sm:col-span-2">
                        {/* <label className="inline-block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Documents
                        </label>
                        <button
                          onClick={addInput}
                          type="button"
                          className="inline-block ml-2 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          +
                        </button> */}
                        <div>
                          {/* {inputs.map((input, index) => (
                            <div className="flex space-x-4 mt-2" key={index}>
                              <div className="w-3/4">
                                <input
                                  type="text"
                                  name="documentname"
                                  value={input.documentname}
                                  onChange={(event) => handleInputChange(index, event)}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                                {!validateDocumentName(input.documentname) && (
                                  <p className="error-message text-sm text-red-600">* Document name is required.</p>
                                )}
                              </div>
                              <div className="w-1/4">
                                <input
                                  type="number"
                                  name="page"
                                  value={input.page}
                                  onChange={(event) => handleInputChange(index, event)}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                              </div>
                            </div>
                          ))} */}
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 text-end">
                      {loading === false ? (
                        <>
                          <button
                            type="submit"
                            className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                            Yes
                          </button>

                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={closeModal}
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            disabled={true}
                            className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-500"
                          >
                            Yes
                          </button>

                          <button
                            type="button"
                            disabled={true}
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-500"
                            onClick={closeModal}
                          >
                            No
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TableJobs;
