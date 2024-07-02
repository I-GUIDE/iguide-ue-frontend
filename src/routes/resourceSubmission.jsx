import React, { useState, useEffect } from 'react';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import Stack from '@mui/joy/Stack';
import Alert from '@mui/joy/Alert';
import Grid from '@mui/joy/Grid';
import Card from '@mui/joy/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Textarea from '@mui/joy/Textarea';
import { styled } from '@mui/joy';

import Header from '../components/Layout/Header';

const USER_BACKEND_URL = "https://backend.i-guide.io:5000"


const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;


const ResourceSubmission = () => {
    const [authors, setAuthors] = useState([]);
    const [contents, setContents] = useState();
    const [directDownloadLink, setDirectDownloadLink] = useState();
    const [externalLink, setExternalLink] = useState();
    const [externalLinkOer, setExternalLinkOer] = useState();
    const [externalLinkPublication, setExternalLinkPublication] = useState();
    const [notebookFile, setNotebookFile] = useState();
    const [notebookRepo, setNotebookRepo] = useState();

    const [resourceTypeSelected, setResourceTypeSelected] = useState("");
    const [thumbnailImageFile, setThumbnailImageFile] = useState();
    const [thumbnailImageFileURL, setThumbnailImageFileURL] = useState();

    const handleResourceTypeChange = (event, newResourceType) => {
        setResourceTypeSelected(newResourceType);
    };

    const handleThumbnailImageUpload = (event) => {
        const thumbnailFile = event.target.files[0];
        console.log("thumbnail", thumbnailFile);
        if (!thumbnailFile.type.startsWith('image/')) {
            alert('We only accept an image here!');
            setThumbnailImageFile(null);
            setThumbnailImageFileURL(null);
            return null;
        }
        setThumbnailImageFile(thumbnailFile);
        setThumbnailImageFileURL(URL.createObjectURL(thumbnailFile));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {};

        if (thumbnailImageFile) {
            const formData = new FormData();
            formData.append('file', thumbnailImageFile);

            console.log(formData)

            const response = await fetch(`${USER_BACKEND_URL}/api/upload-thumbnail`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            data['thumbnail-image'] = result.url;
        }

        const formData = new FormData(event.target);
        
        formData.forEach((value, key) => {
            if (key === 'authors' || key === 'tags') {
                data[key] = value.split(',').map(item => item.trim());
            } else if (key === 'created_by') {
                if (!data.metadata) {
                    data.metadata = {};
                }
                data.metadata.created_by = value;
            } else {
                data[key] = value;
            }
        });

        const relatedResources = [];
        document.querySelectorAll('.related-resource').forEach(div => {
            const type = div.querySelector('select[name="related-resource-type"]').value;
            const title = div.querySelector('input[name="related-resource-title"]').value;
            relatedResources.push({ type, title });
        });
        data['related-resources'] = relatedResources;

        console.log("data", data)

        const response = await fetch(`${USER_BACKEND_URL}/api/resources`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);
    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header title="Resource Submission" subtitle="Thanks for your contributions!" />
            <Container maxWidth="xl">
                <Box
                    component="main"
                    sx={{
                        minHeight: 'calc(100vh - 420px)', // 55px is the height of the NavBar
                        display: 'grid',
                        gridTemplateColumns: { xs: 'auto', md: '100%' },
                        gridTemplateRows: 'auto 1fr auto',
                    }}
                >
                    <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        sx={{
                            minHeight: 'calc(100vh - 420px)',
                            backgroundColor: 'inherit',
                            px: { xs: 2, md: 4 },
                            pt: 4,
                            pb: 8,
                        }}
                    >
                        <Card
                            variant="outlined"
                            sx={{
                                maxHeight: 'max-content',
                                maxWidth: '600px',
                                width: '100%'
                            }}
                        >
                            <Typography level="title-lg" >
                                Add your new contribution
                            </Typography>
                            <Divider inset="none" />
                            <form onSubmit={handleSubmit} name="resourceForm">
                                <CardContent
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                                        gap: 1.5,
                                    }}
                                >
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Resource type</FormLabel>
                                        <Select
                                            name="resource-type"
                                            placeholder="Select a resource type"
                                            required
                                            sx={{ minWidth: 200 }}
                                            onChange={handleResourceTypeChange}
                                        >
                                            <Option value="" disabled selected>Choose your option</Option>
                                            <Option value="dataset">Dataset</Option>
                                            <Option value="notebook">Notebook</Option>
                                            <Option value="publication">Publication</Option>
                                            <Option value="oer">Educational Resource</Option>
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Resource title</FormLabel>
                                        <Input name="title" required />
                                    </FormControl>
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Authors (comma-separated)</FormLabel>
                                        <Input name="authors" placeholder="Author 1, Author 2, ..." />
                                    </FormControl>
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Tags (comma-separated)</FormLabel>
                                        <Input name="tags" placeholder="Tag 1, Tag 2, ..." />
                                    </FormControl>
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Content</FormLabel>
                                        <Textarea
                                            name="content"
                                            minRows={4}
                                            maxRows={10}
                                        />
                                    </FormControl>
                                    {resourceTypeSelected === "dataset" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>External link</FormLabel>
                                            <Input name="external-link" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "dataset" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Direct download link</FormLabel>
                                            <Input name="direct-download-link" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "dataset" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Data size</FormLabel>
                                            <Input name="size" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "notebook" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Notebook GitHub repo URL</FormLabel>
                                            <Input name="notebook-repo" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "notebook" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Notebook filename (.ipynb)</FormLabel>
                                            <Input name="notebook-file" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "publication" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>External link</FormLabel>
                                            <Input name="external-link-publication" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "oer" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>External link</FormLabel>
                                            <Input name="external-link-oer" />
                                        </FormControl>
                                    }
                                    <FormControl>
                                        <FormLabel>Upload thumbnail image</FormLabel>
                                        <Button
                                            component="label"
                                            role={undefined}
                                            tabIndex={-1}
                                            variant="outlined"
                                            color="neutral"
                                            name="thumbnail-image"
                                        >
                                            Upload an image
                                            <VisuallyHiddenInput type="file" onChange={handleThumbnailImageUpload} />
                                        </Button>
                                        {thumbnailImageFileURL &&
                                            <div>
                                                <Typography>Thumbnail preview</Typography>
                                                <AspectRatio ratio="1" sx={{ width: 190 }}>
                                                    <img
                                                        src={thumbnailImageFileURL}
                                                        loading="lazy"
                                                        alt="thumbnail-preview"
                                                    />
                                                </AspectRatio>
                                            </div>
                                        }
                                    </FormControl>
                                    <CardActions sx={{ gridColumn: '1/-1' }}>
                                        <Button type="submit" variant="solid" color="primary">
                                            Submit this contribution
                                        </Button>
                                    </CardActions>

                                </CardContent>
                            </form>
                        </Card>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    )
}

export default ResourceSubmission;