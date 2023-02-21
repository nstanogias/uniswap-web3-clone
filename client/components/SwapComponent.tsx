import React, { useEffect, useState, useRef } from 'react';

import { ArrowSmDownIcon } from '@heroicons/react/outline';
import toast, { Toaster } from 'react-hot-toast';
import { toEth, toWei } from '../utils/ether-utils';
import { useApiContext } from '../context';

const ENTER_AMOUNT = 'Enter an amount';
const CONNECT_WALLET = 'Connect wallet';
const SWAP = 'Swap';
const ETH = 'ETH';

const SwapComponent = () => {
  const { address } = useApiContext();
  const [srcToken, setSrcToken] = useState<string>(ETH);
  const [destToken, setDestToken] = useState<string>('VolTok');

  const [inputValue, setInputValue] = useState<string>();
  const [outputValue, setOutputValue] = useState<string>();

  const isReversed = useRef<boolean>(false);
  const [swapBtnText, setSwapBtnText] = useState(ENTER_AMOUNT);

  const notifyError = (msg: string) => toast.error(msg, { duration: 6000 });
  const notifySuccess = () => toast.success('Transaction completed.');

  useEffect(() => {
    // Handle the text of the submit button
    if (!address) setSwapBtnText(CONNECT_WALLET);
    else if (!inputValue || !outputValue) setSwapBtnText(ENTER_AMOUNT);
    else setSwapBtnText(SWAP);
  }, [inputValue, outputValue, address]);

  useEffect(() => {
    populateOutputValue();
    if (inputValue?.length === 0) setOutputValue('');
  }, [inputValue]);

  useEffect(() => {
    populateInputValue();
    if (outputValue?.length === 0) setInputValue('');
    // Reset the isReversed value if its set
    if (isReversed.current) isReversed.current = false;
  }, [outputValue]);

  const getSwapBtnClassName = () => {
    let className = 'w-full p-4 my-2 rounded-xl';
    className +=
      swapBtnText === ENTER_AMOUNT || swapBtnText === CONNECT_WALLET
        ? ' text-zinc-400 bg-zinc-800 pointer-events-none'
        : ' bg-blue-700';
    return className;
  };

  const handleReverseExchange = (e: any) => {
    // Setting the isReversed value to prevent the input/output values
    // being calculated in their respective side - effects
    isReversed.current = true;

    // 1. Swap tokens (srcToken <-> destToken)
    // 2. Swap values (inputValue <-> outputValue)

    setInputValue(outputValue);
    setOutputValue(inputValue);

    setSrcToken(destToken);
    setDestToken(srcToken);
  };

  const populateOutputValue = () => {
    if (!inputValue) return;

    try {
      if (srcToken !== ETH && destToken !== ETH) setOutputValue(inputValue);
      else if (srcToken === ETH && destToken !== ETH) {
        const outValue = toEth(toWei(inputValue), 14);
        setOutputValue(outValue);
      } else if (srcToken !== ETH && destToken === ETH) {
        const outValue = toEth(toWei(inputValue, 14));
        setOutputValue(outValue);
      }
    } catch (error) {
      setOutputValue('0');
    }
  };

  const populateInputValue = () => {
    if (!outputValue) return;

    try {
      if (srcToken !== ETH && destToken !== ETH) setInputValue(outputValue);
      else if (srcToken === ETH && destToken !== ETH) {
        const outValue = toEth(toWei(outputValue, 14));
        setInputValue(outValue);
      } else if (srcToken !== ETH && destToken === ETH) {
        const outValue = toEth(toWei(outputValue), 14);
        setInputValue(outValue);
      }
    } catch (error) {
      setInputValue('0');
    }
  };

  return (
    <div className='bg-zinc-900 w-[35%] p-4 px-6 rounded-xl'>
      <div className='relative bg-[#212429] p-4 py-6 rounded-xl mb-2 border-[2px] border-transparent hover:border-zinc-600'>
        <div className='flex items-center rounded-xl'>
          <input
            type={'text'}
            className='w-full h-8 px-2 text-3xl text-white bg-transparent outline-none appearance-none'
            value={inputValue}
            placeholder={'0.0'}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />

          <p className='text-white'>{srcToken}</p>
        </div>

        <ArrowSmDownIcon
          className='absolute left-1/2 -translate-x-1/2 -bottom-6 h-10 p-1 bg-[#212429] border-4 border-zinc-900 text-zinc-300 rounded-xl cursor-pointer hover:scale-110'
          onClick={handleReverseExchange}
        />
      </div>

      <div className='bg-[#212429] p-4 py-6 rounded-xl mt-2 border-[2px] border-transparent hover:border-zinc-600'>
        <div className='flex items-center rounded-xl'>
          <input
            className='w-full h-8 px-2 text-3xl text-white bg-transparent outline-none appearance-none'
            value={outputValue}
            placeholder={'0.0'}
            onChange={(e) => {
              setOutputValue(e.target.value);
            }}
          />

          <p className='text-white'>{destToken}</p>
        </div>
      </div>

      <button
        className={getSwapBtnClassName()}
        onClick={() => {
          // if (swapBtnText === SWAP) handleSwap();
        }}
      >
        {swapBtnText}
      </button>
      <Toaster />
    </div>
  );
};

export default SwapComponent;
