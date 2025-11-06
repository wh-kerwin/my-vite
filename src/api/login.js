import request from "@/utils/request";

// export function login(params) {
//   return request({
//     url: "/api/login?_=" + new Date().getTime(),
//     method: "get",
//     params,
//   });
// }

export function login(data) {
  return request({
    url: "/api/login",
    method: "post",
    data,
  });
}