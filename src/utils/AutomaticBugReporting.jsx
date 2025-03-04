const VITE_SLACK_API_URL = import.meta.env.VITE_SLACK_API_URL;
const VITE_SEND_ERR_TO_SLACK =
  import.meta.env.VITE_SEND_ERR_TO_SLACK === "true";
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

// Function that sends "message" to the defined Slack channel
export async function sendMessageToSlack(message) {
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
              text: `*${message}*\n`,
            },
          },
        ],
      }),
    }
  );

  return res;
}
