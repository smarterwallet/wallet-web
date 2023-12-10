import { message } from "antd";

interface MessageItemProps {
  content: string;
  displayButton: boolean;
  isResponse: boolean;
  handleConfirmTx: () => void
}

const MessageItem: React.FC<MessageItemProps> = ({ content, displayButton, isResponse, handleConfirmTx }) => {

  return (
    <div>
      {isResponse ? (
        <div className="flex flex-col mb-3">
          <div className="flex-1 w-[90%]">
            <div className="inline-block rounded-lg">
              <div
                className={`w-full bg-[#13b6ea4d] whitespace-normal m-0 p-2 text-lg ${
                  displayButton ? 'rounded-t-lg' : 'rounded-lg'
                }`}
              >
                {content}
              </div>
              {displayButton && (
                <div className="w-auto flex m-0">
                  <button className="flex-1 bg-white rounded-none rounded-bl-lg border-r-2 border-black">Change</button>
                  <button className="flex-1 bg-white rounded-none rounded-br-lg border-l-2 border-black" onClick={handleConfirmTx}>
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 w-[10%]"></div>
        </div>
      ) : (
        <div className="flex flex-col mb-3 ml-2">          
          <div className="flex-1">
            <div className="flex justify-end">
              <div className="inline-block bg-white p-2 whitespace-normal rounded-lg text-[#053346] text-lg">{content}</div>
            </div>
          </div>
        </div>
      )}{' '}
    </div>
  );
};

export default MessageItem;
