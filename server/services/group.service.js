import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export const createGroup = async (name, members) => {
  return await Group.create({ name, members });
};

export const joinGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group.members.includes(userId)) {
    group.members.push(userId);
    await group.save();
  }
  return group;
};

export const leaveGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  group.members = group.members.filter(
    (memberId) => memberId.toString() !== userId
  );
  await group.save();
  return group;
};

export const sendMessageToGroup = async (groupId, senderId, text) => {
  const group = await Group.findById(groupId);
  group.messages.push({ senderId, text });
  await group.save();
  return group;
};

export const getGroupMessages = async (groupId) => {
  const group = await Group.findById(groupId).populate(
    "messages.senderId",
    "username"
  );
  return group.messages;
};

export const getUserGroups = async (userId) => {
  return await Group.find({ members: userId });
};
