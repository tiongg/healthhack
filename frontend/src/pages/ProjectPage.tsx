import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axios-instance.ts';
import { downloadFile } from '../utils/download-file.util.ts';

export default function ProjectPage() {
  const navi = useNavigate();
  const { pathname } = useLocation();
  const projectId = pathname.split('/').pop();

  const { data: projectDetails, isFetching } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/projects/${projectId}`);
      return res.data;
    },
  });

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!projectDetails) {
    return <div>Project not found</div>;
  }

  const {
    id,
    project_name: projectName,
    project_description: projectDescription,
    created_at: createdAt,
    last_updated: lastUpdated,
    downloadUrl,
  } = projectDetails;

  return (
    <main className="min-h-screen flex flex-col mx-8 my-auto gap-2">
      <div className="flex justify-between items-center my-8 text-blue-700">
        <button className="flex-1" onClick={() => navi('/home')}>
          <FaChevronLeft />
        </button>
        <p className="font-bold text-2xl m-auto">Details</p>
        <div className="flex-1" />
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <p className="text-gray-700 font-medium">Project Name:</p>
          <p>{projectName}</p>
        </div>

        <div>
          <p className="text-gray-700 font-medium">Description:</p>
          <p>{projectDescription || 'No description provided'}</p>
        </div>

        <div>
          <p className="text-gray-700 font-medium">Created on:</p>
          <p>{dayjs(createdAt).format('DD MMM YYYY')}</p>
        </div>

        <div>
          <p className="text-gray-700 font-medium">Last updated:</p>
          <p>{dayjs(lastUpdated).fromNow()}</p>
        </div>

        <button
          className="bg-blue-500 rounded-full text-white py-2 px-4 flex flex-row gap-2"
          onClick={() => {
            downloadFile(downloadUrl, `${projectName}.xlsx`);
          }}
        >
          <HiDownload className="my-auto" />
          <p className="font-semibold">Download Spreadsheet</p>
        </button>
      </div>

      <Link
        to={`/project/${id}/insert-data`}
        className="bg-blue-500 text-white rounded-full py-2 px-4 flex flex-row gap-2 justify-between"
      >
        <p>Insert Data</p>
        <FaChevronRight className="my-auto" />
      </Link>
    </main>
  );
}
