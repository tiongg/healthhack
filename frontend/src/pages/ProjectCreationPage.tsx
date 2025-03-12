import { useMutation } from '@tanstack/react-query';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { axiosInstance } from '../utils/axios-instance.ts';

export default function ProjectCreationPage() {
  const navi = useNavigate();
  const [formData, updateFormData] = useImmer({
    title: '',
    description: '',
  });
  const {
    mutateAsync: createProject,
    isPending: isCreatingProject,
    error,
  } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.post('/projects', {
        title: formData.title,
        description: formData.description,
      });
    },
  });

  return (
    <main className='min-h-screen flex flex-col mx-8 my-auto gap-2'>
      <div className='flex justify-between items-center my-8 text-blue-700'>
        <button className='flex-1' onClick={() => navi('/home')}>
          <FaChevronLeft />
        </button>
        <p className='font-bold text-2xl'>New Project</p>
        <div className='flex-1' />
      </div>

      <div className='flex flex-col gap-2'>
        <div>
          <label className='block text-gray-700 font-medium'>
            Project Title
          </label>
          <input
            type='text'
            placeholder='Enter document title'
            className='w-full p-2 border border-gray-300 rounded-lg'
            onChange={e =>
              updateFormData(draft => {
                draft.title = e.target.value;
              })
            }
          />
        </div>

        <div>
          <label className='block text-gray-700 font-medium'>Description</label>
          <textarea
            placeholder='Add a short description...'
            className='w-full p-2 border border-gray-300 rounded-lg h-28'
            onChange={e =>
              updateFormData(draft => {
                draft.description = e.target.value;
              })
            }
          />
        </div>

        <button
          className={`px-4 py-2 text-white rounded-full self-center ${formData.title === '' ? 'bg-gray-300' : 'bg-blue-500'}`}
          disabled={formData.title === ''}
          onClick={async () => {
            const res = await createProject();
            if (res.data.success) {
              navi(`/project/${res.data.project.id}`);
            }
          }}
        >
          Create project
        </button>
      </div>
    </main>
  );
}
