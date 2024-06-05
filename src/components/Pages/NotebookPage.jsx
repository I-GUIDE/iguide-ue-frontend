import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Link } from '@mui/joy';

import Header from '../Layout/Header';

import Notebooks from '../../assets/metadata/notebook-metadata.json';

function NotebookPage() {
    const [text, setText] = useState("");
    const [relatedDatasets, setRelatedDatasets] = useState([]);
    const id = useParams().id;

    // Generate individual notebook page
    useEffect(() => {
        for (var i = 0; i < Notebooks.length; i++) {
            var obj = Notebooks[i];
            if (obj.id == id) {
                setRelatedDatasets(obj['related-datasets']);
                setText(obj.title);
            }
        }
    });

    return (
        <div className="content">
            <Header title={id} subtitle={text} />
            <div className="project-text">Related dataset(s):</div>
            {relatedDatasets.map((dataset) => (
                <Link
                    underline="none"
                    href={"/datasets/" + dataset}
                    sx={{ color: 'text.tertiary' }}
                >
                    {dataset}
                </Link>
            ))}
            <div className="project-text">
                <Link
                    underline="none"
                    href="/notebooks"
                    sx={{ color: 'text.tertiary' }}
                >
                    Go Back
                </Link>
            </div>
        </div>
    )
}

export default NotebookPage;