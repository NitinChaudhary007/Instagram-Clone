import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-1/5 my-10 pr-10">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-6 h-6">
            <AvatarImage className="object-cover" src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col items-center gap-3">
          <Link to={`/profile/${user?._id}`}>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
          </Link>
          <span className="text-gray-600 text-sm">
            {user?.bio || "Bio here ..."}
          </span>
        </div>
      </div>

      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
