import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useAddress, useBalance, useContract } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk';

const CONTRACT_ADDRESS = '0xe32cc6678061DBc012055B95d99461A4d84A1353';
const TOKEN_ADDRESS = '0xcF0E03b0BA2a1B5B96B63a5F69F4C01F8756EC60';

export type apiContextType = {
  address: string | undefined;
  volfiBalance: string | undefined;
  ethBalance: string | undefined;
  isLoading: boolean;
  swapEthToToken: (amount: any) => Promise<any>;
  swapTokenToEth: (amount: any) => Promise<any>;
};

const apiContextDefaultValues: apiContextType = {
  address: '',
  volfiBalance: '',
  ethBalance: '',
  isLoading: false,
  swapEthToToken: (amount: any) => Promise.resolve(),
  swapTokenToEth: (amount: any) => Promise.resolve(),
};

const ApiContext = createContext<apiContextType>(apiContextDefaultValues);

type Props = {
  children: ReactNode;
};

export const ApiProvider: FC<Props> = ({ children }) => {
  const { data: nativeBalance } = useBalance(NATIVE_TOKEN_ADDRESS);
  const { data: volBalance } = useBalance(TOKEN_ADDRESS);
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { contract: tokenContract } = useContract(TOKEN_ADDRESS, 'token');
  const address = useAddress();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address && contract) {
      // swapTokenToEth(100);
    }
  }, [address, contract]);

  // const getTokenBalance = async () => {
  //   setIsLoading(true);
  //   const balance = await contract?.call('getBalance', address);
  //   if (balance) setBalance(ethers.utils.formatEther(balance?.toString()));
  //   setIsLoading(false);
  // };

  const swapEthToToken = async (amount: number) => {
    setIsLoading(true);
    try {
      const result = await contract?.call('swapEthToToken', { value: toWei(amount) });
      return result;
    } catch (err: any) {
      alert(err.message); // couldn't find a way to parse the error
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const swapTokenToEth = async (amount: number) => {
    setIsLoading(true);
    try {
      tokenContract?.setAllowance(CONTRACT_ADDRESS, toWei(amount));
      const result = await contract?.call('swapTokenToEth', toWei(amount));
      return result;
    } catch (err: any) {
      alert(err.message); // couldn't find a way to parse the error
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const toWei = (amount: any) => {
    const toWei = ethers.utils.parseUnits(amount.toString());
    return toWei.toString();
  };

  const volfiBalance = volBalance?.displayValue;
  const ethBalance = nativeBalance?.displayValue;

  return (
    <ApiContext.Provider
      value={{
        address,
        volfiBalance,
        ethBalance,
        isLoading,
        swapEthToToken,
        swapTokenToEth,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => useContext(ApiContext);
