import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Divider from "@mui/joy/Divider";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Add from "@mui/icons-material/Add";
import IconButton from "@mui/joy/IconButton";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { styled } from "@mui/joy/styles";

import { useState } from "react";

export default function AdvancedSearch({ open, onClose }) {
  const [adtlFields, setAdtlFields] = useState([{ type: "", query: "" }]);

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
                <FormLabel>Element Type</FormLabel>
                <Select sx={{ width: "200px" }}>
                  <Option>Something</Option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Order By</FormLabel>
                <Select sx={{ width: "200px" }}>
                  <Option>Something</Option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Sort By</FormLabel>
                <Select sx={{ width: "200px" }}>
                  <Option>Something</Option>
                </Select>
              </FormControl>
            </Stack>
            <Stack>
              <Typography level="title-sm">Additional Fields</Typography>
              {adtlFields.map((field, index) => (
                <AdditionalField
                  fieldTypes={["title", "authors", "contributors"]}
                  field={field}
                  isDisabled={adtlFields.length === 1}
                  onChange={(updatedField) => {
                    const updatedFields = [...adtlFields];
                    updatedFields[index] = updatedField;
                    setAdtlFields(updatedFields);
                  }}
                />
              ))}
              <AddButton
                startDecorator={<Add />}
                onClick={() =>
                  setAdtlFields([...adtlFields, { type: "", query: "" }])
                }
                variant="plain"
                sx={{
                  width: "fit-content",
                  padding: "0 5px",
                }}
                disabled={
                  adtlFields[adtlFields.length - 1].type === "" ||
                  adtlFields[adtlFields.length - 1].query === ""
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
            <Button color="primary" variant="solid">
              Save
            </Button>
            <Button color="primary" variant="outlined">
              Reset
            </Button>
          </ButtonGroup>
        </form>
      </Sheet>
    </Modal>
  );
}

function AdditionalField({ fieldTypes, isDisabled, onChange, field }) {
  const handleFieldChange = (e, newValue) => {
    onChange({ ...field, type: newValue });
  };

  const handleQueryChange = (e) => {
    onChange({ ...field, query: e.target.value });
  };

  return (
    <Stack direction="row" spacing={2} mt={1}>
      <Select
        sx={{ width: "150px" }}
        value={field.type}
        onChange={handleFieldChange}
      >
        {fieldTypes.map((type, key) => (
          <Option value={type} key={key}>
            {type}
          </Option>
        ))}
      </Select>
      <Input
        key="search"
        variant="outlined"
        placeholder="Order By"
        value={field.query}
        onChange={handleQueryChange}
        type="text"
        sx={{
          minWidth: "300px",
        }}
      />
      <IconButton disabled={isDisabled}>
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
