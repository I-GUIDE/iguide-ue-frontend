import * as React from 'react';

import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import { CopyBlock, dracula } from "react-code-blocks";

import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';

import { generateDataAccessCode } from '../../utils/DataAccessCodeGenerator';

export default function CodeSnippet(props) {
    const directDownloadLink = props.directDownloadLink;

    if (directDownloadLink && directDownloadLink !== '') {
        return (
            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                <Box>
                    <Typography
                        id="download-jupyterhub"
                        level="h6"
                        fontWeight="lg"
                        mb={1}
                    >
                        Direct Data Access
                    </Typography>
                    <Divider inset="none" />
                    <Tabs aria-label="Basic tabs" defaultValue={0}>
                        <TabList>
                            <Tab>I-GUIDE Platform</Tab>
                            <Tab>Python</Tab>
                        </TabList>
                        <TabPanel value={0}>
                            <CopyBlock
                                language={'shell'}
                                text={generateDataAccessCode(directDownloadLink, 'iguide')}
                                showLineNumbers={false}
                                theme={dracula}
                                wrapLines={true}
                                codeBlock
                            />
                        </TabPanel>
                        <TabPanel value={1}>
                            <CopyBlock
                                language={'python'}
                                text={generateDataAccessCode(directDownloadLink, 'python')}
                                showLineNumbers={false}
                                theme={dracula}
                                wrapLines={true}
                                codeBlock
                            />
                        </TabPanel>
                    </Tabs>
                </Box>
            </Stack>
        )
    } else {
        return null;
    }
}