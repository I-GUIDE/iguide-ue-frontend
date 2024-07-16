import React, { useState, useEffect } from 'react';

import { useOutletContext } from 'react-router-dom';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
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
import Table from '@mui/joy/Table';
import Autocomplete from '@mui/joy/Autocomplete';
import IconButton from '@mui/joy/IconButton';

import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';

import Header from '../components/Layout/Header';
import LoginCard from '../components/LoginCard';
import SubmissionStatusCard from '../components/SubmissionStatusCard';

import { RESOURCE_TYPE_NAMES, OER_EXTERNAL_LINK_TYPES } from '../configs/ResourceTypes';
import { fetchAllTitlesByElementType } from '../utils/DataRetrieval';

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL

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
    const [resourceTypeSelected, setResourceTypeSelected] = useState("");

    const [thumbnailImageFile, setThumbnailImageFile] = useState();
    const [thumbnailImageFileURL, setThumbnailImageFileURL] = useState();

    const [relatedResources, setRelatedResources] = useState([]);
    const [returnedRelatedResourceTitle, setReturnedRelatedResourceTitle] = useState([]);
    const relatedResourceDropdownLoading = returnedRelatedResourceTitle.length === 0;
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [currentRelatedResourceTitle, setCurrentRelatedResourceTitle] = useState();
    const [currentRelatedResourceType, setCurrentRelatedResourceType] = useState('');

    const [oerExternalLinks, setOerExternalLinks] = useState([]);
    const [currentOerExternalLinkType, setCurrentOerExternalLinkType] = useState('');
    const [currentOerExternalLinkURL, setCurrentOerExternalLinkURL] = useState('');
    const [currentOerExternalLinkTitle, setCurrentOerExternalLinkTitle] = useState('');

    const [submissionStatus, setSubmissionStatus] = useState('no submission');

    const [isAuthenticated, setIsAuthenticated, userInfo, setUserInfo] = useOutletContext();

    useEffect(() => {
        const getAllTitlesByElementType = async (resourceType) => {
            if (resourceType && resourceType !== '') {
                const returnedTitles = await fetchAllTitlesByElementType(resourceType);
                setReturnedRelatedResourceTitle(returnedTitles);
            } else {
                setReturnedRelatedResourceTitle([]);
            }
        }
        getAllTitlesByElementType(currentRelatedResourceType);
    }, [currentRelatedResourceType]);

    const handleResourceTypeChange = (event, newResourceType) => {
        setResourceTypeSelected(newResourceType);
    };

    const handleThumbnailImageUpload = (event) => {
        const thumbnailFile = event.target.files[0];
        if (!thumbnailFile.type.startsWith('image/')) {
            alert('We only accept an image here!');
            setThumbnailImageFile(null);
            setThumbnailImageFileURL(null);
            return null;
        }
        setThumbnailImageFile(thumbnailFile);
        setThumbnailImageFileURL(URL.createObjectURL(thumbnailFile));
    }



    const handleAddingOneRelatedResource = () => {
        if (!currentRelatedResourceType || currentRelatedResourceType === '') {
            alert('Please select a resource type!')
            return;
        }
        if (!currentRelatedResourceTitle || currentRelatedResourceTitle === '') {
            alert('Please type and select a resource title from the dropdown!')
            return;
        }
        setRelatedResources([...relatedResources, { type: currentRelatedResourceType, title: currentRelatedResourceTitle }]);
        setCurrentRelatedResourceType('');
        setCurrentRelatedResourceTitle('');
        setCurrentSearchTerm('');
        console.log("Added one, now: ", relatedResources)
    }

    const handleRemovingOneRelatedResource = (idx) => {
        let newArray = [...relatedResources];
        newArray.splice(idx, 1);
        setRelatedResources(newArray);
        console.log("Removing one, now: ", relatedResources)
    }

    const handleRelatedResourceTypeChange = (value) => {
        setCurrentRelatedResourceType(value);
    };

    const handleRelatedResourceTitleChange = (value) => {
        setCurrentRelatedResourceTitle(value);
    };

    const handleRelatedResourceTitleInputChange = (value) => {
        setCurrentSearchTerm(value);
    }

    const handleAddingOneOerExternalLink = () => {
        if (!currentOerExternalLinkType || currentOerExternalLinkType === '') {
            alert('Please select an external link type!')
            return;
        }
        if (!currentOerExternalLinkURL || currentOerExternalLinkURL === '') {
            alert('Please enter a URL!')
            return;
        }
        if (!currentOerExternalLinkTitle || currentOerExternalLinkTitle === '') {
            alert('Please enter a title!')
            return;
        }
        setOerExternalLinks([...oerExternalLinks, { type: currentOerExternalLinkType, url: currentOerExternalLinkURL, title: currentOerExternalLinkTitle }]);
        setCurrentOerExternalLinkType('');
        setCurrentOerExternalLinkURL('');
        setCurrentOerExternalLinkTitle('');
        console.log("Added one, now: ", oerExternalLinks)
    }

    const handleRemovingOneOerExternalLink = (idx) => {
        let newArray = [...oerExternalLinks];
        newArray.splice(idx, 1);
        setOerExternalLinks(newArray);
        console.log("Removing one, now: ", oerExternalLinks)
    }

    const handleOerExternalLinkTypeChange = (value) => {
        setCurrentOerExternalLinkType(value);
    };

    const handleOerExternalLinkSearchTitle = async () => {
        const url = currentOerExternalLinkURL;

        if (url) {
            const response = await fetch(`${USER_BACKEND_URL}/api/retrieve-title?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                alert('Retrieve website title failed... please input the title manually!')
                return;
            }
            const data = await response.json();
            console.log('search return', data.title)
            setCurrentOerExternalLinkTitle(data.title);
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {};

        // When the user forgets to save the new related element, app will ask the user to submit it
        if (currentRelatedResourceTitle && currentRelatedResourceTitle !== '') {
            alert('You have an unsaved related element. Please click the "+" button to save the related element before submitting your contribution!');
            return;
        }

        // When the user forgets to save the new educational element link, app will ask the user to submit it
        if ((currentOerExternalLinkURL && currentOerExternalLinkURL !== '') || (currentOerExternalLinkTitle && currentOerExternalLinkTitle !== '')) {
            alert('You have an unsaved educational resource external link. Please click the "+" button to save the external link before submitting your contribution!');
            return;
        }

        if (thumbnailImageFile) {
            const formData = new FormData();
            formData.append('file', thumbnailImageFile);

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
            } else {
                data[key] = value;
            }
        });

        data.metadata = { created_by: userInfo.sub };
        data['related-resources'] = relatedResources;

        if (resourceTypeSelected === 'oer') {
            data['oer-external-links'] = oerExternalLinks;
        }

        console.log("Data soon to be submitted", data)

        const response = await fetch(`${USER_BACKEND_URL}/api/resources`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);
        if (result && result.message === 'Resource registered successfully') {
            setSubmissionStatus('success');
        } else {
            setSubmissionStatus('failed')
        }
    }

    // If the user is not authenticated/logged in, they will be redirected to the login page
    if (!isAuthenticated) {
        return (
            <CssVarsProvider disableTransitionOnChange>
                <CssBaseline />
                <Header title="Contribute a Knowledge Element" subtitle="Thanks for your contributions!" />
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
                            <LoginCard />
                        </Grid>
                    </Box>
                </Container>
            </CssVarsProvider>
        )
    }

    // After submission, show users the submission status. 
    if (submissionStatus !== 'no submission') {
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
                            <Typography>
                                <SubmissionStatusCard submissionStatus={submissionStatus} />
                            </Typography>
                        </Grid>
                    </Box>
                </Container>
            </CssVarsProvider>
        )
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
                                maxWidth: '900px',
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
                                        // gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                                        gap: 1.5,
                                    }}
                                >
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Resource type (required)</FormLabel>
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
                                        <FormLabel>Resource title (required)</FormLabel>
                                        <Input name="title" required />
                                    </FormControl>
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Authors (comma-separated) (required)</FormLabel>
                                        <Input name="authors" placeholder="Author 1, Author 2, ..." required />
                                    </FormControl>
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Tags (comma-separated) (required)</FormLabel>
                                        <Input name="tags" placeholder="Tag 1, Tag 2, ..." required />
                                    </FormControl>
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Description (required)</FormLabel>
                                        <Textarea
                                            name="contents"
                                            minRows={4}
                                            maxRows={10}
                                            required
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
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
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

                                    {/* Related elements */}
                                    <Grid sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Related elements</FormLabel>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '25%' }} align="left">Type</th>
                                                    <th style={{ width: '70%' }} align="left">Title</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {relatedResources.map((x, i) => (
                                                    <tr key={i}>
                                                        <td align="left" >
                                                            <p>{RESOURCE_TYPE_NAMES[x.type]}</p>
                                                        </td>
                                                        <td align="left" >
                                                            <p>{x.title}</p>
                                                        </td>
                                                        <td align="left">
                                                            {relatedResources.length !== 0 && (
                                                                <RemoveIcon
                                                                    onClick={() => handleRemovingOneRelatedResource(i)}
                                                                    style={{
                                                                        marginRight: "10px",
                                                                        marginTop: "4px",
                                                                        cursor: "pointer"
                                                                    }}
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td align="left">
                                                        <Select
                                                            placeholder="Type"
                                                            value={currentRelatedResourceType}
                                                            onChange={(e, newValue) => handleRelatedResourceTypeChange(newValue)}
                                                        >
                                                            <Option value="dataset">Dataset</Option>
                                                            <Option value="notebook">Notebook</Option>
                                                            <Option value="publication">Publication</Option>
                                                            <Option value="oer">Educational Resource</Option>
                                                        </Select>
                                                    </td>
                                                    <td align="left">
                                                        <FormControl id="asynchronous-demo">
                                                            <Autocomplete
                                                                placeholder="Type and select from the dropdown"
                                                                disabled={!currentRelatedResourceType || currentRelatedResourceType === ''}
                                                                loading={relatedResourceDropdownLoading}
                                                                options={returnedRelatedResourceTitle}
                                                                value={currentRelatedResourceTitle || null}
                                                                onChange={(e, newValue) => handleRelatedResourceTitleChange(newValue)}
                                                                inputValue={currentSearchTerm}
                                                                onInputChange={(e, newInputValue) => {
                                                                    handleRelatedResourceTitleInputChange(newInputValue);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </td>
                                                    <td align="left">
                                                        <LibraryAddIcon
                                                            onClick={handleAddingOneRelatedResource}
                                                            style={{ marginTop: "4px", cursor: "pointer" }}
                                                            color="danger"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Grid>


                                    {/* External links */}
                                    {resourceTypeSelected === "oer" &&
                                        <Grid sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Educational resource external links</FormLabel>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '20%' }} align="left">Type</th>
                                                        <th style={{ width: '30%' }} align="left">URL</th>
                                                        <th style={{ width: '5%' }} align="left"></th>
                                                        <th style={{ width: '40%' }} align="left">Title</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {oerExternalLinks.map((x, i) => (
                                                        <tr key={i}>
                                                            <td align="left" >
                                                                <p>{OER_EXTERNAL_LINK_TYPES[x.type]}</p>
                                                            </td>
                                                            <td align="left" >
                                                                <p>{x.url}</p>
                                                            </td>
                                                            <td align="left" >
                                                                <p></p>
                                                            </td>
                                                            <td align="left" >
                                                                <p>{x.title}</p>
                                                            </td>
                                                            <td align="left">
                                                                {oerExternalLinks.length !== 0 && (
                                                                    <RemoveIcon
                                                                        onClick={() => handleRemovingOneOerExternalLink(i)}
                                                                        style={{
                                                                            marginRight: "10px",
                                                                            marginTop: "4px",
                                                                            cursor: "pointer"
                                                                        }}
                                                                    />
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td align="left">
                                                            <Select
                                                                placeholder="Type"
                                                                value={currentOerExternalLinkType}
                                                                onChange={(e, newValue) => handleOerExternalLinkTypeChange(newValue)}
                                                            >
                                                                <Option value="slides">Slides</Option>
                                                                <Option value="bok">Body of Knowledge</Option>
                                                                <Option value="oer">Open Educational Resources</Option>
                                                                <Option value="course">Course</Option>
                                                                <Option value="webpage">Webpage</Option>
                                                            </Select>
                                                        </td>
                                                        <td align="left">
                                                            <Input value={currentOerExternalLinkURL} onChange={(event) => setCurrentOerExternalLinkURL(event.target.value)} />
                                                        </td>
                                                        <td align="left">
                                                            <IconButton variant="outlined" onClick={handleOerExternalLinkSearchTitle}>
                                                                <SearchIcon />
                                                            </IconButton>
                                                        </td>
                                                        <td align="left">
                                                            <Input value={currentOerExternalLinkTitle} onChange={(event) => setCurrentOerExternalLinkTitle(event.target.value)} />
                                                        </td>
                                                        <td align="left">
                                                            <LibraryAddIcon
                                                                onClick={handleAddingOneOerExternalLink}
                                                                style={{ marginTop: "4px", cursor: "pointer" }}
                                                                color="danger"
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Grid>
                                    }

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