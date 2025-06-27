import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";

//Register

export const registerUser = async (body) => {
  const hashedPassword = bcrypt.hashSync(body.password, 10);
  const newUser = new UserModel({
    username: body.username,
    email: body.email,
    password: hashedPassword,
  });

  await newUser.save();
  return newUser;
};

//Login
export const loginUser = async (body) => {
  const identifier = body.email || body.username;

  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const { password, ...data } = user._doc;
  return { user: data, message: "Login successful" };
};

/* export const getUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const updateUser = async (id, body) => {
  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      username: body.username,
      email: body.email,
      password: body.password ? bcrypt.hashSync(body.password, 10) : undefined,
    },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const deleteUser = async (id) => {
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) {
    throw new Error("User not found");
  }
  return { message: "User deleted successfully" };
};

export const getAllUsers = async () => {
  const users = await UserModel.find();
  return users.map((user) => {
    const { password, ...data } = user._doc;
    return data;
  });
};

export const getUserByUsername = async (username) => {
  const user = await UserModel.findOne({
    username: username,
  });
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const followUser = async (userId, targetUserId) => {
  const user = await UserModel.findById(userId);
  const targetUser = await UserModel.findById(targetUserId);
  if (!user || !targetUser) {
    throw new Error("User or target user not found");
  }
  if (user.following.includes(targetUserId)) {
    throw new Error("You are already following this user");
  }
  user.following.push(targetUserId);
  targetUser.followers.push(userId);
  await user.save();
  await targetUser.save();
  return { message: "User followed successfully" };
};
export const unfollowUser = async (userId, targetUserId) => {
  const user = await UserModel.findById(userId);
  const targetUser = await UserModel.findById(targetUserId);
  if (!user || !targetUser) {
    throw new Error("User or target user not found");
  }
  if (!user.following.includes(targetUserId)) {
    throw new Error("You are not following this user");
  }
  user.following = user.following.filter(
    (id) => id.toString() !== targetUserId
  );
  (targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== userId
  )),
    await user.save();
  await targetUser.save();
  return { message: "User unfollowed successfully" };
};
export const getFollowers = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const followers = await UserModel.find({ _id: { $in: user.followers } });
  return followers.map((follower) => {
    const { password, ...data } = follower._doc;
    return data;
  });
};

export const getFollowing = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const following = await UserModel.find({ _id: { $in: user.following } });
  return following.map((followed) => {
    const { password, ...data } = followed._doc;
    return data;
  });
};

export const searchUsers = async (query) => {
  const regex = new RegExp(query, "i");
  const users = await UserModel.find({
    $or: [{ username: regex }, { email: regex }],
  });
  return users.map((user) => {
    const { password, ...data } = user._doc;
    return data;
  });
};

export const getUserProfile = async (username) => {
  const user = await UserModel.findOne({
    username: username,
  });
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const updateProfilePicture = async (userId, profilePicture) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { profilePicture: profilePicture },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const updateCoverPicture = async (userId, coverPicture) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { coverPicture: coverPicture },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const updateBio = async (userId, bio) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { bio: bio },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateLocation = async (userId, location) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { location: location },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateWebsite = async (userId, website) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { website: website },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const updateSocialLinks = async (userId, socialLinks) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { socialLinks: socialLinks },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const updateInterests = async (userId, interests) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { interests: interests },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const updateNotifications = async (userId, notifications) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { notifications: notifications },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updatePrivacySettings = async (userId, privacySettings) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { privacySettings: privacySettings },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateLanguage = async (userId, language) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,

    { language: language },
    { new: true }
  );

  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateTimezone = async (userId, timezone) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { timezone: timezone },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateTwoFactorAuth = async (userId, twoFactorAuth) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { twoFactorAuth: twoFactorAuth },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const updateAccountStatus = async (userId, accountStatus) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { accountStatus: accountStatus },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const updateEmailNotifications = async (userId, emailNotifications) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { emailNotifications: emailNotifications },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updatePushNotifications = async (userId, pushNotifications) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { pushNotifications: pushNotifications },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateSMSNotifications = async (userId, smsNotifications) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { smsNotifications: smsNotifications },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateEmailPreferences = async (userId, emailPreferences) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { emailPreferences: emailPreferences },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updatePushPreferences = async (userId, pushPreferences) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { pushPreferences: pushPreferences },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateSMSPreferences = async (userId, smsPreferences) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { smsPreferences: smsPreferences },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateAccountSettings = async (userId, accountSettings) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { accountSettings: accountSettings },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};

export const updateSecuritySettings = async (userId, securitySettings) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { securitySettings: securitySettings },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateDataExport = async (userId, dataExport) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { dataExport: dataExport },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateDataDeletion = async (userId, dataDeletion) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { dataDeletion: dataDeletion },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};
export const updateAccountRecovery = async (userId, accountRecovery) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { accountRecovery: accountRecovery },
    { new: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { password, ...data } = user._doc;
  return data;
};*/
