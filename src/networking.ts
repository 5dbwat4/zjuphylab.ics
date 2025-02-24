import { getTimestamp } from "./util/zjuphylab-timestamp";

const md5 = require("js-md5");

const APPKEY = "eb8c68399de7483abb2d8abaea0d039f";
const dumpedKey = "7cd476ab866b49d7a9788ad9f4789495";

const host = "http://10.203.16.55:8098/lab-course";

let Authorization = "";

const toData = (path: string, data?: object): string => {
  const timestamp = getTimestamp();

  return new URLSearchParams(
    Object.entries({
      app_key: APPKEY,
      timestamp,
      sign: md5(
        dumpedKey +
          path +
          Object.entries(data || {})
            .sort((a, b) => (b[0] < a[0] ? 1 : -1))
            .map((v) => v.join(""))
            .join("") +
          timestamp +
          " " +
          dumpedKey
      ),
      ...data,
    })
  ).toString();
};
async function login(username: string, password: string) {
  const path = "/api/login";
  return await fetch(host + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: toData(path, {
      username,
      password,
    }),
  })
    .then((v) => v.json())
    .then((res) => {
      // console.log(res);
      if (res.code !== 200) {
        console.log("Login failed. Code=", res.code, " Message=", res.message);
        return false;
      }
      if (!res.data?.token) {
        console.log("Login failed. Message=", res.message);
        return false;
      }
      // console.log(JSON.stringify(res.data));
      
      Authorization =
        res.data.token.token_type + " " + res.data.token.access_token;
      console.log("Login success. User:", res.data.name);
      return true;
    });
}

function GET(path, data = {}) {
  return fetch(host + path + "?" + toData(path, data), {
    headers: {
      Authorization,
    },
  })
    .then((e) => {
      // console.log("Fetch ", path, " status ", e.status);
      return e.json();
    })
    // .then((v) => {
    //   // console.log(v);
    //   return v;
    // });
}

function POST(path: string, data = {}) {
  return fetch(host + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization,
    },
    body: toData(path, data),
  })
    .then((e) => e.json())
    .then((v) => {
      // console.log("Response ", v);
      return v;
    })
    .catch((e) => {
      console.log("Error ", e);
      return e;
    });
}

export { GET, POST, login };
