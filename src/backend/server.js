// backend/server.js
const express = require('express');
const { Client } = require('@opensearch-project/opensearch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  node: 'https://10.0.147.91:9200', // Your OpenSearch endpoint
  auth: {
    username: 'admin',
    password: 'Iiguidedwn2024',
  },
  ssl: {
    rejectUnauthorized: false, // Use this only if you encounter SSL certificate issues
  },
});

app.get('/api/resources', async (req, res) => {
  const dataName = req.query.data_name;

  try {
    if (dataName === 'notebooks') {
      const notebookResponse = await client.search({
        index: 'resources',
        body: {
          query: {
            prefix: {
              id: 'n',
            },
          },
        },
      });

      if (notebookResponse.body.hits.total.value === 0) {
        res.status(404).json({ message: 'No notebook found' });
        return;
      }
      const notebooks = notebookResponse.body.hits.hits.map(hit => hit._source);
      res.json(notebooks);
    } else if (dataName === 'datasets') {
      const datasetResponse = await client.search({
        index: 'resources',
        body: {
          query: {
            prefix: {
              id: 'ds',
            },
          },
        },
      });

      if (datasetResponse.body.hits.total.value === 0) {
        res.status(404).json({ message: 'No dataset found' });
        return;
      }
      const datasets = datasetResponse.body.hits.hits.map(hit => hit._source);
      res.json(datasets);
    } else {
      res.status(400).json({ message: 'Wrong data_name!' });
    }
  } catch (error) {
    console.error('Error querying OpenSearch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/search', async (req, res) => {
  const { keyword } = req.body;

  try {
    const searchResponse = await client.search({
      index: 'resources', // Replace with your index name
      body: {
        query: {
          multi_match: {
            query: keyword,
            fields: ['title', 'contents', 'tags'], // Adjust fields as needed
          },
        },
      },
    });

    const results = searchResponse.body.hits.hits.map(hit => hit._source);
    res.json(results);
  } catch (error) {
    console.error('Error querying OpenSearch:', error);
    res.status(500).json({ error: 'Error querying OpenSearch' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

