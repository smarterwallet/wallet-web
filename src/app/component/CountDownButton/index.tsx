import React, { useEffect, useState } from 'react';
import { Button, ButtonProps } from 'antd';

interface IProps extends ButtonProps {
  storageKey: string;
  valid?: () => boolean;
}

const CountDownButton = (props: IProps) => {

  const { storageKey, onClick, valid,children: btnText, ...rest } = props;

  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    setCount(60);
    setDisabled(true);
    localStorage.setItem(storageKey, '60');
  };

  useEffect(() => {
    const countdown = localStorage.getItem(storageKey);
    setCount(countdown ? parseInt(countdown) : 0);
    if (count > 0) {
      setDisabled(true);
    }
  }, []);

  useEffect(() => {
    if (count === 0) {
      return;
    }
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
      localStorage.setItem(storageKey, String(count - 1));
      if (count === 1) {
        clearInterval(timer);
        setDisabled(false);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [count]);

  return (
    <Button
      {...rest}
      onClick={(e) => {
        if (valid) {
          const result = valid();
          if (!result) {
            return;
          }
        }
        handleClick();
        onClick?.(e);
      }}
      disabled={disabled}
    >{btnText}{disabled ? `(${count} S)` : ''}</Button>
  );
};

export default CountDownButton;