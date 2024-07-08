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

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';

import Header from '../components/Layout/Header';
import LoginCard from '../components/LoginCard';
import SubmissionStatusCard from '../components/SubmissionStatusCard';

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
    const [resourceTypeSelected, setResourceTypeSelected] = useState("");

    const [thumbnailImageFile, setThumbnailImageFile] = useState();
    const [thumbnailImageFileURL, setThumbnailImageFileURL] = useState();

    const [relatedResources, setRelatedResources] = useState([]);
    const [returnedRelatedResourceTitle, setReturnedRelatedResourceTitle] = useState([]);
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [currentResourceType, setCurrentResourceType] = useState('');

    const [oerExternalLinks, setOerExternalLinks] = useState([]);
    const [currentOerExternalLinkType, setCurrentOerExternalLinkType] = useState('');
    const [currentOerExternalLinkURL, setCurrentOerExternalLinkURL] = useState('');
    const [currentOerExternalLinkTitle, setCurrentOerExternalLinkTitle] = useState('');

    const [submissionStatus, setSubmissionStatus] = useState('no submission');

    const [isAuthenticated, setIsAuthenticated, userInfo, setUserInfo] = useOutletContext();

    useEffect(() => {
        const fetchSearchData = async (resourceType, keyword) => {
            if (resourceType && resourceType !== '' && keyword.length > 2) {
                const response = await fetch(`${USER_BACKEND_URL}/api/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        keyword: keyword,
                        resource_type: resourceType
                    })
                });
                const results = await response.json();
                setReturnedRelatedResourceTitle(results);
            } else {
                setReturnedRelatedResourceTitle([]);
            }
        };
        fetchSearchData(currentResourceType, currentSearchTerm);
    }, [currentResourceType, currentSearchTerm]);

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
        if (!currentResourceType || currentResourceType === '') {
            alert('please select a resource type!')
            return;
        }
        if (!currentSearchTerm || currentSearchTerm === '') {
            alert('please enter the title!')
            return;
        }
        setRelatedResources([...relatedResources, { type: currentResourceType, title: currentSearchTerm }]);
        setCurrentResourceType('');
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
        setCurrentResourceType(value);
    };

    const handleRelatedResourceTitleChange = (value) => {
        setCurrentSearchTerm(value);
    };



    const handleAddingOneOerExternalLink = () => {
        if (!currentOerExternalLinkType || currentOerExternalLinkType === '') {
            alert('please select a resource type!')
            return;
        }
        if (!currentOerExternalLinkTitle || currentOerExternalLinkTitle === '') {
            alert('please enter the title!')
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
        if (result && result.message === 'Resource registered successfully') {
            setSubmissionStatus('success');
        } else {
            setSubmissionStatus('failed')
        }
    }

    if (!isAuthenticated) {
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
                            <LoginCard />
                        </Grid>
                    </Box>
                </Container>
            </CssVarsProvider>
        )
    }

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
                                    {resourceTypeSelected === "oer" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>External link</FormLabel>
                                            <Input name="external-link-oer" />
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
                                    <Grid sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Related Resources</FormLabel>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '30%' }} align="left">Type</th>
                                                    <th style={{ width: '65%' }} align="left">Title</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {relatedResources.map((x, i) => (
                                                    <tr key={i}>
                                                        <td align="left" >
                                                            <p>{x.type}</p>
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
                                                <td align="left">
                                                    <Select
                                                        placeholder="Type"
                                                        value={currentResourceType}
                                                        onChange={(e, newValue) => handleRelatedResourceTypeChange(newValue)}
                                                    >
                                                        <Option value="dataset">Dataset</Option>
                                                        <Option value="notebook">Notebook</Option>
                                                        <Option value="publication">Publication</Option>
                                                        <Option value="oer">Educational Resource</Option>
                                                    </Select>
                                                </td>
                                                <td align="left">
                                                    <Autocomplete
                                                        freeSolo
                                                        value={currentSearchTerm}
                                                        placeholder="Type anything"
                                                        options={returnedRelatedResourceTitle.map((option) => option.title)}
                                                        onInputChange={(e, newValue) => handleRelatedResourceTitleChange(newValue)}
                                                    />
                                                </td>
                                                <td align="left">
                                                    <AddIcon
                                                        onClick={handleAddingOneRelatedResource}
                                                        style={{ marginTop: "4px", cursor: "pointer" }}
                                                    />
                                                </td>
                                            </tbody>
                                        </Table>
                                    </Grid>


                                    {/* External links */}
                                    {resourceTypeSelected === "oer" &&
                                        <Grid sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Educational Resource External Links</FormLabel>
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
                                                                <p>{x.type}</p>
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
                                                        <AddIcon
                                                            onClick={handleAddingOneOerExternalLink}
                                                            style={{ marginTop: "4px", cursor: "pointer" }}
                                                        />
                                                    </td>
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