import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useAddress, useContract } from '@thirdweb-dev/react';
import { BaseContract, ethers } from 'ethers';
import { SmartContract } from '@thirdweb-dev/sdk';

export type apiContextType = {
  address: string | undefined;
  contract: SmartContract<BaseContract> | undefined;
  balance: string;
  isLoading: boolean;
  swapEthToToken: (amount: any) => Promise<any>;
};

const apiContextDefaultValues: apiContextType = {
  address: '',
  contract: undefined,
  balance: '',
  isLoading: false,
  swapEthToToken: (amount: any) => Promise.resolve(),
};

const ApiContext = createContext<apiContextType>(apiContextDefaultValues);

type Props = {
  children: ReactNode;
};

export const ApiProvider: FC<Props> = ({ children }) => {
  const { contract } = useContract('0x59c472eE8d4Ef483f145280D1Bac31CAcd23AD74');
  const { contract: tokenContract } = useContract('0xcF0E03b0BA2a1B5B96B63a5F69F4C01F8756EC60', 'token');
  const address = useAddress();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>('');

  useEffect(() => {
    if (address) {
      getTokenBalance();
      // getEthBalance();
      // swapEthToToken();
      // swapTokenToEth();
    }
  }, [address]);

  const getTokenBalance = async () => {
    setIsLoading(true);
    const balance = await contract?.call('getBalance', address);
    if (balance) setBalance(ethers.utils.formatEther(balance?.toString()));
    setIsLoading(false);
  };

  const swapEthToToken = async (amount: number) => {
    setIsLoading(true);
    try {
      const result = await contract?.call('swapEthToToken', { value: toWei(amount) });
      const updatedBalance = await contract?.call('getBalance', address);
      setBalance(ethers.utils.formatEther(updatedBalance?.toString()));
      return result;
    } catch (err: any) {
      alert(err.message); // couldn't find a way to parse the error
      return;
    } finally {
      setIsLoading(false);
    }
  };

  // const swapTokenToEth = async () => {
  //   const balance = await contract?.call('swapTokenToEth', toWei(1));
  //   // console.log(ethers.utils.formatUnits(balance, 16));
  // };

  const toWei = (amount: any) => {
    const toWei = ethers.utils.parseUnits(amount.toString());
    return toWei.toString();
  };

  return (
    <ApiContext.Provider
      value={{
        address,
        contract,
        balance,
        isLoading,
        swapEthToToken,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => useContext(ApiContext);
