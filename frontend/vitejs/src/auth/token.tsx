const getAuthToken = () => {
  const authToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("auth_token="));
  return authToken ? authToken.split("=")[1] : null;
};

export default getAuthToken;
