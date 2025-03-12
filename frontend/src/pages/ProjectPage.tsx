import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FaChevronLeft } from 'react-icons/fa';
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
    <main className='min-h-screen flex flex-col mx-8 my-auto gap-2'>
      <div className='flex justify-between items-center my-8 text-blue-700'>
        <button className='flex-1' onClick={() => navi('/home')}>
          <FaChevronLeft />
        </button>
        <p className='font-bold text-2xl m-auto'>Details</p>
        <div className='flex-1' />
      </div>

      <div>
        <p className='text-gray-700 font-medium'>Project Name:</p>
        <p>{projectName}</p>

        <p className='text-gray-700 font-medium'>Description:</p>
        <p>{projectDescription || 'No description provided'}</p>

        <p className='text-gray-700 font-medium'>Created on:</p>
        <p>{dayjs(createdAt).format('DD MMM YYYY')}</p>

        <p className='text-gray-700 font-medium'>Last updated:</p>
        <p>{dayjs(lastUpdated).fromNow()}</p>

        <button
          className='bg-blue-500 text-white rounded-full py-2 px-4'
          onClick={() => {
            downloadFile(downloadUrl, `${projectName}.xlsx`);
          }}
        >
          Download Spreadsheet
        </button>
      </div>

      <Link
        to={`/project/${id}/insert-data`}
        className='bg-blue-500 text-white rounded-full py-2 px-4'
      >
        Insert Data
      </Link>
    </main>
  );
}
