import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Notebooks from '../../assets/metadata/notebook-metadata.json';
import { Link } from '@mui/joy';

function NotebookPage() {
    const [text, setText] = useState("");
    const id = useParams().id;

    // Generate individual notebook page
    useEffect(() => {
        for (var i = 0; i < Notebooks.length; i++) {
            var obj = Notebooks[i];
            if (obj.id == id) {
                setText(obj.title);
            }
        }
    });

    return (
        <div className="content">
            <div className="page-title">{id}</div>
            <div className="project-text">{text}</div>
            <Link
                overlay
                underline="none"
                href="/notebooks"
                sx={{ color: 'text.tertiary' }}
            >
                Go Back
            </Link>
        </div>
    )
}

export default NotebookPage;