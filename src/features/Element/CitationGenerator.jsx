import React, { useState, useEffect } from "react";

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";

import { fetchUser } from "../../utils/UserManager";

const REACT_FRONTEND_URL = import.meta.env.VITE_REACT_FRONTEND_URL;

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

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography level="h4" fontWeight="lg" mb={1}>
        Cite this element
      </Typography>
      <Typography level="body-sm">
        {citation}
        <Link href={elementUrl} target="_blank" rel="noopener noreferrer">
          {elementUrl}
        </Link>
      </Typography>
    </Stack>
  );
}
