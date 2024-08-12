import React from "react";
import { useParams } from "react-router-dom";

import ElementList from "../components/ElementList";
import { stringTruncator } from "../helpers/helper";
import usePageTitle from "../hooks/usePageTitle";

export default function Tag() {
  const tagName = useParams().id;
  const displayTagName = stringTruncator(tagName, 0, 25);

  usePageTitle(tagName);

  return (
    <ElementList
      fieldName="tags"
      matchValue={[tagName]}
      title={'Tag: "' + displayTagName + '"'}
      subtitle=""
    />
  );
}
