import React from 'react';

import ElementList from '../components/ElementList';

export default function Datasets() {
    return (
        <ElementList
            dataType={['dataset']}
            title='Datasets'
            subtitle='Find your datasets here'
        />
    );
}