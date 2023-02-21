import React, { FC } from 'react';

interface IProps {
  title: string;
  styles: string;
  handleClick?: () => void;
}

const CustomButton: FC<IProps> = ({ title, handleClick, styles }) => {
  return (
    <button
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
