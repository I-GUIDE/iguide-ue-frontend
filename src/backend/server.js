// backend/server.js
const express = require('express');
const { Client } = require('@opensearch-project/opensearch');
const cors = require('cors');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const dotenv = require('dotenv');

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
            //fields: ['title', 'contents', 'tags', 'authors'], // Adjust fields as needed
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



dotenv.config();

app.use(cors());
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            //cb(null, Date.now().toString() + path.extname(file.originalname)); // use Date.now() for unique file keys
            cb(null, file.originalname); // Preserve original file name
        }
    })
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({
        message: 'File uploaded successfully',
        url: req.file.location,
        bucket: process.env.AWS_BUCKET_NAME,
        key: req.file.key,
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

