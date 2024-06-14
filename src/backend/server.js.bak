const express = require('express');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('@opensearch-project/opensearch');

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

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
  const type = req.query.data_name;

  try {
    const resourceResponse = await client.search({
        index: 'resources',
        body: {
          query: {
            term: {
              'resource-type': type,
            },
          },
        },
      });

      if (resourceResponse.body.hits.total.value === 0) {
        res.status(404).json({ message: 'No resource found' });
        return;
      }
      const resources = resourceResponse.body.hits.hits.map(hit => hit._source);
      res.json(resources);
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

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

