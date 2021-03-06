import Prismic from 'prismic.io';

module.exports = async ({ repositoryName, accessToken }) => {
  console.time(`Fetch Prismic data`);
  console.log(`Starting to fetch data from Prismic`);

  const apiEndpoint = `https://${repositoryName}.prismic.io/api`;
  const client = await Prismic.api(apiEndpoint, { accessToken });

  // Query all documents from client
  const documents = await pagedGet(client);
  console.log('docs');
  console.timeEnd(`Fetch Prismic data`);

  return {
    documents
  };
};

async function pagedGet(
  client,
  query = [],
  options = {},
  page = 1,
  pageSize = 100,
  aggregatedResponse = null
) {
  const mergedOptions = Object.assign(
    {
      lang: '*'
    },
    options
  );

  const response = await client.query(query, {
    ...mergedOptions,
    page,
    pageSize
  });

  if (!aggregatedResponse) {
    aggregatedResponse = response.results;
  } else {
    aggregatedResponse = aggregatedResponse.concat(response.results);
  }

  if (page * pageSize < response.total_results_size) {
    return pagedGet(
      client,
      query,
      options,
      page + 1,
      pageSize,
      aggregatedResponse
    );
  }

  return aggregatedResponse;
}
