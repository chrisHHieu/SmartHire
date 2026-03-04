"use client";
import React, { useState, useEffect } from "react";

import { createColumnHelper, Row } from "@tanstack/react-table";
import { TablePagination } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import UseTableTanStackSSR from "@/app/hooks/react-table/useTableTanStackSSR";
import { Menu, Dialog, Transition } from "@headlessui/react";
import {
  useMachingData,
  useFAQData,
  useMatchingPageData,
  useAllJobData,
  useDetailFAQData,
  useDeleteFAQData,
  useAddFAQData,
  useUpdateFAQData,
  useMatchingSelectiveData,
} from "@/app/hooks/react-query/logging/faq/useFAQData";
import { useMatchingDetailData } from "@/app/hooks/react-query/management/file/useFilesUploadData";
import MatchingDetailDrawer from "../../components-new/MatchingDetailDrawer";
import { useGlobalContext } from "@/app/context/ContextProvider";

import { BsChevronDown } from "react-icons/bs";
import { MdLightbulbOutline, MdLightbulb } from "react-icons/md";
import { FiTarget, FiChevronDown, FiZap, FiBox, FiActivity, FiCheckSquare, FiSquare, FiDatabase, FiUserCheck, FiInfo, FiLoader, FiUser, FiMail, FiX } from "react-icons/fi";

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

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
  _id?: number;
  job_name: string;
  job_description: string;
}

