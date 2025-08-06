// The number means the highest user role number (included) that is
//  allowed to perform indicated tasks
export const PERMISSIONS = {
  secure_default_role: 100,
  default_user: 10,
  contribute: 8,
  display_hpc: 5,
  edit_oer: 5,
  access_llm: 8,
  access_jupyterhub: 8,
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
    role_name: "Core Contributor",
    description: "You can contribute to all types of elements.",
  },
  5: {
    role_name: "Trusted User Plus",
    description:
      "You can contribute maps, datasets, notebooks, publications, eduactional resources, and code. You can access I-GUIDE JupyterHub. You also have access to our Smart Search feature powered by large language models. If you use ACCESS to log in, you will have access to Anvil HPC.",
  },
  8: {
    role_name: "Trusted User",
    description:
      "You can contribute maps, datasets, notebooks, publications, and code. You can access I-GUIDE JupyterHub. You also have access to our Smart Search feature powered by large language models.",
  },
  10: {
    role_name: "User",
    description:
      "You don't have contribution access yet. Please log in with your academic email to enable it. If you believe this is incorrect, please contact us.",
  },
};
