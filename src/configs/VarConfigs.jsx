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

export const ELEMENT_TYPE_CAP = {
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

export const ELEMENT_TYPE_CAP_PLURAL = {
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

export const ELEMENT_TYPE_URI = {
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

export const ELEMENT_TYPE_URI_PLURAL = {
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

export const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024;
export const USER_UPLOAD_DATASET_SIZE_LIMIT = 2 * 1024 * 1024 * 1024;

export const NAVBAR_HEIGHT = 70;
export const HEADER_HEIGHT = 280 + NAVBAR_HEIGHT;
export const FOOTER_HEIGHT = 150;
export const USER_PROFILE_HEADER_HEIGHT = 365 + NAVBAR_HEIGHT;
export const SEARCH_RESULTS_HEADER_HEIGHT = 250 + NAVBAR_HEIGHT;
export const HOME_SEARCH_SEC_HEIGHT = 300 + NAVBAR_HEIGHT;

export const DEFAULT_BODY_HEIGHT = `calc(100vh - ${
  HEADER_HEIGHT + FOOTER_HEIGHT
}px)`;
export const NO_HEADER_BODY_HEIGHT = `calc(100vh - ${FOOTER_HEIGHT}px)`;
export const USER_PROFILE_BODY_HEIGHT = `calc(100vh - ${
  USER_PROFILE_HEADER_HEIGHT + FOOTER_HEIGHT
}px)`;
export const SEARCH_RESULTS_BODY_HEIGHT = `calc(100vh - ${
  SEARCH_RESULTS_HEADER_HEIGHT + FOOTER_HEIGHT
}px)`;

// This is used for offsetting navbar height for the following contents
export const PT_OFFSET = NAVBAR_HEIGHT / 8 + 4;

export const ACCEPTED_IMAGE_TYPES =
  "image/gif, image/jpg, image/jpeg, image/png, image/webp, image/tiff";

export const ACCEPTED_DATASET_TYPES =
  ".shp, .shx, .dbf, .prj, .geojson, .json, .kml, .kmz, .gpkg, .gdb, .dxf, .dwg, .csv, .zip";
