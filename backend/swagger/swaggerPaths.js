const generateSwaggerPaths = (routes) => {
  const paths = {};

  routes.forEach((route) => {
    const { method, endpoint, requireAuth, params, responses, tags } = route;

    // Ensure the endpoint exists in the paths object
    if (!paths[endpoint]) {
      paths[endpoint] = {};
    }

    const parameters = [];

    if (params?.path) {
      Object.entries(params.path).forEach(([name, details]) => {
        parameters.push({
          in: "path",
          name,
          required: details.required || false,
          schema: { type: details.type },
          description: details.description || "",
        });
      });
    }

    if (params?.query) {
      Object.entries(params.query).forEach(([name, details]) => {
        parameters.push({
          in: "query",
          name,
          required: details.required || false,
          schema: { type: details.type },
          description: details.description || "",
        });
      });
    }

    const requestBody = params?.body
      ? {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: Object.keys(params.body).reduce((acc, key) => {
                  acc[key] = { type: params.body[key].type };
                  return acc;
                }, {}),
                required: Object.keys(params.body).filter(
                  (key) => params.body[key].required
                ),
              },
            },
          },
        }
      : undefined;

    // Add method to the specific endpoint
    paths[endpoint][method.toLowerCase()] = {
      summary: `Endpoint for ${method.toUpperCase()} ${endpoint}`,
      tags: tags || ["Default"],
      security: requireAuth ? [{ CookieAuth: [] }] : [],
      parameters: parameters.length ? parameters : undefined,
      ...(requestBody ? { requestBody } : {}),
      responses: responses || {
        200: { description: "Successful response" },
      },
    };
  });

  return paths;
};

module.exports = generateSwaggerPaths;
