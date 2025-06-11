import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import useGetAllMessage from "../hooks/useGetAllMessage";
import useGetRTM from "../hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              className="object-cover"
              src={selectedUser?.profilePicture}
            />
            <AvatarFallback>PP</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages?.map((msg) => {
          return (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId == user?._id ? "justify-end" : "justify-start"
              } `}
            >
              <div
                className={`p-2 rounded-lg max-w-xs break-words ${
                  msg.senderId == user?._id ? "bg-blue-500" : "bg-blue-200"
                } `}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
