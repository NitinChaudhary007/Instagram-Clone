import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import Comment from "./Comment";

const CommentDialog = ({ open, setOpen }) => {
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const [comment, setComment] = useState(selectedPost?.comments || []);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="flex flex-col max-w-4xl p-0"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className="w-full h-full object-cover rounded-lg"
              src={selectedPost?.image}
              alt="post_img"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              {/* Header */}
              <div className="flex gap-3 items-center">
                <Link to={""}>
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      className="object-cover"
                      src={selectedPost?.author.profilePicture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>

                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author.username}
                  </Link>
                  {/* <span className="text-gray-600 text-sm">Bio here ...</span> */}
                </div>
              </div>

              {/* Dialog box ... */}
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-center text-sm">
                  <div className="cursor-pointer hover:bg-gray-100 w-full text-red-600">
                    Report
                  </div>
                  <div className="cursor-pointer hover:bg-gray-100 w-full text-red-600">
                    Unfollow
                  </div>
                  <div className="cursor-pointer hover:bg-gray-100 w-full">
                    Report
                  </div>
                  <div className="cursor-pointer hover:bg-gray-100 w-full">
                    Report
                  </div>
                  <div className="cursor-pointer hover:bg-gray-100 w-full">
                    Report
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <hr />

            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment?.map((cmt) => (
                <Comment key={cmt._id} comment={cmt} />
              ))}
            </div>

            {/* Add new comment */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment.."
                  className="w-full outline-none border-gray-300 p-2 rounded"
                />
                <Button
                  onClick={sendMessageHandler}
                  disabled={!text.trim()}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
            {/* Add new comment */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