const TableMatching = (props: Props) => {
  const { language } = useGlobalContext();
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [isOpenDrawer, setIsOpenDrawer] = React.useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] =
    React.useState<boolean>(false);
  const [isOpenModalAdd, setIsOpenModalAdd] = React.useState<boolean>(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] =
    React.useState<boolean>(false);
  const [fetching, setIsFetching] = React.useState<boolean>(false);
  const [faqId, setFaqId] = React.useState<number>(-1);
  const [inputs, setInputs] = React.useState<InputItem[] | []>([]);
  const [CandidateId, setCandidateId] = React.useState<string>("id");
  const [selectedJobId, setSelectedJobId] = React.useState<string>("id");
  const [selectedCandidateIds, setSelectedCandidateIds] = React.useState<string[]>([]);
  const candidateDetailQuery = useMatchingDetailData(
    CandidateId,
    selectedJobId
  );
  const [loadingMatching, setLoadingMatching] = React.useState<boolean>(false);

  const [dataForm, setDataForm] = React.useState<DataFormModel>({
    job_name: "",
    job_description: "",
  });

  // const { data, isLoading, isError, isPreviousData, refetch } = useFAQData((currentPage + 1), pageSize);
  // const { data: detailFAQData, isLoading: isDetailFAQLoading, refetch: refetchDetailFAQData, isSuccess } = useDetailFAQData(faqId);
  const { data: detailAllJobData } = useAllJobData();

  const { mutate: deleteFAQ } = useDeleteFAQData(faqId);
  const { mutate: addFAQ } = useAddFAQData(dataForm);
  const { mutate: updateFAQ } = useUpdateFAQData(dataForm, faqId);

  // Define a state variable to store the selected job name
  const [selectedJobName, setSelectedJobName] =
    useState<string>(language === 'VI' ? "Tên vị trí" : "Position Name");
  const { mutate: processMatching } = useMachingData(selectedJobName);
  const { mutate: processMatchingSelective } = useMatchingSelectiveData();
  const { data, isLoading, isError, isPreviousData, refetch } =
    useMatchingPageData(selectedJobName, currentPage + 1, pageSize);

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

  // Handle item selection
  const handleMenuItemClick = async (jobId: string, jobName: string) => {
    await setSelectedJobId(jobId);
    await setSelectedJobName(jobName);

    // Call refetch to fetch data for the newly selected job
    refetch();
    setSelectedCandidateIds([]); // Clear selection when job changes
  };

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidateIds(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const toggleAllSelection = () => {
    if (!data?.results) return;
    if (selectedCandidateIds.length === data.results.length) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(data.results.map((c: any) => c.id));
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormModel>({
    defaultValues: {},
  });

  const handlePageOnchange = (event: any, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(event.target.value);
  };
  const handleDrawerClose = () => {
    setIsOpenDrawer(false);
  };

  const handleDetail = async (candidateId: string, jobId: string) => {
    await setCandidateId(candidateId);
    await setSelectedJobId(jobId);

    await candidateDetailQuery.refetch();
    if (candidateDetailQuery.isLoading) {
      setIsFetching(true);
    }
    setIsFetching(false);
    setIsOpenDrawer(true);
  };

  const translations = {
    EN: {
      title: "Matching Analysis",
      subtitle: "Analyze and rank candidates based on job requirements.",
      selectedCount: "SELECTED",
      selectJob: "Select Job Position",
      candidatesSelected: "Candidates Selected",
      readyForAI: "Ready for AI Matching",
      deselect: "Deselect",
      runAnalysis: "RUN ANALYSIS",
      candidate: "Candidate",
      aiSummary: "AI Summary",
      matchScore: "Match Score",
      status: "Status",
      actions: "Actions",
      analysisBtn: "Analysis",
      noAnalysis: "No analysis",
      readMore: "Read More",
      showLess: "Show Less",
      matched: "Matched",
      pending: "Pending",
      loading: "Loading...",
      errorSystem: "System error, please try again later!",
      deleteConfirm: "Are you sure you want to delete this job?",
      notification: "Notification",
      yes: "Yes",
      no: "No",
      matchingSuccess: "Candidate matching successful",
      matchingError: "Candidate matching failed",
      selectiveSuccess: "Selected candidates matched successfully",
      selectiveError: "Selected matching failed"
    },
    VI: {
      title: "Phân tích độ phù hợp",
      subtitle: "Phân tích và xếp hạng ứng viên dựa trên yêu cầu công việc.",
      selectedCount: "ĐÃ CHỌN",
      selectJob: "Chọn vị trí tuyển dụng",
      candidatesSelected: "Ứng viên được chọn",
      readyForAI: "Sẵn sàng phân tích AI",
      deselect: "Bỏ chọn",
      runAnalysis: "CHẠY PHÂN TÍCH",
      candidate: "Ứng viên",
      aiSummary: "Tóm tắt từ AI",
      matchScore: "Điểm phù hợp",
      status: "Trạng thái",
      actions: "Thao tác",
      analysisBtn: "Xem phân tích",
      noAnalysis: "Chưa có phân tích",
      readMore: "Xem thêm",
      showLess: "Thu gọn",
      matched: "Đã phân tích",
      pending: "Đang chờ",
      loading: "Đang tải...",
      errorSystem: "Lỗi hệ thống, vui lòng thử lại sau!",
      deleteConfirm: "Bạn có chắc chắn muốn xoá vị trí này không?",
      notification: "Thông báo",
      yes: "Đồng ý",
      no: "Huỷ bỏ",
      matchingSuccess: "Phân tích ứng viên thành công",
      matchingError: "Phân tích ứng viên thất bại",
      selectiveSuccess: "Phân tích các ứng viên đã chọn thành công",
      selectiveError: "Phân tích các ứng viên đã chọn thất bại"
    }
  };

  const t = translations[language];

  // Column Definitions - Premium Refactoring
  const columnHelper = createColumnHelper<JobMatchingModel>();
  const columns = [
    columnHelper.display({
      id: "selection",
      header: () => (
        <button
          onClick={toggleAllSelection}
          className="flex items-center justify-center hover:text-indigo-500 transition-colors"
        >
          {data?.results && selectedCandidateIds.length > 0 && selectedCandidateIds.length === data.results.length ? (
            <FiCheckSquare className="text-lg text-indigo-500" />
          ) : (
            <FiSquare className="text-lg" />
          )}
        </button>
      ),
      cell: ({ row }: { row: Row<any> }) => (
        <button
          onClick={() => toggleCandidateSelection(row.original.id)}
          className="flex items-center justify-center hover:text-indigo-500 transition-colors"
        >
          {selectedCandidateIds.includes(row.original.id) ? (
            <FiCheckSquare className="text-lg text-indigo-500" />
          ) : (
            <FiSquare className="text-lg text-slate-300" />
          )}
        </button>
      ),
    }),
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
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{row.original.candidate_email}</span>
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("summary_comment", {
      header: t.aiSummary,
      cell: ({ row }: { row: Row<any> }) => {
        const [showFull, setShowFull] = React.useState(false);
        if (!row.original.summary_comment) return <span className="text-slate-300 italic text-xs">{t.noAnalysis}</span>;

        const content = showFull ? row.original.summary_comment : row.original.summary_comment.slice(0, 120);
        return (
          <div className="max-w-md text-left">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-slate-100 dark:border-slate-800 pl-3">
              "{content}{!showFull && row.original.summary_comment.length > 120 ? '...' : ''}"
            </p>
            {row.original.summary_comment.length > 120 && (
              <button
                className="mt-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 uppercase tracking-widest"
                onClick={() => setShowFull(!showFull)}
              >
                {showFull ? t.showLess : t.readMore}
              </button>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("score", {
      header: t.matchScore,
      cell: (props) => {
        const score = Number(props.getValue() || 0);
        let statusColor = "text-rose-500 bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-800/20 dark:text-rose-400";
        let barColor = "bg-rose-500";

        if (score >= 80) {
          statusColor = "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/20 dark:text-emerald-400";
          barColor = "bg-emerald-500";
        } else if (score >= 60) {
          statusColor = "text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-800/20 dark:text-indigo-400";
          barColor = "bg-indigo-500";
        } else if (score >= 40) {
          statusColor = "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/20 dark:text-amber-400";
          barColor = "bg-amber-500";
        }

        return (
          <div className="flex items-center justify-center gap-3">
            <div className={`px-2.5 py-1 rounded-lg border font-black text-xs ${statusColor}`}>
              {score}%
            </div>
            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden lg:block">
              <div
                className={`h-full ${barColor} transition-all duration-500`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      header: t.status,
      cell: ({ row }: { row: Row<any> }) => {
        const isMatched = !!row.original.matching_status;
        return (
          <span className={`badge ${isMatched ? 'badge-success' : 'badge-warning'} shadow-sm whitespace-nowrap px-4 py-1`}>
            {isMatched ? t.matched : t.pending}
          </span>
        );
      },
    }),
    columnHelper.display({
      header: t.actions,
      cell: ({ row }: { row: Row<any> }) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="btn btn-secondary px-4 py-1.5 text-xs font-bold hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            onClick={() => handleDetail(row.original.id, selectedJobId)}
          >
            <FiTarget className="text-indigo-600 dark:text-indigo-400" />
            <span>{t.analysisBtn}</span>
          </button>
        </div>
      ),
    }),
  ];

  if (isLoading) {
    return (
      <div className="px-4 pt-6 mt-2">
        <div className="font-medium text-xl p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-sm">
          <h4 className="animate-pulse text-center text-blue-500">
            {t.loading}
          </h4>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <h4 className="text-center text-red-500 font-medium text-xl">
        {t.errorSystem}
      </h4>
    );
  }

  const handleMatchingCandidate = async () => {
    if (selectedJobName !== "Position Name") {
      setLoadingMatching(true);

      const isSelective = selectedCandidateIds.length > 0;

      const onSuccess = async () => {
        setLoadingMatching(false);
        setIsOpenModalAdd(false);
        setInputs([]);
        setSelectedCandidateIds([]); // Clear selection on success
        refetch();
        reset();
        toast.success(
          isSelective
            ? t.selectiveSuccess
            : t.matchingSuccess
        );
      };

      const onError = (error: any) => {
        setLoadingMatching(false);
        toast.error(
          isSelective ? t.selectiveError : t.matchingError
        );
      };

      if (isSelective) {
        processMatchingSelective(
          { candidate_ids: selectedCandidateIds, job_id: selectedJobId },
          { onSuccess, onError }
        );
      } else {
        processMatching({}, { onSuccess, onError });
      }
    }
  };

  const confirmDeleteFAQ = () => {
    deleteFAQ(
      {},
      {
        onError: (error: any) => {
          console.log("Delete FAQ error:", error.response.status);
          setIsOpenModalDelete(false);
          toast.error("Delete FAQ Failed");
        },
        onSuccess: async () => {
          setIsOpenModalDelete(false);
          refetch();
          toast.success("Delete FAQ success");
        },
      }
    );
  };

  // if (isSuccess) {
  //   setValue2('job_name', detailFAQData.job_name)
  //   setValue2('job_description', detailFAQData.job_description)
  // }

  //Submit form add FAQ
  const confirmAddFAQ = async (data: FormModel): Promise<void> => {
    const params = {
      job_name: data.job_name,
      job_description: data.job_description,
    };

    if (
      Array.isArray(inputs) &&
      inputs.every((input) => input.documentname.trim().length > 0)
    ) {
      // params.documents = inputs.map((input) => ({
      //   page: input.page.toString(),
      //   document: input.documentname,
      // }));
      alert("oke");
    } else {
      alert("Document name is required.");
      return;
    }
    console.log(params);
    await setDataForm(params);

    addFAQ(
      {},
      {
        onError: (error: any) => {
          console.log("Matching error:", error.response.status);
          toast.error(language === 'VI' ? 'Phân tích thất bại' : "Matching failed");
        },
        onSuccess: async () => {
          setIsOpenModalAdd(false);
          setInputs([]);
          refetch();
          reset();
          toast.success(language === 'VI' ? 'Phân tích thành công' : "Matching successful");
        },
      }
    );
  };

  //Submit form update FAQ
  const confirmUpdateFAQ = async (data: FormModel) => {
    const params = {
      job_name: data.job_name,
      job_description: data.job_description,
    };

    await setDataForm(params);
    console.log(params);
    updateFAQ(
      {},
      {
        onError: (error: any) => {
          console.log("Update FAQ error:", error.response.status);
          toast.success("Update FAQ failed");
        },
        onSuccess: async () => {
          setIsOpenModalUpdate(false);
          setInputs([]);
          refetch();
          reset();
          toast.success(language === 'VI' ? 'Cập nhật thành công' : "Update FAQ success");
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

  // Cast score to a number
  const score = Number(candidateDetailQuery.data?.score);
  let textColor = "text-red-500"; // Default to red
  switch (true) {
    case score < 40:
      textColor = "text-red-500";
      break;
    case score >= 40 && score < 50:
      textColor = "text-orange-500";
      break;
    case score >= 50 && score < 60:
      textColor = "text-yellow-500";
      break;
    case score >= 60 && score < 70:
      textColor = "text-blue-500"; // You can choose a different color
      break;
    default:
      textColor = "text-green-500"; // Highest score is green
      break;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-jakarta mb-1 flex items-center gap-3">
            {t.title}
            {selectedCandidateIds.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 animate-in fade-in zoom-in duration-300">
                {selectedCandidateIds.length} {t.selectedCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm">
                <FiBox className="text-indigo-500" />
                <span>{(selectedJobName === "Position Name" || selectedJobName === "Tên vị trí") ? t.selectJob : selectedJobName}</span>
                <FiChevronDown className="text-slate-400 dark:text-slate-500" />
              </Menu.Button>
            </div>

            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-[100] mt-2 w-64 origin-top-right rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 focus:outline-none overflow-hidden p-1">
                <div className="bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 mb-1">
                  {t.selectJob}
                </div>
                {detailAllJobData?.map((item) => (
                  <Menu.Item key={item._id}>
                    {({ active }) => (
                      <button
                        onClick={() => handleMenuItemClick(item._id, item.job_name)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors text-left
                          ${active ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}
                        `}
                      >
                        <div className={`w-2 h-2 rounded-full ${active ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        {item.job_name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

        </div>
      </div>

      {/* Selection Stats Bar - Premium UI */}
      {selectedCandidateIds.length > 0 && (
        <Transition
          show={selectedCandidateIds.length > 0}
          enter="transition ease-out duration-300 transform"
          enterFrom="translate-y-10 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transition ease-in duration-200 transform"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="translate-y-10 opacity-0"
        >
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-2xl px-4">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 pl-4">
                <div className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg">
                  <FiCheckSquare className="text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-bold">{selectedCandidateIds.length} {t.candidatesSelected}</span>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">{t.readyForAI}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pr-2">
                <button
                  onClick={() => setSelectedCandidateIds([])}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-2"
                >
                  <FiSquare className="text-sm" />
                  <span>{t.deselect}</span>
                </button>
                <div className="w-px h-6 bg-slate-700/50 mx-1" />
                <button
                  onClick={() => handleMatchingCandidate()}
                  disabled={loadingMatching}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                  {loadingMatching ? <FiLoader className="animate-spin" /> : <FiZap className="text-indigo-200" />}
                  <span>{t.runAnalysis} ({selectedCandidateIds.length})</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      )}

      <br />
      {/* Table */}
      <UseTableTanStackSSR
        columns={columns}
        data={data?.results || []}
        rowClassName={(row) =>
          selectedCandidateIds.includes(row.id)
            ? "bg-indigo-50/50 dark:bg-indigo-900/10 ring-1 ring-inset ring-indigo-500/20"
            : ""
        }
      />

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        className="dark:text-white"
        count={data?.total_matching || 0}
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
                    {t.notification}
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      {t.deleteConfirm}
                    </p>
                  </div>

                  <div className="mt-8 text-end">
                    <button
                      type="button"
                      className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => confirmDeleteFAQ()}
                    >
                      {t.yes}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      {t.no}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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
                    {language === 'VI' ? 'Tạo vị trí mới' : 'Create New Job'}
                  </Dialog.Title>
                  <form
                    className="w-full"
                    onSubmit={handleSubmit(confirmAddFAQ)}
                  >
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5 mt-8">
                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {language === 'VI' ? 'Tên vị trí' : 'Job Name'}
                        </label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          {...register("job_name")}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {language === 'VI' ? 'Mô tả công việc' : 'Job Description'}
                        </label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          {...register("job_description")}
                        />
                      </div>
                    </div>

                    <div className="mt-8 text-end">
                      <button
                        type="submit"
                        className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        {t.yes}
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        {t.no}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Drawer */}
      {isOpenDrawer && candidateDetailQuery.data && (
        <MatchingDetailDrawer
          matching={candidateDetailQuery.data}
          onClose={handleDrawerClose}
        />
      )}

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
                    {language === 'VI' ? 'Cập nhật vị trí' : 'Update Job'}
                  </Dialog.Title>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TableMatching;
