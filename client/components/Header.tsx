import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useApiContext } from '../context';
import CustomButton from './CustomButton';

const Header = () => {
  const { connect, address, disconnect } = useApiContext();
  const notifyConnectWallet = () => toast.error('Connect wallet.', { duration: 4000 });

  useEffect(() => {
    if (!address) notifyConnectWallet();
  }, [address]);

  return (
    <div className='fixed top-0 left-0 flex items-center justify-between w-full px-8 py-4'>
      <div className='flex items-center'>
        <img src='./logo.png' className='h-12' />
      </div>
      <div className='flex'>
        <CustomButton
          title={address ? 'Disconnect' : 'Connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={() => {
            if (address) disconnect();
            else connect();
          }}
        />
      </div>

      <Toaster />
    </div>
  );
};

export default Header;
