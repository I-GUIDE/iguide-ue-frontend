import { useEffect, useState } from "react";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import ButtonGroup from "@mui/joy/ButtonGroup";
import IconButton from "@mui/joy/IconButton";
import { styled } from "@mui/joy/styles";

import Add from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const additionalFieldProperties = [
  {
    displayName: "Contributor",
    name: "contributor",
    type: "",
    dataType: "string",
  },
  {
    displayName: "Contents",
    name: "contents",
    type: "",
    dataType: "string",
  },
  {
    displayName: "Title",
    name: "title",
    type: "",
    dataType: "string",
  },
  {
    displayName: "Authors",
    name: "authors",
    type: "array",
    dataType: "string",
  },
  {
    displayName: "Tags",
    name: "tags",
    type: "array",
    dataType: "string",
  },
  {
    displayName: "Spatial Coverage",
    name: "spatial-coverage",
    type: "array",
    dataType: "string",
    placeholder:
      "Ex. Pembroke; Honolulu County All Jurisdictions, Honolulu County, Hawaii",
  },
  {
    displayName: "Index Year",
    name: "spatial-index-year",
    type: "array",
    dataType: "date",
    placeholder: "Ex. 2014",
  },
  {
    displayName: "Temporal Coverage",
    name: "spatial-temporal-coverage",
    type: "array",
    dataType: "date",
    placeholder: "Ex. 09/12/2014",
  },
  {
    displayName: "Georeferenced",
    name: "spatial-georeferenced",
    type: "",
    dataType: "bool",
    placeholder: "Ex. true/false",
  },
];

function AdditionalField({
  fieldTypes,
  isDisabled,
  onChange,
  field,
  removeField,
}) {
  const selectedIndex = fieldTypes.findIndex(
    (f) => f.name === field.type?.name
  );

  const handleFieldChange = (e, newValue) => {
    const selectedType = fieldTypes[newValue];
    onChange({
      type: selectedType,
      query: "",
    });
  };

  const handleQueryChange = (e) => {
    onChange({ ...field, query: e.target.value });
  };

  return (
    <Stack direction="row" spacing={2} mt={1}>
      <Select
        sx={{ width: "250px" }}
        value={selectedIndex !== -1 ? selectedIndex : null}
        onChange={handleFieldChange}
        placeholder="Select Field"
      >
        {fieldTypes.map((f, key) => (
          <Option value={key} key={key}>
            {f.displayName}
          </Option>
        ))}
      </Select>

      <Input
        key="search"
        variant="outlined"
        placeholder={field.type.placeholder}
        value={field.query}
        onChange={handleQueryChange}
        type="text"
        sx={{
          minWidth: "300px",
        }}
      />
      <IconButton disabled={isDisabled} onClick={removeField}>
        <RemoveCircleOutlineIcon color={isDisabled ? "disabled" : "error"} />
      </IconButton>
    </Stack>
  );
}

const AddButton = styled(Button)`
  &:hover {
    background-color: transparent;
  }
`;

export default function AdvancedSearch({
  open,
  onClose,
  handleChangeAdtlFields,
}) {
  const [adtlFields, setAdtlFields] = useState([{ type: {}, query: "" }]);

  function handleResetAdvancedSearch() {
    setAdtlFields([{ type: {}, query: "" }]);
    handleChangeAdtlFields([{ type: {}, query: "" }]);
    const defaultFields = [{ type: {}, query: "" }];

    sessionStorage.setItem(
      "advanced_search",
      JSON.stringify({
        adtlFields: defaultFields,
      })
    );

    onClose();
  }

  function handleSaveAdvancedSearch() {
    const currentFields = [...adtlFields];
    handleChangeAdtlFields(currentFields);

    sessionStorage.setItem(
      "advanced_search",
      JSON.stringify({
        adtlFields: currentFields,
      })
    );

    onClose();
  }

  // Retrieve advanced search configuration from sessionStorage
  useEffect(() => {
    const filters = JSON.parse(sessionStorage.getItem("advanced_search"));
    if (filters) {
      setAdtlFields(filters.adtlFields);
    }
  }, []);

  return (
    <Box
      sx={{
        overflow: "hidden",
        transition: "max-height 0.3s ease, opacity 0.3s ease",
        maxHeight: open ? 500 : 0,
        opacity: open ? 1 : 0,
      }}
    >
      <Box
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "neutral.outlinedBorder",
          borderRadius: "lg",
          bgcolor: "background.level1",
        }}
      >
        <Typography
          id="modal-title"
          level="title-md"
          textColor="inherit"
          sx={{ mb: 2 }}
        >
          Additional Filters (Beta)
        </Typography>
        <form>
          <Stack spacing={2}>
            {adtlFields.map((field, index) => (
              <AdditionalField
                key={index}
                fieldTypes={additionalFieldProperties}
                field={field}
                isDisabled={adtlFields.length === 1}
                onChange={(updatedField) => {
                  const updatedFields = [...adtlFields];
                  updatedFields[index] = updatedField;
                  setAdtlFields(updatedFields);
                }}
                removeField={() => {
                  const newFields = [...adtlFields];
                  newFields.splice(index, 1);
                  setAdtlFields(
                    newFields.length ? newFields : [{ type: {}, query: "" }]
                  );
                }}
              />
            ))}
            <AddButton
              startDecorator={<Add />}
              onClick={() =>
                setAdtlFields([...adtlFields, { type: {}, query: "" }])
              }
              variant="plain"
              sx={{
                width: "fit-content",
                padding: "0 5px",
              }}
              disabled={
                Object.keys(adtlFields[adtlFields.length - 1].type).length ===
                  0 || adtlFields[adtlFields.length - 1].query === ""
              }
            >
              Add another
            </AddButton>
          </Stack>

          <ButtonGroup
            spacing="0.5rem"
            aria-label="spacing button group"
            sx={{
              marginTop: "40px",
            }}
          >
            <Button
              color="primary"
              variant="solid"
              onClick={handleSaveAdvancedSearch}
            >
              Save
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleResetAdvancedSearch}
            >
              Reset
            </Button>
          </ButtonGroup>
        </form>
      </Box>
    </Box>
  );
}
