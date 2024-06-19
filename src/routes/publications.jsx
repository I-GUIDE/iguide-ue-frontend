import React from 'react';

import ItemList from '../components/Layout/ItemList';

const Publications = () => {
    return (
        <ItemList
            dataType='publication'
            title='Publications'
            subtitle='Find your publications here'
        />
    )
}

export default Publications;