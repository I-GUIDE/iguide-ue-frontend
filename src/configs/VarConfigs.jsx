export const RESOURCE_TYPE_COLORS = {
  dataset: "primary",
  datasets: "primary",
  notebook: "success",
  notebooks: "success",
  publication: "warning",
  publications: "warning",
  oer: "danger",
  oers: "danger",
  map: "neutral",
  maps: "neutral",
  code: "success",
  codes: "success",
  any: "neutral",
};

export const RESOURCE_TYPE_NAMES = {
  dataset: "Dataset",
  datasets: "Dataset",
  notebook: "Notebook",
  notebooks: "Notebook",
  publication: "Publication",
  publications: "Publication",
  oer: "Educational Resource",
  oers: "Educational Resource",
  map: "Map",
  maps: "Map",
  code: "Code",
  codes: "Code",
  any: "All Types",
};

export const RESOURCE_TYPE_NAMES_PLURAL = {
  dataset: "Datasets",
  datasets: "Datasets",
  notebook: "Notebooks",
  notebooks: "Notebooks",
  publication: "Publications",
  publications: "Publications",
  oer: "Educational Resources",
  oers: "Educational Resources",
  map: "Maps",
  maps: "Maps",
  code: "Code",
  codes: "Code",
  any: "All Types",
};

export const RESOURCE_TYPE_NAMES_FOR_URI = {
  dataset: "dataset",
  datasets: "dataset",
  notebook: "notebook",
  notebooks: "notebook",
  publication: "publication",
  publications: "publication",
  oer: "oer",
  oers: "oer",
  map: "map",
  maps: "map",
  code: "code",
  codes: "code",
};

export const RESOURCE_TYPE_NAMES_PLURAL_FOR_URI = {
  dataset: "datasets",
  datasets: "datasets",
  notebook: "notebooks",
  notebooks: "notebooks",
  publication: "publications",
  publications: "publications",
  oer: "oers",
  oers: "oers",
  map: "maps",
  maps: "maps",
  code: "code",
  codes: "code",
};

export const OER_EXTERNAL_LINK_TYPES = {
  slides: "Slides",
  bok: "Body of Knowledge",
  oer: "Open Edu Res",
  course: "Course",
  webpage: "Webpage",
};

export const UNTRUSTED_AFFILIATIONS = [
  "google",
  "github",
  "microsoft",
  "orcid",
];

export const ELEM_VISIBILITY = Object.freeze({
  private: "private",
  public: "public",
});

export const IMAGE_SIZE_LIMIT = 5000000;

export const NAVBAR_HEIGHT = 70;
export const HEADER_HEIGHT = 280;
export const FOOTER_HEIGHT = 150;
export const USER_PROFILE_HEADER_HEIGHT = 365;
export const SEARCH_RESULTS_HEADER_HEIGHT = 250;
export const HOME_SEARCH_SEC_HEIGHT = "300px";

export const DEFAULT_BODY_HEIGHT = `calc(100vh - ${
  NAVBAR_HEIGHT + HEADER_HEIGHT + FOOTER_HEIGHT
}px)`;
export const NO_HEADER_BODY_HEIGHT = `calc(100vh - ${
  NAVBAR_HEIGHT + FOOTER_HEIGHT
}px)`;
export const USER_PROFILE_BODY_HEIGHT = `calc(100vh - ${
  NAVBAR_HEIGHT + USER_PROFILE_HEADER_HEIGHT + FOOTER_HEIGHT
}px)`;
export const SEARCH_RESULTS_BODY_HEIGHT = `calc(100vh - ${
  NAVBAR_HEIGHT + SEARCH_RESULTS_HEADER_HEIGHT + FOOTER_HEIGHT
}px)`;

export const ACCEPTED_IMAGE_TYPES =
  "image/gif, image/jpg, image/jpeg, image/png, image/webp, image/tiff";
