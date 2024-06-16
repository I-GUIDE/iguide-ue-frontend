import React from 'react';

import ItemList from '../components/Layout/ItemList';

const Notebooks = () => {
    return (
        <ItemList
            dataType='notebook'
            title='Notebooks'
            subtitle='Find your notebooks here'
        />
    )
}

export default Notebooks;