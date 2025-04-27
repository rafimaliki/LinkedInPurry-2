// import { ENDPOINT } from "./config.js";
import http from "k6/http";

const ENDPOINT = "http://localhost:3000";

export function get(path, { token } = {}) {
  return http.get(ENDPOINT + path, {
    headers: {
      Cookie: `auth_token=${token}`,
    },
  });
}

export function post(path, body, { token } = {}) {
  return http.post(ENDPOINT + path, JSON.stringify(body), {
    headers: {
      Cookie: `auth_token=${token}`,
      "Content-Type": "application/json",
    },
  });
}
