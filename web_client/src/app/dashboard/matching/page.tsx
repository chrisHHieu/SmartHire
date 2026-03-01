import React from "react";
import HeadMain from "@/app/components/HeadMain"; // Import the HeadMain component
import BreadcrumbDashboard from "../components/layouts/BreadcrumbDashboard"; // Import the BreadcrumbDashboard component
import TableMatching from "../components/table/TableMatching"; // Import the TableMatching component

type Props = {};

const Matching = (props: Props) => {
  return (
    <>
      {/* Set the title and meta description of the page */}
      <HeadMain
        title="Kết nối ứng viên - Quản lý | Bảng điều khiển - Jobfit"
        description="Bảng điều khiển - Jobfit"
      />

      {/* Main content of the FAQ page */}
      <div className="px-4 pt-6">
        {/* List of FAQs */}
        <div id="list-faq">
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                {/* Render the FAQ table */}
                <TableMatching />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Matching;
