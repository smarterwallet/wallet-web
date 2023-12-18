import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';



const NotFoundPage = () => {
  const navigate = useNavigate();

  const backHome = () => {
    navigate('/');
  }

  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={backHome}>Back Home</Button>}
      />
    </div>
  );
};

export default NotFoundPage;