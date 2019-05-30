# CBUncommonWordStore-Vuex-
基于Vuex/localstorage/客户端生僻字组件封装

先获取vuex中的数据是否存在，
不存在->( web: 获取local数据; app: 获取桥接口中的数据 )
-> 存在 
->保存到vuex中 
-> 不存在 
-> 请求前置接口 
-> ( web: 存储到local； app: 存储到桥接口) 
-> 存储到vuex


基于ifdefine实现web mp app三端兼容
