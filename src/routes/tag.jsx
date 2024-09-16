import React from "react";
import { useParams } from "react-router-dom";

import TagIcon from "@mui/icons-material/Tag";

import { stringTruncator } from "../helpers/helper";
import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../layouts/ElementGridLayout";

export default function Tag() {
  const tagName = useParams().id;
  const displayTagName = stringTruncator(tagName, 0, 25);

  usePageTitle(tagName);

  return (
    <ElementGridLayout
      fieldName="tags"
      matchValue={[tagName]}
      title={'Tag: "' + displayTagName + '"'}
      pageNavName={'Tag: "' + displayTagName + '"'}
      icon={<TagIcon />}
      showElementType
    />
  );
}
