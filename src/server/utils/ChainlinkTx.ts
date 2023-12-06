

export const crossChainAbstractionDemand = async (demand: string) => {
  let raw: unknown = {
    category: 'crossChainAbstraction',
    demand: demand,
  };

  let requestOptions: unknown = {
    method: 'POST',
    body: JSON.stringify(raw),
    redirect: 'follow',
  };

  const response = await fetch('https://smarter-api-da.web3idea.xyz/v1/demand', requestOptions);
  if (!response.ok) {
    throw new Error(`Request failed with status: ${response.status}`);
  }

  // 使用json()方法来解析响应体
  const responseData = await response.json();
  return responseData;
};
