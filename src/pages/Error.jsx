import { useRouteError } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import Footer from '../components/Footer';


function ErrorPage() {
  const error = useRouteError();

  let title = 'An error occurred!';
  let message = 'Something went wrong!';

  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 404) {
    title = 'Not found!';
    message = 'Could not find resource or page.';
  }

  return (
    <>
      <MainNavigation />
      <div className='flex flex-col items-center h-[20rem] w-full justify-center'>
        <img src="/404error.gif" alt=""  className='w-[16rem]'/>
        <h1 className='poppins-bold text-xl text-red-500'>No Resource Found</h1>
        <p className='poppins-regular text-gray-400 text-sm'>you are in the wrong place</p>
      </div>
      <div className='h-[8rem]'>
    
      </div>
      <Footer/>
    </>
  );
}

export default ErrorPage;
