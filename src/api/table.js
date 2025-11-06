import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/api/getPersonTable",
    method: "get",
    params,
  });
}

export function addList(data) {
  return request({
    url: "/api/createPersonTable",
    method: "post",
    data,
  });
}

export function deleteList(params) {
  return request({
    url: "/api/deletePerson",
    method: "get",
    params,
  });
}

export function updateList(data) {
  return request({
    url: "/api/updatePerson",
    method: "post",
    data,
  });
}

export function getPerson(params) {
  return request({
    url: "/api/getPersonById",
    method: "get",
    params,
  });
}

export function chat(data) {
  return request({
    url: "/xunfei/v1/chat/completions",
    method: "post",
    data,
  });
}