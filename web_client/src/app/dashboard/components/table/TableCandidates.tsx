"use client";
import React, { useEffect } from "react";
import { createColumnHelper, Row } from "@tanstack/react-table";
import UseTableTanStackSSR from "@/app/hooks/react-table/useTableTanStackSSR";
import {
  useDeleteFileData,
  useListCandidateData,
  useListFileDetailData,
} from "@/app/hooks/react-query/management/file/useFilesUploadData";
import { TablePagination } from "@mui/material";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import CandidateDetailDrawer from "../../components-new/CandidateDetailDrawer";
import { FiUser, FiMail, FiPhone, FiFileText, FiTrash2, FiEye, FiCheckCircle } from "react-icons/fi";
import { useGlobalContext } from "@/app/context/ContextProvider";

type Props = {
  data: CandidateResponseModel;
  refetch: () => void;
};

const TableCandidates = (props2: Props) => {
  const { language } = useGlobalContext();
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [isOpenDrawer, setIsOpenDrawer] = React.useState<boolean>(false);
  const [fetching, setIsFetching] = React.useState<boolean>(false);
  const [fileId, setFileId] = React.useState<string>("id");
  const [fileName, setFileName] = React.useState<string>("");
  const [isOpenModalDelete, setIsOpenModalDelete] =
    React.useState<boolean>(false);
  const fileDetailQuery = useListFileDetailData(fileId);
  const { mutate: deleteFile } = useDeleteFileData(fileId);

  // Fetch file data using the useListFileData hook
  // const { data, isLoading, isError, refetch } = useListCandidateData((currentPage + 1), pageSize);
  const { data, isLoading, isError, isPreviousData, refetch } =
    useListCandidateData(currentPage + 1, pageSize);

  // Create a function to periodically refetch data
  const startAutoRefresh = () => {
    const interval = 1000; // 3 seconds in milliseconds

    const refreshData = () => {
      refetch();
    };

    const refreshInterval = setInterval(refreshData, interval);

    // Return a function to clear the interval when needed
    return () => {
      clearInterval(refreshInterval);
    };
  };

  // Call startAutoRefresh when the component mounts
  useEffect(() => {
    const stopAutoRefresh = startAutoRefresh();

    // Return a cleanup function to clear the interval when the component unmounts
    return () => {
      stopAutoRefresh();
    };
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  const showModalDelete = async (fileId: string, fileName: string) => {
    await setFileId(fileId);
    await setFileName(fileName);
    setIsOpenModalDelete(true);
  };

  const closeModal = () => {
    setIsOpenModalDelete(false);
  };

  const handleDeleteFile = () => {
    deleteFile(
      {},
      {
        onError: async (error: any) => {
          console.log("Delete file error:", error.response.status);
          setIsOpenModalDelete(false);
          toast.error(t.deleteError);
        },
        onSuccess: async () => {
          setIsOpenModalDelete(false);
          props2.refetch();
          toast.success(t.deleteSuccess);
        },
      }
    );
  };

  const translations = {
    EN: {
      candidate: "Candidate",
      contactCV: "Contact & CV",
      recommended: "Recommended For",
      actions: "Actions",
      profile: "Profile",
      delete: "Delete Profile",
      confirmDelete: "Are you sure you want to delete this profile? This action cannot be undone.",
      cancel: "Cancel",
      deleteBtn: "Delete",
      deleteSuccess: "Delete profile successful",
      deleteError: "Delete profile failed",
      notAvailable: "N/A"
    },
    VI: {
      candidate: "Ứng viên",
      contactCV: "Liên hệ & CV",
      recommended: "Vị trí đề xuất",
      actions: "Thao tác",
      profile: "Hồ sơ",
      delete: "Xoá hồ sơ",
      confirmDelete: "Bạn có chắc chắn muốn xoá hồ sơ này không? Hành động này không thể hoàn tác.",
      cancel: "Huỷ bỏ",
      deleteBtn: "Xoá",
      deleteSuccess: "Xoá hồ sơ thành công",
      deleteError: "Xoá hồ sơ thất bại",
      notAvailable: "Không có"
    }
  };

  const t = translations[language];

  // Column Definitions - Premium Refactoring
  const columnHelper = createColumnHelper<CandidateModel>();
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
      header: t.candidate,
      cell: ({ row }: { row: Row<any> }) => (
        <div className="flex items-center gap-3 text-left">
          {row.original.avatar_url ? (
            <img
              src={row.original.avatar_url}
              alt={row.original.candidate_name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">
              <FiUser className="text-sm" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-white leading-tight">{row.original.candidate_name}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <FiMail className="text-[10px] text-slate-400 dark:text-slate-500" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.original.email}</span>
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.display({
      header: t.contactCV,
      cell: ({ row }: { row: Row<any> }) => (
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
            <FiPhone className="text-indigo-500 text-[10px]" />
            <span>{row.original.phone_number || t.notAvailable}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 italic">
            <FiFileText className="text-[10px]" />
            <span className="truncate max-w-[120px]">{row.original.cv_name}</span>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("job_recommended", {
      header: t.recommended,
      cell: (props: any) => {
        const recommendedJobs = props.getValue();
        if (!recommendedJobs) return <span className="text-slate-300 italic text-xs">-</span>;

        const jobsArray = Array.isArray(recommendedJobs) ? recommendedJobs : [recommendedJobs];

        return (
          <div className="flex flex-wrap gap-1.5 justify-start max-w-[250px]">
            {jobsArray.map((job: any, index: any) => (
              <span key={index} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-[10px] font-bold text-indigo-600 dark:text-indigo-300 uppercase">
                {job}
              </span>
            ))}
          </div>
        );
      },
    }),
    columnHelper.display({
      header: t.actions,
      cell: ({ row }: { row: Row<any> }) => (
        <div className="flex items-center justify-center gap-2">
          <button
            title={t.delete}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500 hover:shadow-sm transition-all shadow-xs"
            onClick={() => showModalDelete(row.original._id, row.original.cv_name)}
          >
            <FiTrash2 className="text-xs" />
          </button>
          <button
            className="btn btn-secondary px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest shadow-sm border-slate-200 dark:border-slate-700"
            onClick={() => {
              // Create a synthetic event mapping since handleDetail expects event.target.value
              handleDetail({ target: { value: row.original._id } });
            }}
          >
            <FiEye className="text-sm" />
            <span>{t.profile}</span>
          </button>
        </div>
      ),
    }),
  ];


  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(event.target.value);
  };

  const handlePageOnchange = (event: any, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDrawerClose = () => {
    setIsOpenDrawer(false);
  };

  const handleDetail = async (event: any) => {
    await setFileId(event.target.value);
    await fileDetailQuery.refetch();
    if (fileDetailQuery.isLoading) {
      setIsFetching(true);
    }
    setIsFetching(false);
    setIsOpenDrawer(true);
  };

  return (
    <>

      <UseTableTanStackSSR columns={columns} data={data!.results} />
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        className="dark:text-white"
        count={data!.total_file}
        page={currentPage}
        onPageChange={handlePageOnchange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Drawer */}
      {isOpenDrawer && fileDetailQuery.data && (
        <CandidateDetailDrawer
          candidate={fileDetailQuery.data}
          onClose={handleDrawerClose}
        />
      )}

      {/* Modal confirm delete */}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {t.delete}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {t.confirmDelete}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleDeleteFile}
                    >
                      {t.deleteBtn}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </>
  );
};

export default TableCandidates;
