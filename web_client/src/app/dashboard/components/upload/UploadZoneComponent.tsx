"use client";
import React, { ChangeEvent, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import Image from "next/image";
import { Button, Typography } from "@mui/material";
import { useUploadFileData } from "@/app/hooks/react-query/management/file/useFilesUploadData";
import { toast } from "react-toastify";
import { MdOutlineCloudUpload, MdClear } from "react-icons/md";
import { FiUploadCloud, FiFileText } from "react-icons/fi";

type Props = {
  refetch: () => void;
};

const UploadZoneComponent = (props: Props) => {
  const [file, setFile] = useState<File[] | []>([]);
  const [errorContent, setErrorContent] = useState<string | null>(null);
  const [isUpload, setIsUpload] = useState<boolean>(false);

  const {
    mutate: uploadFile,
    isError,
    error,
    isSuccess,
    data,
    isLoading,
  } = useUploadFileData(file);

  // Submit upload
  const handleSubmitUpload = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!file) {
      return;
    }
    setIsUpload(true);
    await uploadFile(
      {
        file_upload: file,
      },
      {
        onError: (error: any) => {
          console.log("Upload error:", error.response.status);
          if (error.response.status === 409) {
            setErrorContent("File is duplicate");
            toast.warning("File is duplicate");
          } else {
            setErrorContent("Upload file failed");
            toast.error("Upload file failed");
          }
          setIsUpload(false);
        },
        onSuccess: async () => {
          await setFile([]);
          props.refetch();
          toast.success("Upload file success");
          setIsUpload(false);
        },
      }
    );
  };

  const handleChangeUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    const newFile = [...file];

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        newFile.push(selectedFiles[i]);
      }

      setFile(newFile);
    }
  };

  const clearFile = () => {
    setFile([]);
  };

  return (
    <>

      <div id="upload-zone" className="w-full">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-1">
            <form onSubmit={handleSubmitUpload}>
              {isUpload ? (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900/50 border-t-indigo-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FiUploadCloud className="text-indigo-600 text-xl" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">Uploading Files...</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Please wait while we process your documents.</p>
                </div>
              ) : (
                <div className="relative group">
                  <input
                    accept="*"
                    type="file"
                    className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
                    onChange={handleChangeUploadFile}
                    id="file-input"
                    multiple
                  />

                  <div className={`
                    flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-xl transition-all
                    ${file.length > 0 ? 'border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:border-indigo-300 dark:group-hover:border-indigo-500'}
                  `}>
                    {file.length !== 0 ? (
                      <div className="flex flex-wrap justify-center gap-4 w-full px-8">
                        {file.map((f, idx) => (
                          <div key={idx} className="flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm min-w-[120px]">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-2">
                              <FiFileText className="text-lg" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate w-24">
                              {f.name}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">
                              {(f.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 group-hover:scale-110 transition-all shadow-sm">
                          <FiUploadCloud className="text-2xl" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                          Click or drag files to upload
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Support for PDF and DOCX formats up to 10MB each.
                        </p>
                      </div>
                    )}

                    {errorContent && (
                      <div className="mt-4 px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full border border-rose-100">
                        {errorContent}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {file.length > 0 && !isUpload && (
                <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                      {file.length} Files Ready
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="px-4 py-2 text-[10px] font-bold text-slate-500 hover:text-rose-600 uppercase tracking-widest transition-colors flex items-center gap-1.5"
                      type="button"
                      onClick={clearFile}
                    >
                      <MdClear className="text-sm" />
                      Discard
                    </button>
                    <button
                      className="btn btn-primary px-8 py-2.5 text-xs font-black shadow-indigo-200/50"
                      type="submit"
                    >
                      <MdOutlineCloudUpload className="text-lg" />
                      Process Files
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadZoneComponent;
