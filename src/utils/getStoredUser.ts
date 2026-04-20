export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

export const getIsAdmin = () => getStoredUser()?.role === "ADMIN";
