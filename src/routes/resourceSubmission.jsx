import * as React from 'react';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import Stack from '@mui/joy/Stack';
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

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('thumbnail-input').addEventListener('change', function () {
        const fileInput = document.getElementById('thumbnail-input');
        const file = fileInput.files[0];
        const preview = document.getElementById('thumbnail-preview');

        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                fileInput.value = '';
                preview.src = '';
                preview.classList.add('hidden');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('resourceForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('thumbnail-input');
        const file = fileInput.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://149.165.154.200:5001/api/upload-thumbnail', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            document.getElementById('thumbnail-image').value = result.url;
        }

        const formData = new FormData(e.target);
        const data = {};

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

        const response = await fetch('http://149.165.154.200:5001/api/resources', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);
    });

    document.getElementById('addRelatedResource').addEventListener('click', function () {
        const relatedResourceDiv = document.createElement('div');
        relatedResourceDiv.classList.add('related-resource', 'input-field');

        const resourceTypeSelect = document.createElement('select');
        resourceTypeSelect.name = 'related-resource-type';
        resourceTypeSelect.innerHTML = `
  <option value="notebook">Notebook</option>
  <option value="dataset">Dataset</option>
  <option value="publication">Publication</option>
  <option value="oer">Open Educational Resource</option>
`;

        const resourceTypeLabel = document.createElement('label');
        resourceTypeLabel.innerText = 'Resource Type';
        relatedResourceDiv.appendChild(resourceTypeLabel);

        const resourceTitleInput = document.createElement('input');
        resourceTitleInput.type = 'text';
        resourceTitleInput.name = 'related-resource-title';
        resourceTitleInput.placeholder = 'Search related resource...';

        const resourceDropdown = document.createElement('div');
        resourceDropdown.classList.add('related-resource-dropdown');

        relatedResourceDiv.appendChild(resourceTypeSelect);
        relatedResourceDiv.appendChild(resourceTitleInput);
        relatedResourceDiv.appendChild(resourceDropdown);
        document.getElementById('relatedResourcesSection').appendChild(relatedResourceDiv);

        resourceTitleInput.addEventListener('input', async function () {
            const keyword = this.value;
            const resourceType = resourceTypeSelect.value;
            if (keyword.length > 2) {
                const response = await fetch('http://149.165.154.200:5001/api/search', {
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
                resourceDropdown.innerHTML = '';
                results.forEach(result => {
                    const option = document.createElement('div');
                    option.textContent = result.title;
                    option.addEventListener('click', function () {
                        resourceTitleInput.value = result.title;
                        resourceDropdown.style.display = 'none';
                    });
                    resourceDropdown.appendChild(option);
                });
                resourceDropdown.style.display = 'block';
            } else {
                resourceDropdown.style.display = 'none';
            }
        });
    });

    document.getElementById('removeRelatedResource').addEventListener('click', function () {
        const relatedResources = document.querySelectorAll('.related-resource');
        if (relatedResources.length > 0) {
            const lastRelatedResource = relatedResources[relatedResources.length - 1];
            lastRelatedResource.remove();
        }
    });
});

const ResourceSubmission = () => {
    const [resourceTypeSelected, setResourceTypeSelected] = React.useState("");
    const [thumbnailImageFile, setThumbnailImageFile] = React.useState(null);

    const handleResourceTypeChange = (event, newResourceType) => {
        setResourceTypeSelected(newResourceType);
    };

    const handleThumbnailImageUpload = (event) => {
        const thumbnailFile = event.target.files[0];
        console.log("thumbnail", thumbnailFile);
        if (!thumbnailFile.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            setThumbnailImageFile(null);
            return;
        }
        setThumbnailImageFile(URL.createObjectURL(thumbnailFile));
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
                            <form id="resourceForm">
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
                                            id="resource-type"
                                            placeholder="Select a resource type"
                                            name="rt"
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
                                        <Input id="title" required />
                                    </FormControl>
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Authors (comma-separated)</FormLabel>
                                        <Input id="authors" placeholder="Author 1, Author 2, ..." />
                                    </FormControl>
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Tags (comma-separated)</FormLabel>
                                        <Input id="tags" placeholder="Tag 1, Tag 2, ..." />
                                    </FormControl>
                                    <FormControl sx={{ gridColumn: '1/-1' }}>
                                        <FormLabel>Content</FormLabel>
                                        <Textarea
                                            id="content"
                                            minRows={4}
                                            maxRows={10}
                                        />
                                    </FormControl>
                                    {resourceTypeSelected === "dataset" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>External link</FormLabel>
                                            <Input id="external-link" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "dataset" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Direct download link</FormLabel>
                                            <Input id="direct-download-link" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "dataset" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Data size</FormLabel>
                                            <Input id="size" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "notebook" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Notebook GitHub repo URL</FormLabel>
                                            <Input id="notebook-repo" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "notebook" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Notebook filename (.ipynb)</FormLabel>
                                            <Input id="notebook-file" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "publication" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>External link</FormLabel>
                                            <Input id="external-link-publication" />
                                        </FormControl>
                                    }
                                    {resourceTypeSelected === "oer" &&
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>External link</FormLabel>
                                            <Input id="external-link-oer" />
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
                                        >
                                            Upload an image
                                            <VisuallyHiddenInput type="file" onChange={handleThumbnailImageUpload} />
                                        </Button>
                                        {thumbnailImageFile &&
                                            <div>
                                                <Typography>Thumbnail preview</Typography>
                                                <AspectRatio ratio="1" sx={{ width: 190 }}>
                                                    <img
                                                        src={thumbnailImageFile}
                                                        loading="lazy"
                                                        alt="thumbnail-preview"
                                                    />
                                                </AspectRatio>
                                            </div>
                                        }
                                    </FormControl>
                                    <CardActions sx={{ gridColumn: '1/-1' }}>
                                        <Button variant="solid" color="primary">
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