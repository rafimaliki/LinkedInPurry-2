const exampleHandler = async (req, res) => {
  const ghost = "https://www.youtube.com/channel/UC5CwaMl1eIgY8h02uZw7u8A";

  // Extract request details
  const { url: requestUrl, params, query, headers, body } = req;

  const response = {
    ghost,
    requestDetails: {
      requestUrl,
      params,
      query,
      headers,
      body,
    },
  };

  // Respond with the data
  res.status(200).json(response);
};

module.exports = exampleHandler;
