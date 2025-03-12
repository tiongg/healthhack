import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import Modal from '../components/Modal.tsx';
import VoiceMemoRecorder from '../components/VoiceMemoRecorder.tsx';
import {
  getVisitLabel,
  VISIT_OPTIONS,
  VisitType,
} from '../constants/visits.type.ts';
import { axiosInstance } from '../utils/axios-instance.ts';

type InputFormData = {
  patientId: string;
  visit: VisitType;
  transcription: string;
};

export default function ProjectInputDataPage() {
  const { pathname } = useLocation();
  const navi = useNavigate();
  const projectId = pathname.split('/')[2];
  const [formData, updateFormData] = useImmer<InputFormData>({
    patientId: '',
    visit: 'first',
    transcription: '',
  });

  const {
    mutateAsync: getDataMappingsAsync,
    data: dataMappings,
    isPending: isDataMappingsPending,
  } = useMutation({
    mutationFn: () => {
      return axiosInstance.post('/excel/validate', {
        visit: formData.visit,
        prompt: formData.transcription,
      });
    },
  });
  const [isModalOpen, setModalOpen] = useState(false);

  const canTranscribe = formData.patientId && formData.transcription;

  return (
    <main className='min-h-screen flex flex-col mx-8 my-auto gap-2'>
      <div className='flex justify-between items-center my-8 text-blue-700'>
        <button className='flex-1' onClick={() => navi('/home')}>
          <FaChevronLeft />
        </button>
        <p className='font-bold text-2xl m-auto'>Input</p>
        <div className='flex-1' />
      </div>

      <div className='flex flex-col gap-4'>
        <div>
          <p>Patient ID</p>
          <input
            type='text'
            className='border border-gray-300 rounded-md w-full p-2'
            value={formData.patientId}
            onChange={e =>
              updateFormData(draft => {
                draft.patientId = e.target.value;
              })
            }
          />
        </div>

        <div>
          <p>Visit</p>
          <select
            className='border border-gray-300 rounded-md w-full p-2'
            value={formData.visit}
            onChange={e =>
              updateFormData(draft => {
                draft.visit = e.target.value as VisitType;
              })
            }
          >
            {VISIT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <VoiceMemoRecorder
            onRecordedText={transcription =>
              updateFormData(draft => {
                draft.transcription = transcription;
              })
            }
          />

          <p>Transcribed words:</p>
          <textarea
            className='border border-gray-300 rounded-md w-full p-2'
            rows={6}
            onChange={e => {
              updateFormData(draft => {
                draft.transcription = e.target.value;
              });
            }}
            value={formData.transcription}
          />
        </div>
      </div>

      <button
        className={`
         text-white rounded-full py-2 px-4 
          ${canTranscribe ? 'bg-blue-500' : 'bg-gray-300'}
        `}
        disabled={!canTranscribe}
        onClick={async () => {
          await getDataMappingsAsync();
          setModalOpen(true);
        }}
      >
        {isDataMappingsPending ? 'Loading...' : 'Transcribe'}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClosed={() => setModalOpen(false)}
        className='bg-white p-4 w-[375px] h-[70%] rounded-md'
      >
        <div className='flex flex-col gap-4 h-full'>
          <div className='self-center p-2'>
            <p className='text-blue-500 text-2xl font-bold'>
              Transcription complete!
            </p>
          </div>

          <div>
            <p className='text-2xl font-bold'>
              Patient ID: {formData.patientId}
            </p>
            <p className='text-xl font-bold'>
              Visit: {getVisitLabel(formData.visit)}
            </p>
            {Object.entries(dataMappings?.data ?? {}).map(([key, value]) => (
              <div key={key} className='flex gap-2'>
                <p className='font-semibold'>{key}:</p>
                <p>{value as any}</p>
              </div>
            ))}
          </div>

          <div className='flex gap-4 mt-auto'>
            <button
              className='rounded-full bg-red-500 text-white py-2 px-4 flex-1'
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Retranscribe
            </button>
            <button
              className='rounded-full bg-blue-500 text-white py-2 px-4 flex-1'
              onClick={async () => {
                const { data: res } = await axiosInstance.post(
                  '/excel/generate',
                  {
                    visit: formData.visit,
                    patientId: formData.patientId,
                    wsData: dataMappings?.data,
                    projectId,
                  }
                );

                if (res.success) {
                  navi(`/project/${projectId}`);
                }
              }}
            >
              Looks good!
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
