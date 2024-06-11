const { Client } = require('@elastic/elasticsearch');

// Create a new client instance
const client = new Client({ node: 'http://localhost:9200' });

// Define the search query
const searchQuery = {
  index: 'notebooks',
  body: {
    query: {
      match: {
        title: 'National-level Analysis using Twitter Data'
      }
    }
  }
};

// Execute the search query
client.search(searchQuery)
  .then(response => {
    // Extract related dataset IDs
    const hits = response.body.hits.hits;
    if (hits.length > 0) {
      const relatedDatasets = hits[0]._source['related-datasets'] || [];
      console.log("Related Dataset Titles:");
      // Fetch details of the datasets
      relatedDatasets.forEach(datasetId => {
        client.get({
          index: 'datasets',
          id: datasetId
        }).then(datasetResponse => {
          const datasetTitle = datasetResponse.body._source.title;
          console.log("- ", datasetTitle);
        }).catch(error => {
          console.error("Error fetching dataset details:", error);
        });
      });
    } else {
      console.log("No matching notebooks found.");
    }
  })
  .catch(error => {
    console.error("Error executing search query:", error);
  });
