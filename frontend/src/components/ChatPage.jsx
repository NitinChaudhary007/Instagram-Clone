import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import { Button } from "./ui/button";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const [textMessage, setTextMessage] = useState("");

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { message: textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex ml-[20%] h-screen">
      <section className="md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers &&
            suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className="flex gap-3 items-center p-3 hover:bg-gray-200 cursor-pointer"
                >
                  <Avatar className="w-14 h-14">
                    <AvatarImage
                      className="object-cover"
                      src={suggestedUser?.profilePicture}
                    />
                    <AvatarFallback>PP</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {suggestedUser?.username}
                    </span>
                    <span
                      className={`text-xs ${
                        isOnline ? "text-green-500" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "online" : "offline"}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full border-l border-l-gray-400">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage
                className="object-cover"
                src={selectedUser?.profilePicture}
              />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>

          {/* Message will come here */}
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => {
                setTextMessage(e.target.value);
              }}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Message..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-bold">Your messages</h1>
          <span>Send a message to start a chart</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
