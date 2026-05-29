import api from "./api";

const STORAGE_KEY = "user_profile_data";

const readLocalProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
};

const saveLocalProfile = (profile) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
};

export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    const localProfile = readLocalProfile();
    return {
      ...response.data.user,
      phone: localProfile?.phone || "",
      address: localProfile?.address || "",
    };
  } catch {
    return readLocalProfile();
  }
};

export const updateProfile = async (profile) => {
  try {
    const response = await api.put("/auth/profile", profile);
    const updated = {
      ...response.data.user,
      phone: profile.phone || "",
      address: profile.address || "",
    };
    return saveLocalProfile(updated);
  } catch {
    return saveLocalProfile(profile);
  }
};
