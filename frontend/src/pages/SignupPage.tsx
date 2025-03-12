import { useMutation } from '@tanstack/react-query';
import { FaChevronLeft } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { Link, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { useUserContext } from '../contexts/AuthContext.tsx';

export type SignupFormData = {
  username: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const [formData, updateFormData] = useImmer<SignupFormData>({
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });
  const { createAccount } = useUserContext();
  const {
    isPending: isCreatingAccount,
    mutateAsync: createAccountAsync,
    error,
  } = useMutation({
    mutationFn: async () => {
      return createAccount(formData);
    },
  });

  const navi = useNavigate();
  const passwordDiff =
    formData.password !== formData.confirmPassword || !formData.password;

  return (
    <main className='h-screen flex flex-col mx-8 my-auto gap-2'>
      <div className='flex justify-between items-center my-8 text-blue-700'>
        <button onClick={() => navi('/login')}>
          <FaChevronLeft />
        </button>
        <p className='font-bold text-2xl'>New Account</p>
        <div />
      </div>

      <div className='flex flex-col gap-2'>
        <p className='font-semibold'>Full Name</p>
        <input
          className='rounded-2xl bg-blue-100 py-2 px-4 text-blue-600'
          value={formData.username}
          onChange={e =>
            updateFormData(draft => {
              draft.username = e.target.value;
            })
          }
        />

        <p className='mt-2 font-semibold'>Email</p>
        <input
          className='rounded-2xl bg-blue-100 py-2 px-4 text-blue-600'
          value={formData.email}
          onChange={e =>
            updateFormData(draft => {
              draft.email = e.target.value;
            })
          }
        />

        <p className='mt-2 font-semibold'>Mobile Number</p>
        <input
          className='rounded-2xl bg-blue-100 py-2 px-4 text-blue-600'
          value={formData.mobileNumber}
          onChange={e =>
            updateFormData(draft => {
              draft.mobileNumber = e.target.value;
            })
          }
        />

        <p className='mt-2 font-semibold'>Password</p>
        <input
          className='rounded-2xl bg-blue-100 py-2 px-4 text-blue-600'
          type='password'
          value={formData.password}
          onChange={e =>
            updateFormData(draft => {
              draft.password = e.target.value;
            })
          }
        />

        <p className='mt-2 font-semibold'>Confirm Password</p>
        <input
          className='rounded-2xl bg-blue-100 py-2 px-4 text-blue-600'
          type='password'
          value={formData.confirmPassword}
          onChange={e =>
            updateFormData(draft => {
              draft.confirmPassword = e.target.value;
            })
          }
        />
        {passwordDiff && (
          <p className='text-red-500'>Passwords are different!</p>
        )}
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <p className='text-center text-sm'>
          By continuing, you agree to <br />
          our <span className='text-blue-700'>Terms of Use</span> and{' '}
          <span className='text-blue-700'>Privacy Policy</span>.
        </p>

        <button
          className={`rounded-full text-white text-lg bg-blue-500 p-2 w-[192px] self-center
            ${passwordDiff ? 'bg-gray-300' : ''}`}
          disabled={passwordDiff}
          onClick={async () => {
            const success = await createAccountAsync();
            if (success) {
              navi('/home');
            }
          }}
        >
          {isCreatingAccount ? (
            <ImSpinner8 className='animate-spin mx-auto' size={28} />
          ) : (
            'Sign up'
          )}
        </button>
        {error && <p className='text-red-500 text-center'>{error.message}</p>}
      </div>

      <div className='flex flex-col gap-2 mt-8'>
        <p className='text-center'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-500'>
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
