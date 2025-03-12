import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Bell, FilePlus2, FileSpreadsheet, Settings } from 'lucide-react';
import { RxAvatar } from 'react-icons/rx';
import { TbFileImport } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/AuthContext.tsx';
import { axiosInstance } from '../utils/axios-instance.ts';
import groupProjectsIntoTimeBins from '../utils/fit-to-bins.util.ts';

export default function HomePage() {
  const navi = useNavigate();
  const { session } = useUserContext();

  const { data: groupedProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/projects/my-projects`);
      const { projects } = data;

      //Map to proper time format and propertyCasing
      const projectsMapped = projects.map(
        ({
          last_updated,
          project_name,
          project_description,
          ...rest
          // deno-lint-ignore no-explicit-any
        }: any) => ({
          lastUpdated: dayjs(last_updated),
          projectName: project_name,
          projectDescription: project_description,
          ...rest,
        })
      );

      // Group by last updated
      // Today, Yesterday, This week, This month, Older
      return groupProjectsIntoTimeBins(projectsMapped);
    },
    enabled: !!session,
  });

  if (!session) {
    navi('/');
    return null;
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='flex justify-between m-6'>
        <div className='flex gap-3 items-center'>
          <RxAvatar size={40} />
          <div>
            <p className='text-sm text-blue-500'>Welcome Back,</p>
            <p className='text-lg font-semibold'>
              {session?.user.user_metadata.username}
            </p>
          </div>
        </div>
        <div className='flex gap-4 items-center'>
          <Bell className='text-gray-600' />
          <Settings className='text-gray-600' />
        </div>
      </div>

      <input
        placeholder='Search documents...'
        className='py-2 px-4 mt-0 mx-6 my-4 border rounded-full'
      />

      <div className='grid grid-cols-2 gap-4 mb-6 px-4 py-12 bg-blue-100'>
        <div
          className='flex flex-col items-center gap-4'
          onClick={() => {
            navi('/project-creation');
          }}
        >
          <div className='flex items-center m-auto p-4 bg-white aspect-[10/16] w-[140px] justify-center'>
            <FilePlus2 size={48} className='text-gray-600' />
          </div>
          <div className='bg-white py-2 px-4 rounded-full'>
            <p>From Template</p>
          </div>
        </div>

        <div className='flex flex-col items-center gap-4'>
          <div className='flex items-center m-auto p-4 bg-white aspect-[10/16] w-[140px] justify-center'>
            <TbFileImport size={48} className='text-gray-600' />
          </div>
          <div className='bg-white py-2 px-4 rounded-full'>
            <p>Import Sheet</p>
          </div>
        </div>
      </div>

      <div className='mx-6'>
        <div className='flex flex-col justify-between my-2'>
          <p className='text-xl font-semibold my-auto'>Recent documents</p>
        </div>

        {Object.entries(groupedProjects ?? {})
          .filter(([_, projects]) => projects.length > 0)
          .map(([date, projects]) => (
            <div key={date} className='mb-6'>
              <h3 className='mb-2 font-semibold'>{date}</h3>
              {projects.map(({ lastUpdated, projectName, id }, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between py-2 px-3 bg-blue-100 rounded-full mb-2'
                  onClick={() => {
                    navi(`/project/${id}`);
                  }}
                >
                  <div className='flex items-center gap-2'>
                    <FileSpreadsheet className='text-gray-600' size={30} />
                    <div className='flex flex-col leading-none'>
                      <p>{projectName}</p>
                      <p className='text-xs text-gray-500'>
                        Last updated {lastUpdated.fromNow()} by you
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
