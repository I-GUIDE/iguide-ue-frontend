import React from 'react';

import ElementList from '../components/ElementList';

export default function Notebooks() {
    return (
        <ElementList
            dataType={['notebook']}
            title='Notebooks'
            subtitle='Find your notebooks here' />
    );
}