const DEMO_USERID = import.meta.env.VITE_DEMO_USERID;
const DEMO_USER_ROLE = parseInt(import.meta.env.VITE_DEMO_USER_ROLE);

export const demoUser = {
  affiliation: "I-GUIDE",
  avatar_url: {
    original: "/images/Logo.png",
    low: "/images/Logo.png",
    high: "/images/Logo.png",
  },
  bio: "NSF I-GUIDE enhances STEM participation for underserved populations through innovative education and community partnerships.",
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
      firstName: "Happy",
      email: "happy.person@example.com",
      lastName: "Person",
      openid: "http://cilogon.org/serverE/users/do-not-use",
      affiliation: "I-GUIDE",
      isPrimary: true,
    },
    {
      firstName: "Joyful",
      email: "joyful.human@example.com",
      lastName: "Human",
      openid: "http://cilogon.org/serverD/users/do-not-use2",
      affiliation: "NSF",
      isPrimary: false,
    },
  ],
};
