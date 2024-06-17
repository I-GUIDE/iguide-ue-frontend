import * as React from 'react';

import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';

import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function ActionList(props) {
    const externalLink = props.externalLink;
    const directDownloadLink = props.directDownloadLink;
    const size = props.size;

    const hasExternalLink = externalLink !== "";
    const hasDirectDownloadLink = directDownloadLink !== "";
    const hasSize = size !== "";

    if (hasExternalLink || hasDirectDownloadLink) {
        return (
            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                <Typography
                    id="notebook-tags"
                    level="h5"
                    fontWeight="lg"
                    mb={1}
                >
                    Actions
                </Typography>
                <Divider inset="none" />
                <Box
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-end"
                    spacing={1}
                >
                    {hasExternalLink &&
                        <Button color="warning" size="sm" sx={{ my: 1, mx: 0.5 }}>
                            <Link
                                underline="none"
                                href={externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: 'inherit' }}
                            >
                                Access Data Details&nbsp;<ExitToAppIcon />
                            </Link>
                        </Button>
                    }
                    {hasDirectDownloadLink &&
                        <Button color="danger" size="sm" sx={{ my: 1, mx: 0.5 }}>
                            <Link
                                underline="none"
                                href={directDownloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: 'inherit' }}
                            >
                                Download Data {hasSize && '(' + size + ')'}&nbsp;<CloudDownloadOutlinedIcon />
                            </Link>
                        </Button>
                    }
                </Box>
            </Stack>
        )
    } else {
        return (null)
    }


}