import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <main className='h-screen flex flex-col justify-center'>
      <img src='/logo.svg' className='h-[256px] m-auto' />

      <div className='flex flex-col items-center mb-32 w-[256px] m-auto'>
        <Link
          to='/login'
          className='bg-blue-500 text-center text-white py-2 px-4 rounded-full w-full'
        >
          Log in
        </Link>

        <Link
          to='/signup'
          className='mt-4 bg-blue-200 text-center text-blue-500 py-2 px-4 rounded-full w-full'
        >
          Sign up
        </Link>
      </div>
    </main>
  );
}
