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
import { styled } from "@mui/joy/styles";

export default function AdvancedSearch({ open, onClose }) {
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
                <Input
                  key="search"
                  variant="outlined"
                  placeholder="Order By"
                  type="text"
                  sx={{
                    minWidth: "200px",
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Order By</FormLabel>
                <Input
                  key="search"
                  variant="outlined"
                  placeholder="Order By"
                  type="text"
                  sx={{
                    minWidth: "200px",
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Sort By</FormLabel>
                <Input
                  key="search"
                  variant="outlined"
                  placeholder="Order By"
                  type="text"
                  sx={{
                    minWidth: "200px",
                  }}
                />
              </FormControl>
            </Stack>
            <Stack>
              <Typography level="title-sm">Additional Fields</Typography>
              <Stack direction="row" spacing={2} mt={1}>
                <Select sx={{ width: "150px" }}>
                  <Option>Something</Option>
                </Select>
                <Input
                  key="search"
                  variant="outlined"
                  placeholder="Order By"
                  type="text"
                  sx={{
                    minWidth: "300px",
                  }}
                />
              </Stack>
              <AddButton
                startDecorator={<Add />}
                variant="plain"
                sx={{
                  width: "fit-content",
                  padding: "0 5px",
                }}
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

const AddButton = styled(Button)`
  &:hover {
    background-color: transparent;
  }
`;
