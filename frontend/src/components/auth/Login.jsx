import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // console.log(res);
        dispatch(setAuthUser(res.data.resUser));
        navigate("/");

        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={loginHandler}
        className=" w-90 shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">
            Login to see photos and videos from your friends
          </p>
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="text"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible: ring-transparent"
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible: ring-transparent"
          />
        </div>

        <span>
          Don't have an Accont ?
          <Link to="/signup" className="text-blue-600 font-bold">
            Signup
          </Link>
        </span>

        {loading ? (
          <Button>
            <Loader2 className="mr-4 h-4 w-4 animate-spin" />
            Please wait ...
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}
      </form>
    </div>
  );
};

export default Login;
