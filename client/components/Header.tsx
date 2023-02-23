import { useApiContext } from '../context';
import { ConnectWallet } from '@thirdweb-dev/react';
import Loader from './Loader';

const Header = () => {
  const { address, balance, isLoading } = useApiContext();

  return (
    <div className='fixed top-0 left-0 flex items-center justify-between w-full px-8 py-4'>
      {isLoading && <Loader />}
      <div className='flex items-center'>
        <img src='./logo.png' className='h-12' />
      </div>
      {address && <div className='flex items-center text-white'>VOLFI balance: {balance}</div>}
      <div className='flex'>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
