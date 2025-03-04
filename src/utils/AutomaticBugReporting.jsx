const VITE_SLACK_API_URL = import.meta.env.VITE_SLACK_API_URL;

// Function that sends "message" to the defined Slack channel
export async function sendMessageToSlack(message) {
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
