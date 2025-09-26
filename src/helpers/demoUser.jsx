const DEMO_USERID = import.meta.env.VITE_DEMO_USERID;
const DEMO_USER_ROLE = parseInt(import.meta.env.VITE_DEMO_USER_ROLE);

export const demoUser = {
  affiliation: "I-GUIDE",
  avatar_url: {
    original: "/images/Logo.png",
    low: "/images/Logo.png",
    high: "/images/Logo.png",
  },
  bio: `The I-GUIDE Platform provides an open science and collaborative environment 
    for geospatial data-intensive convergence research and education focused on sustainability 
    and resilience challenges and enabled by advanced cyberGIS and cyberinfrastructure.`,
  email: "happy.person@example.com",
  auth_first_name: "Happy",
  auth_last_name: "Person",
  first_name: "Personne",
  last_name: "Heureuse",
  openid: "http://cilogon.org/serverE/users/do-not-use",
  id: DEMO_USERID,
  role: DEMO_USER_ROLE,
  gitHubLink: "https://github.com",
  linkedInLink: "https://linkedin.com",
  googleScholarLink: "https://scholar.google.com",
  personalWebsiteLink: "https://i-guide.io",
  createdAt: "2024-07-04T00:00:00.000Z",
  aliases: [
    {
      "first-name": "Happy",
      email: "happy.person@example.com",
      "last-name": "Person",
      openid: "http://cilogon.org/serverE/users/do-not-use",
      affiliation: "I-GUIDE",
      "is-primary": true,
    },
    {
      "first-name": "Joyful",
      email: "joyful.human@example.com",
      "last-name": "Human",
      openid: "http://cilogon.org/serverD/users/do-not-use2",
      affiliation: "National Science Foundation (NSF)",
      "is-primary": false,
    },
  ],
};
