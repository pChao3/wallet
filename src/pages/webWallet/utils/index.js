export const apiUrl = 'https://api-sepolia.etherscan.io/api';
export const api_key = 'CCABDVGYXV5GT1RHWH9IKR2XF18Z5GV3A7';

export const getAbiFromAddress = async contractAddress => {
  const res = await fetch(
    `${apiUrl}/?module=contract&action=getabi&address=${contractAddress}&apikey=${api_key}`
  ).then(res => res.json());
  return res;
};
