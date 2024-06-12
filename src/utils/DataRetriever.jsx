/*import Datasets from '/src/assets/metadata/dataset-metadata.json';
import Notebooks from '/src/assets/metadata/notebook-metadata.json';

export function DataRetriever(data_name) {
    if (data_name == 'datasets') {
        return Datasets;
    } else if (data_name == 'notebooks') {
        return Notebooks;
    } else {
        throw new Error('Wrong data_name!');
    }
}*/


export async function DataRetriever(data_name) {
  const response = await fetch(`http://localhost:5000/api/resources?data_name=${data_name}`);
  if (!response.ok) {
    throw new Error(`Error fetching ${data_name}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}
