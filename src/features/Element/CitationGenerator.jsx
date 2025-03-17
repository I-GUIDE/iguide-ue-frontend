import React, { useState, useEffect } from "react";

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { fetchUser } from "../../utils/UserManager";
import CopyButton from "./CopyButton";

const REACT_FRONTEND_URL = import.meta.env.VITE_REACT_FRONTEND_URL;
const DISABLE_ELEMENT_CITATION =
  import.meta.env.VITE_DISABLE_ELEMENT_CITATION === "true";

export default function CitationGenerator(props) {
  const contributorId = props.contributorId;
  const createdAt = props.createdAt ? props.createdAt.substring(0, 4) : "";
  const title = props.title;
  const elementType = props.elementType;
  const elementId = props.elementId;

  const [contributorFirstNameInitial, setContributorFirstNameInitial] =
    useState("");
  const [contributorLastName, setContributorLastName] = useState("");
  const [contributorInfoLoading, setContributorInfoLoading] = useState(true);

  useEffect(() => {
    async function getContributorInfo(uid) {
      const user = await fetchUser(uid);

      setContributorFirstNameInitial(
        user["first-name"] ? user["first-name"][0] : ""
      );
      setContributorLastName(user["last-name"]);
      setContributorInfoLoading(false);
    }
    getContributorInfo(contributorId);
  }, [contributorId]);

  if (contributorInfoLoading) {
    return null;
  }

  const citation = `${contributorLastName}, ${contributorFirstNameInitial}. (${createdAt}). ${title}, I-GUIDE Platform, `;
  const elementUrl = `${REACT_FRONTEND_URL}/${elementType}/${elementId}`;

  // Temporarily disable element citations
  if (DISABLE_ELEMENT_CITATION) {
    return;
  }

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography level="h5" fontWeight="lg" mb={1}>
          Cite this element
        </Typography>
        <CopyButton
          textToCopy={citation + elementUrl}
          tooltipText="Copy citation"
          successText="Citation copied!"
          icon={<ContentCopyIcon />}
        />
      </Stack>
      <Typography level="body-sm">
        {citation}
        <Link href={elementUrl} target="_blank" rel="noopener noreferrer">
          {elementUrl}
        </Link>
      </Typography>
    </Stack>
  );
}
