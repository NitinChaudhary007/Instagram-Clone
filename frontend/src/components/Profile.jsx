import useGetUserProfile from "@/hooks/useGetUserProfile";
import { AtSign, Heart } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const Profile = () => {
  const { userProfile, user } = useSelector((store) => store.auth);
  const params = useParams();
  const userId = params.id;
  const [activeTab, setActiveTab] = useState("posts");
  useGetUserProfile(userId);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = true;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        {/* Header Of Post */}

        <div className="grid grid-cols-2">
          {/* Profile Picture */}

          <section className="flex items-center justify-center">
            <Avatar className="h-36 w-36">
              <AvatarImage
                className="object-cover"
                src={userProfile?.profilePicture}
                alt="Profile_picture"
              />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
          </section>

          {/* Profile Info */}
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to={"/account/edit"}>
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View Archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>{" "}
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary">Unfollow</Button>
                    <Button variant="secondary">Message</Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      className="bg-blue-600 hover:bg-blue-800 h-8"
                    >
                      Follow
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}
                  </span>
                  Posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}
                  </span>
                  Followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}
                  </span>
                  Following
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-semibold">{userProfile?.bio} </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span>Learn Code with Me</span>
                <span>Learn DSA with Me</span>
                <span>Learn WEB with Me</span>
              </div>
            </div>
          </section>
        </div>

        {/* POST SAVED REELS  TAGS*/}
        <div className="border-t-gray-500">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => {
                handleTabChange("posts");
              }}
            >
              Posts
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => {
                handleTabChange("saved");
              }}
            >
              Saved
            </span>
            <span className="py-3 cursor-pointer">Reels</span>
            <span className="py-3 cursor-pointer">Tags</span>
          </div>

          {/*  */}
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post?.image}
                    alt="postImage"
                    className="rounded-lg my-2 w-full aspect-square object-cover"
                  />
                  <div className="flex items-center justify-center absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span> {post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span> {post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
