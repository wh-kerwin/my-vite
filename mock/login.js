const users = [
  { name: "admin", password: "123456", token: "admin", info: {
    name: "系统管理员"
  }},
  { name: "editor", password: "123456", token: "editor", info: {
    name: "编辑人员"
  }},
  { name: "kerwin", password: "123456", token: "kerwin", info: {
    name: "测试人员"
  }},
];
const mock = [
  {
    url: "/api/login",
    method: "get",
    response: ({query})=> {
      const user = users.find(user => {
        return query.username === user.name && query.password === user.password;
      });
      if (!user) {
        return {
          code: 400,
          message: "用户名或密码错误",
          data: null
        };
      }
      return {
        code: 200,
        message: "success",
        data: {
          name: user.name,
          age: "18",
          id: "No1",
          token: user.token
        }
      };
    }
  },
];

export default mock;