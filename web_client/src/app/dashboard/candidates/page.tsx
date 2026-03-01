// Import required modules and components
"use client";
import React, { useEffect } from "react";
import HeadMain from "@/app/components/HeadMain";
import BreadcrumbDashboard from "@/app/dashboard/components/layouts/BreadcrumbDashboard";
import UploadZoneComponent from "@/app/dashboard/components/upload/UploadZoneComponent";
import { useListCandidateData } from "@/app/hooks/react-query/management/file/useFilesUploadData";
import { Skeleton } from "@mui/material";
import dynamic from "next/dynamic";
import { FiUploadCloud, FiUsers, FiSearch } from "react-icons/fi";

// Dynamically import the TableListFile component
const TableListFile = dynamic(() =>
  import("../components/table/TableCandidates").then((mod) => mod.default)
);

// FilesManagementDetail2 component
const CandidatesPage = () => {
  // Fetch file data using the useListFileData hook
  const { data, isLoading, isError, refetch } = useListCandidateData(1, 10);

  return (
    <>
      {/* Set the title and meta description of the page */}
      <HeadMain
        title="Candidates - Management | SmartHire Dashboard"
        description="SmartHire Dashboard"
      />

      {/* Main content of the CV management detail page */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-jakarta mb-1">
              Candidate Repository
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Upload and manage your pool of potential hires.</p>
          </div>
        </div>

        {/* UploadZoneComponent for uploading files */}
        <UploadZoneComponent refetch={refetch} />

        <div className="mt-8 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-indigo-500 rounded-full" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Active Candidates</h2>
          </div>

          <div id="list-candidate">
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  {/* Conditionally render loading state or TableListFile */}
                  {isLoading || isError ? (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={200}
                      className="rounded-2xl"
                    />
                  ) : (
                    <TableListFile data={data} refetch={refetch} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidatesPage;
