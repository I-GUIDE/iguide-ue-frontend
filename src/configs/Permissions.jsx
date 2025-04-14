// The number means the highest user role number (included) that is
//  allowed to perform indicated tasks
export const PERMISSIONS = {
  secure_default_role: 100,
  default_user: 10,
  contribute: 8,
  edit_oer: 4,
  edit_map: 4,
  access_llm: 4,
  edit_all: 3,
  super_admin: 1,
};

export const PERMISSION_DETAIL = {
  1: {
    role_name: "Super Admin",
    description: "You have all permissions and privileges.",
  },
  2: {
    role_name: "Admin",
    description: "You have all permissions EXCEPT user management.",
  },
  3: {
    role_name: "Moderator",
    description: "You have all permissions EXCEPT user management.",
  },
  4: {
    role_name: "Trusted User Plus",
    description: "You can contribute to all types of elements.",
  },
  8: {
    role_name: "Trusted User",
    description:
      "You can contribute datasets, notebooks, publications, and code.",
  },
  10: {
    role_name: "User",
    description:
      "You don't have contribution access yet. Please log in with your school or institute email to enable it. If you believe this is incorrect, please contact us.",
  },
};
