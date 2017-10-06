# Shuang
Shuang | 双拼练习

### 在线演示

[https://api.ihint.me/shuang](https://api.ihint.me/shuang)

### 功能介绍

1. 支持双拼方案切换：自然码、微软双拼、搜狗双拼、小鹤双拼、智能ABC、拼音加加、紫光双拼、大牛双拼、键道3、开源小鹳

2. 支持出题模式切换：随机/顺序，顺序情况参考为新华字典

3. 输入框友好：空格键/回车键下一题或清空输入格，限定输入内容只能为字母和 *;*

4. 按钮功能：输入正确点击下一题，否则点击清空输入格

5. 多平台适配：iPhone/iPad 上使用时请切换至系统自带英文键盘以获得最佳输入体验，竖屏操作以获得最佳友好界面，PC 上使用可获得最佳练习体验

6. 键位图显示：开关设置

7. 无拼音模式：去除多音字/生僻字的全部随机

### 高级扩展功能

添加自定义双拼方案，先下载该项目的所有文件，再按以下步骤编辑 *js/data/schemes.js* ：

1. *list* 加入双拼方案名称

2. *getIdByName* 加入双拼方案在 list 里的索引，及该方案的字母表达

3. *getNameById* 加入上述字母表达

4. *data* 加入该双拼方案的具体内容，其中 *ugmu* 表示声母，*ypmu* 表示韵母，*teuu* 表示以韵母为首字母的拼音组合

*若无 Javascript 编程基础可参考代码中已有的自带方案，或在 issues 中留言

### 其他说明

如果有任何疑问或建议，或发现了错误或BUG，也可与我邮件联系：admin@ihint.me

更多介绍：[https://sspai.com/post/40185](https://sspai.com/post/40185)

### 微信小程序版

可以使用微信扫描下面的二维码，或在微信小程序中搜索 双拼练习 即可添加。

更多介绍：[https://sspai.com/post/40624](https://sspai.com/post/40624)

![qr](https://i.loli.net/2017/08/28/59a3da4f5f49e.jpg)

### 键位图来源

[维基百科 - 双拼](https://zh.wikipedia.org/wiki/%E5%8F%8C%E6%8B%BC)

[百度贴吧](https://tieba.baidu.com/)

邮件
