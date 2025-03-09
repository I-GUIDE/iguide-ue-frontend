const VITE_SLACK_API_URL = import.meta.env.VITE_SLACK_API_URL;
const VITE_SEND_ERR_TO_SLACK =
  import.meta.env.VITE_SEND_ERR_TO_SLACK === "true";
const VITE_SEND_CONTACT_FORM_TO_SLACK =
  import.meta.env.VITE_SEND_CONTACT_FORM_TO_SLACK === "true";
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

// Function that sends bug report to the defined Slack channel
export async function sendBugToSlack(message) {
  if (!VITE_SEND_ERR_TO_SLACK) {
    TEST_MODE &&
      console.log("Sending errors to Slack disabled... Message:", message);
    return;
  }

  const res = await fetch(
    `https://hooks.slack.com/services/${VITE_SLACK_API_URL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Automatic bug report:\n${message}\n`,
            },
          },
        ],
      }),
    }
  );

  return res;
}

// Function that sends contact form message to the defined Slack channel
export async function sendMessageToSlack(message) {
  if (!VITE_SEND_CONTACT_FORM_TO_SLACK) {
    TEST_MODE &&
      console.log(
        "Sending contact form to Slack disabled... Message:",
        message
      );
    return;
  }

  const res = await fetch(
    `https://hooks.slack.com/services/${VITE_SLACK_API_URL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Contact Form from users:\n${message}\n`,
            },
          },
        ],
      }),
    }
  );

  return res;
}
