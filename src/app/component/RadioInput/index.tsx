import React, { useState } from 'react';
import { Button, Input } from 'antd';
import './styles.scss';

type Data = {
  text: string;
  value?: string;
}

export interface IProps {
  data: Data[]
}

const RadioInput = (props: IProps) => {
  const { data } = props;
  const [activeBtn, setActiveBtn] = useState(data[0].value ?? data[0].text);

  return (
    <div className="ww-radio-input-wrapper">
      {
        props.data.map((item) => {
          return (
            <div
              className={`ww-radio-input-btn ${activeBtn === (item.value ?? item.text ) ? 'active' : ''}`}
              onClick={() => {
                setActiveBtn(item.value ?? item.text)
              }}
            >{item.text}</div>
          )
        })
      }

      <Input className="ww-radio-input"/>
    </div>
  );
};

export default RadioInput;