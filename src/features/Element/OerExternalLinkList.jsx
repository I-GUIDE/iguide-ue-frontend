import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Link from "@mui/joy/Link";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function OerExternalLinkList(props) {
  const oerExternalLinks = props.oerExternalLinks;

  if (!Array.isArray(oerExternalLinks) || oerExternalLinks.length === 0) {
    return null;
  }

  // Group different external links based on types
  const slides = [];
  const boks = [];
  const oers = [];
  const courses = [];
  const webpages = [];
  const others = [];

  for (const idx in oerExternalLinks) {
    const item = oerExternalLinks[idx];

    switch (item.type) {
      case "slides":
        slides.push(item);
        break;
      case "bok":
        boks.push(item);
        break;
      case "oer":
        oers.push(item);
        break;
      case "course":
        courses.push(item);
        break;
      case "webpage":
        webpages.push(item);
        break;
      default:
        others.push(item);
        TEST_MODE && console.log(`OER external link type unknown: ${item}`);
    }
  }

  // Display a list for each type when available
  function ExternalSubList(props) {
    const title = props.title;
    const list = props.list;

    if (list.length === 0) {
      return null;
    }

    return (
      <List marker="disc">
        <ListItem>
          <Typography level="title-md">{title}</Typography>
        </ListItem>
        <List marker="circle">
          <Stack>
            {list?.map((item, idx) => (
              <Link
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
                href={item.url}
                sx={{ color: "text.tertiary" }}
              >
                <ListItem>
                  <Typography level="body-md">{item.title}</Typography>
                </ListItem>
              </Link>
            ))}
          </Stack>
        </List>
      </List>
    );
  }

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography id="" level="h5" fontWeight="lg" mb={1}>
        Additional Materials
      </Typography>
      <Stack>
        <ExternalSubList title="Slides" list={slides} />
        <ExternalSubList title="Body of Knowledge" list={boks} />
        <ExternalSubList title="Open Educational Resources" list={oers} />
        <ExternalSubList title="Courses" list={courses} />
        <ExternalSubList title="Webpages" list={webpages} />
        <ExternalSubList title="Others" list={others} />
      </Stack>
    </Stack>
  );
}
