import React from 'react';

import ElementList from '../components/Layout/ElementList';

const Datasets = () => {
    return (
        <ElementList
            dataType={['dataset']}
            title='Datasets'
            subtitle='Find your datasets here'
        />
    )
}

export default Datasets;