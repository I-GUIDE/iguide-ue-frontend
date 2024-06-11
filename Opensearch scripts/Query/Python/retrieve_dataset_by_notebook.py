from elasticsearch import Elasticsearch

# Connect to OpenSearch
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

# Search query
query = {
    "query": {
        "match": {
            "title": "National-level Analysis using Twitter Data"
        }
    }
}

# Execute search
response = es.search(index="notebooks", body=query)

# Extract related dataset titles
hits = response['hits']['hits']
if hits:
    related_datasets = hits[0]['_source'].get('related-datasets', [])
    print("Related Dataset Titles:")
    for dataset_id in related_datasets:
        dataset_response = es.get(index="datasets", id=dataset_id)
        dataset_title = dataset_response['_source']['title']
        print("- ", dataset_title)
