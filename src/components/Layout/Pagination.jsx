import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Stack from "@mui/joy/Stack";

import MUIPagination from "@mui/material/Pagination";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Pagination(props) {
  const count = props.count;
  const color = props.color;
  const page = props.page;
  const onChange = props.onChange;

  if (count <= 1) {
    return null;
  }

  function handlePrevious(event) {
    if (page > 1) {
      onChange(event, page - 1);
    }
  }

  function handleNext(event) {
    if (page < count) {
      onChange(event, page + 1);
    }
  }

  function handleSelectChange(event, value) {
    // value is the selected page number as a string
    const selectedPage = parseInt(value, 10);
    onChange(event, selectedPage);
  }

  return (
    <>
      {/* Pagination for narrow screen */}
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="plain"
            color={color}
            size="sm"
            onClick={handlePrevious}
            disabled={page === 1}
            startDecorator={<ChevronLeftIcon />}
          >
            Previous
          </Button>

          <Select
            color={color}
            variant="plain"
            value={page.toString()}
            onChange={handleSelectChange}
            size="sm"
            sx={{ minWidth: 60 }}
          >
            {Array.from({ length: count }, (_, i) => (
              <Option key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </Option>
            ))}
          </Select>

          <Button
            variant="plain"
            color={color}
            size="sm"
            onClick={handleNext}
            disabled={page === count}
            endDecorator={<ChevronRightIcon />}
          >
            Next
          </Button>
        </Stack>
      </Box>
      {/* Pagenation for wide screen */}
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
      >
        <MUIPagination
          count={count}
          color={color}
          page={page}
          onChange={onChange}
        />
      </Box>
    </>
  );
}
