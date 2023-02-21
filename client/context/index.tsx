import { createContext, FC, ReactNode, useContext } from 'react';
import { useAddress, useContract, useMetamask, useDisconnect } from '@thirdweb-dev/react';
import { BaseContract, ethers } from 'ethers';
import { SmartContract } from '@thirdweb-dev/sdk';

export type apiContextType = {
  address: string | undefined;
  contract: SmartContract<BaseContract> | undefined;
  connect: () => void;
  disconnect: () => void;
};

const apiContextDefaultValues: apiContextType = {
  address: '',
  contract: undefined,
  connect: () => {},
  disconnect: () => {},
};

const ApiContext = createContext<apiContextType>(apiContextDefaultValues);

type Props = {
  children: ReactNode;
};

export const ApiProvider: FC<Props> = ({ children }) => {
  const { contract } = useContract('0x02eD843b07BC59B5166bB12a2d83ec98AD37dfD5');
  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();

  return (
    <ApiContext.Provider
      value={{
        address,
        contract,
        connect,
        disconnect,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => useContext(ApiContext);
