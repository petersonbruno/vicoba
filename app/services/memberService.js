import api from "../lib/apiClient";

export const getMembers = async () => {
  const res = await api.get("members/list/");
  return res.data;
};

export const addMember = async (payload) => {
  const res = await api.post("members/add/", payload);
  return res.data;
};
