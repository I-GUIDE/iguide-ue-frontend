import React from 'react';

import ElementList from '../components/Layout/ElementList';

const Notebooks = () => {
    return (
        <ElementList
            dataType={['notebook']}
            title='Notebooks'
            subtitle='Find your notebooks here'
        />
    )
}

export default Notebooks;