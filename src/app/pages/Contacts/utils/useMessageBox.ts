import { message } from "antd";

type MessageBoxHookResult = [| ((successMessage: string) => void),((errorMessage: string) => void),((infoMessage: string) => void),  React.ReactElement<any, string | React.JSXElementConstructor<any>>]

export const useMessageBox = () : MessageBoxHookResult  =>  {
  const [messageApi, contextHolder] = message.useMessage();

  const successMessageBox = (successMessage: string) => {
    messageApi.open({
      type: 'success',
      content: successMessage,
    });
  };

  const errorMessageBox = (errorMessage: string) => {
    messageApi.open({
      type: 'error',
      content: errorMessage,
    });
  };

  const infoMessageBox = (infoMessage: string) => {
    messageApi.open({
      type:'info',
      content: infoMessage
    })
  }

  return [successMessageBox, errorMessageBox, infoMessageBox, contextHolder];
}