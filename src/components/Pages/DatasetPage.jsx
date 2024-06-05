import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Link } from '@mui/joy';

import Header from '../Layout/Header';

import Datasets from '../../assets/metadata/dataset-metadata.json';

function DatasetPage() {
    const [text, setText] = useState("");
    const [relatedNotebooks, setRelatedNotebooks] = useState([]);
    const id = useParams().id;

    // Generate individual notebook page
    useEffect(() => {
        for (var i = 0; i < Datasets.length; i++) {
            var obj = Datasets[i];
            if (obj.id == id) {
                setRelatedNotebooks(obj['related-notebooks']);
                setText(obj.title);
            }
        }
    });

    return (
        <div className="content">
            <Header title={id} subtitle={text} />
            <div className="project-text">Related notebook(s):</div>
            {relatedNotebooks.map((notebook) => (
                <Link
                    underline="none"
                    href={"/notebooks/" + notebook}
                    sx={{ color: 'text.tertiary' }}
                >
                    {notebook}
                </Link>
            ))}
            <div className="project-text">
                <Link
                    underline="none"
                    href="/datasets"
                    sx={{ color: 'text.tertiary' }}
                >
                    Go Back
                </Link>
            </div>
        </div>
    )
}

export default DatasetPage;