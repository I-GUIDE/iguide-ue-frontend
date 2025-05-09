import { useEffect, useState } from "react";

import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import ButtonGroup from "@mui/joy/ButtonGroup";
import IconButton from "@mui/joy/IconButton";
import { styled } from "@mui/joy/styles";

import Add from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const universalFieldProperties = [
  {
    name: "contributor",
    type: "",
    dataType: "string",
    isSortable: false,
  },
  {
    name: "contents",
    type: "",
    dataType: "string",
    isSortable: false,
  },
  {
    name: "title",
    type: "",
    dataType: "string",
    isSortable: true,
  },
  {
    name: "authors",
    type: "array",
    dataType: "string",
    isSortable: true,
  },
  {
    name: "tags",
    type: "array",
    dataType: "string",
    isSortable: false,
  },
  {
    name: "spatial-coverage",
    type: "array",
    dataType: "string",
    isSortable: false,
    placeholder:
      "Ex. Pembroke; Honolulu County All Jurisdictions, Honolulu County, Hawaii",
  },
  {
    name: "spatial-index-year",
    type: "array",
    dataType: "date",
    isSortable: false,
    placeholder: "Ex. 2014",
  },
  {
    name: "spatial-temporal-coverage",
    type: "array",
    dataType: "date",
    isSortable: false,
    placeholder: "Ex. 09/12/2014",
  },
  {
    name: "spatial-georeferenced",
    type: "",
    dataType: "bool",
    isSortable: false,
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
            {f.name}
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
  setRanking,
}) {
  const [adtlFields, setAdtlFields] = useState([{ type: {}, query: "" }]);
  const [orderBy, setOrderBy] = useState("");
  const [sortBy, setSortBy] = useState("");

  function handleResetAdvancedSearch() {
    setAdtlFields([{ type: {}, query: "" }]);
    setOrderBy("desc");
    setSortBy("_score");

    handleChangeAdtlFields([{ type: {}, query: "" }]);
    setRanking({
      sortBy: "_score",
      order: "desc",
    });

    const defaultFields = [{ type: {}, query: "" }];
    const defaultSortBy = "_score";
    const defaultOrder = "desc";

    sessionStorage.setItem(
      "advanced_search",
      JSON.stringify({
        adtlFields: defaultFields,
        sortBy: defaultSortBy,
        orderBy: defaultOrder,
      })
    );

    onClose();
  }

  function handleSaveAdvancedSearch() {
    const currentFields = [...adtlFields];
    const currentSortBy = sortBy || "_score";
    const currentOrder = orderBy || "desc";

    handleChangeAdtlFields(currentFields);
    setRanking({
      sortBy: currentSortBy,
      order: currentOrder,
    });

    sessionStorage.setItem(
      "advanced_search",
      JSON.stringify({
        adtlFields: currentFields,
        sortBy: currentSortBy,
        orderBy: currentOrder,
      })
    );

    onClose();
  }

  // Retrieve advanced search configuration from sessionStorage
  useEffect(() => {
    const filters = JSON.parse(sessionStorage.getItem("advanced_search"));
    if (filters) {
      setOrderBy(filters.orderBy);
      setSortBy(filters.sortBy);
      setAdtlFields(filters.adtlFields);
    }
  }, []);

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{ width: "fit-content", borderRadius: "md", p: 3, boxShadow: "lg" }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          sx={{ fontWeight: "lg", mb: 2 }}
        >
          Advanced Search
        </Typography>
        <form>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <FormControl>
                <FormLabel>Sort By</FormLabel>
                <Select
                  sx={{ width: "200px" }}
                  value={sortBy}
                  onChange={(e, newValue) => setSortBy(newValue)}
                >
                  {universalFieldProperties
                    .filter((field) => field.isSortable)
                    .map((f, key) => (
                      <Option value={f.name} key={key}>
                        {f.name}
                      </Option>
                    ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Order By</FormLabel>
                <Select
                  sx={{ width: "200px" }}
                  value={orderBy}
                  onChange={(e, newValue) => setOrderBy(newValue)}
                >
                  <Option value="asc">asc</Option>
                  <Option value="desc">desc</Option>
                </Select>
              </FormControl>
            </Stack>
            <Stack>
              <Typography level="title-sm">Additional Fields</Typography>
              {adtlFields.map((field, index) => (
                <AdditionalField
                  key={index}
                  fieldTypes={universalFieldProperties}
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
      </Sheet>
    </Modal>
  );
}
