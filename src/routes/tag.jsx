import React from 'react';
import { useParams } from 'react-router-dom';

import ElementList from '../components/Layout/ElementList';

function Tag() {
    const tagName = useParams().id;

    return (
        <ElementList
            fieldName='tags'
            matchValue={[tagName]}
            title={'Tag name: \"' + tagName + '\"'}
            subtitle='Elements containing the given tag name'
        />
    )
}

export default Tag;