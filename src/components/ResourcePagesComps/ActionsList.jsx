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
    const title = props.title;
    const externalLink = props.externalLink;
    const directDownloadLink = props.directDownloadLink;
    const size = props.size;
    const externalLinkText = props.externalLinkText;
    const directDownloadLinkText = props.directDownloadLinkText;

    const hasExternalLink = (externalLink && externalLink !== "");
    const hasDirectDownloadLink = (directDownloadLink && directDownloadLink !== "");
    const hasSize = (size && size !== "");

    if (hasExternalLink || hasDirectDownloadLink) {
        return (
            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                <Typography
                    id="notebook-tags"
                    level="h5"
                    fontWeight="lg"
                    mb={1}
                >
                    {title}
                </Typography>
                <Divider inset="none" />
                <Box
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-end"
                    spacing={1}
                >
                    {hasExternalLink &&
                        <Button color="success" size="sm" sx={{ my: 1, mx: 0.5 }}>
                            <Link
                                underline="none"
                                href={externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: 'inherit' }}
                            >
                                {externalLinkText}&nbsp;<ExitToAppIcon />
                            </Link>
                        </Button>
                    }
                    {hasDirectDownloadLink &&
                        <Button color="warning" size="sm" sx={{ my: 1, mx: 0.5 }}>
                            <Link
                                underline="none"
                                href={directDownloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: 'inherit' }}
                            >
                                {directDownloadLinkText}&nbsp;{hasSize && '(' + size + ')'}&nbsp;<CloudDownloadOutlinedIcon />
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