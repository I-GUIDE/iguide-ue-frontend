import React from 'react';

import ElementList from '../components/Layout/ElementList';

const Publications = () => {
    return (
        <ElementList
            dataType={['publication']}
            title='Publications'
            subtitle='Find your publications here'
        />
    )
}

export default Publications;