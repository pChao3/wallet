import React, { createContext, useContext, useState } from 'react';

// 创建 PasswordContext
const PasswordContext = createContext();

// 创建 Provider 组件
export const PasswordProvider = ({ children }) => {
  const [password, setPassword] = useState('');

  return (
    <PasswordContext.Provider value={{ password, setPassword }}>
      {children}
    </PasswordContext.Provider>
  );
};

// 创建自定义 hook 来访问密码
export const usePassword = () => useContext(PasswordContext);
