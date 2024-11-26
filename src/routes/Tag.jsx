import React from "react";
import { useParams } from "react-router";

import { stringTruncator } from "../helpers/helper";
import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../features/ElementGrid/ElementGridLayout";

export default function Tag() {
  const tagName = useParams().id;
  const displayTagName = stringTruncator(tagName, 0, 25);

  usePageTitle(tagName);

  return (
    <ElementGridLayout
      fieldName="tags"
      matchValue={[tagName]}
      title={"#" + displayTagName}
      pageNavName={"Tag: " + displayTagName}
      showElementType
    />
  );
}
