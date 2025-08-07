import axiosInstance from "./axiosInstance";

// getUserInfo benutzt dieselbe Instanz
export const getUserInfo = async (userId) => {
  const res = await axiosInstance.get(`/users/${userId}`);
  return res.data;
};

export const updateUserInfo = async ({
  userId,
  isAdmin,
  updatedFields,
  token,
}) => {
  const payload = {
    ...updatedFields,
    userId,
    isAdmin,
  };

  const response = await axiosInstance.put(`/users/${userId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
