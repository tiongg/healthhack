import { useMutation } from '@tanstack/react-query';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { Link, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { useUserContext } from '../contexts/AuthContext.tsx';

export type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  //TODO: React hook forms
  const [formData, updateFormData] = useImmer<LoginFormData>({
    email: '',
    password: '',
  });
  const { login } = useUserContext();
  const {
    isPending: isLoggingIn,
    mutateAsync: loginAsync,
    error,
  } = useMutation({
    mutationFn: () => {
      return login(formData);
    },
  });

  const navi = useNavigate();

  return (
    <main className='h-screen flex flex-col mx-8 my-auto gap-2'>
      <img src='/logo.svg' className='h-[96px] mt-8' />
      <p className='font-bold my-8 text-blue-600 text-3xl py-8'>Welcome back</p>
      <p className='font-semibold'>Email</p>
      <input
        className='rounded-2xl bg-blue-100 py-2 px-4 text-blue-600'
        value={formData.email}
        onChange={e =>
          updateFormData(draft => {
            draft.email = e.target.value;
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

      {/* This doesnt do anything lmao */}
      <p className='self-end text-blue-700'>Forgot password?</p>

      <button
        className='rounded-full text-white text-lg bg-blue-500 p-2 w-[192px] self-center mt-8 flex justify-center'
        onClick={async () => {
          const success = await loginAsync();
          if (success) {
            navi('/home');
          }
        }}
      >
        {isLoggingIn ? (
          <ImSpinner8 className='animate-spin' size={28} />
        ) : (
          'Log in'
        )}
      </button>
      {error && (
        <p className='text-red-500 text-center mt-2'>{error.message}</p>
      )}

      <p className='mx-auto'>or</p>
      <div className='flex gap-4 mx-auto'>
        <div className='bg-blue-500 text-white p-2 rounded-full'>
          <FaGoogle />
        </div>
        <div className='bg-blue-500 text-white p-2 rounded-full'>
          <FaFacebookF />
        </div>
      </div>

      <p className='mx-auto my-8'>
        Don't have an account?{' '}
        <Link to='/signup' className='text-blue-500'>
          Sign Up
        </Link>
      </p>
    </main>
  );
}
