export const fixUsername = async (username) => {
  return username.replace(/\s+/g, "_").replace(/[^\w\s]/gi, "");
};
