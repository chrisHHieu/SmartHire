import React from "react";
import HeadMain from "@/app/components/HeadMain"; // Import the HeadMain component
import BreadcrumbDashboard from "../components/layouts/BreadcrumbDashboard"; // Import the BreadcrumbDashboard component
import TableJobs from "../components/table/TableJobs"; // Import the TableFAQ component

type Props = {};

const Jobs = (props: Props) => {
  return (
    <>
      {/* Set the title and meta description of the page */}
      <HeadMain
        title="Việc Làm - Quản Lý | Bảng Điều Khiển - Jobfit"
        description="Bảng Điều Khiển - Jobfit"
      />

      {/* Main content of the FAQ page */}
      <div className="px-4">
        <div id="list-faq">
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <TableJobs />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
