import React from 'react';
import { useParams } from 'react-router-dom';

import ElementList from '../components/ElementList';

export default function Tag() {
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