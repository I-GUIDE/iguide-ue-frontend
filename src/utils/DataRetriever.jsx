import Datasets from '/src/assets/metadata/dataset-metadata.json';
import Notebooks from '/src/assets/metadata/notebook-metadata.json';

export function DataRetriever(data_name) {
    if (data_name == 'datasets') {
        return Datasets;
    } else if (data_name == 'notebooks') {
        return Notebooks;
    } else {
        throw new Error('Wrong data_name!');
    }
}