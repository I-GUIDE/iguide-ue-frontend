import React from "react";
import { useParams } from "react-router-dom";

import ElementList from "../components/ElementList";
import { stringTruncator } from "../helpers/helper";

export default function Tag() {
  const tagName = useParams().id;
  const displayTagName = stringTruncator(tagName, 0, 25);

  return (
    <ElementList
      fieldName="tags"
      matchValue={[tagName]}
      title={'Tag: "' + displayTagName + '"'}
      subtitle=""
    />
  );
}
