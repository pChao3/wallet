## a simple web3 utils page.

### 技术栈: wagmi+react+react-router-dom + tailwindcss

2024.6.7 --- 代码规范，添加钱包功能

2024.6.20 --- 修改水龙头合约地址、交互

2024.7.16 -- 新增 NFT-Market 模块 （包含 NFT 铸造, 上架，下架，购买功能）
todo: 优化页面显示 处理 NFT 详情信息✅

2024.7.22 -- NFT-Market 功能完善（铸造, 上架，下架，购买）
todo: 显示NFT的URI及页面美化？✅

2024.7.24 -- show NFT image（抽离tailwindcss,展示NFT image)
上架，购买时每次都进行三次交互？🤔️ （授权、交易、更新状态） todo:优化合约代码？

2024.8.4 -- 样式优化调整，增加背景canvas动画

2024.8.6 -- add button loading status, catch error

2024.8.14 -- 1.新增 $Water 水龙头按钮 （与$Air提供交易对）
             2.新增 “UnoSwap” 去中心化交易模块
#### 新增 webWallet
**todolist:**  
**一.创建账户**  
  1.通过助记词方式创建钱包(使用bip39创建助记词)  
  2.加盐Salt（密码)  
  （直接使用ethers的wallet添加助记词创建钱包对象的话， 没办法添加Salt, 利用ethereumjs-wallet 和 ethereumjs-util 可以进行加盐操作， 参考：[https://learnblockchain.cn/2018/09/28/hdwallet/]）  

###修改新增账户策略###  
改为首次登陆时CryptoJS 保存加密seed种子及账户index 密码保存在上下文 content 里和登陆密码一致  
创建新账户时解密，根据seed种子生成hdWallet,修改路径最后一位为index， index自增。

