import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import { SlSettings } from "react-icons/sl";
import { AiOutlineAppstore } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { HiOutlineDatabase } from "react-icons/hi";
import { useMediaQuery } from "react-responsive";
import { MdMenu } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import Logout from "../Logout/Logout";

const Sidebar = () => {
  const isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  const [open, setOpen] = useState(isTabletMid ? false : true);
  const sidebarRef = useRef();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isTabletMid]);

  useEffect(() => {
    isTabletMid && setOpen(false);
  }, [isTabletMid, pathname]);

  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };

  return (
    <div>
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${
          open ? "block" : "hidden"
        }`}
      ></div>
      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className="bg-white text-black shadow-xl z-[999] max-w-[16rem] w-[16rem] overflow-hidden md:relative fixed h-screen"
      >
        <div className="flex items-center gap-3 font-medium border-b py-3 border-slate-300 mx-3">
          <img
            src="https://img.icons8.com/color/512/firebase.png"
            width={45}
            alt="MASS"
          />
          <span className="text-xl whitespace-pre">MASS</span>
        </div>

        <div className="flex flex-col h-full">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-6 font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100 md:h-[68%] h-[70%]">
            <ul className="whitespace-pre text-[0.9rem] flex flex-col gap-5 border-b border-slate-300">
              <li>
                <NavLink
                  to="/profile"
                  className="link text-black flex items-center gap-3"
                >
                  <BsPerson size={23} className="min-w-max" />
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/storage"
                  className="link text-black flex items-center gap-3"
                >
                  <HiOutlineDatabase size={23} className="min-w-max" />
                  Storage
                </NavLink>
              </li>
              <li className="pb-2">
                <NavLink
                  to="/storage"
                  className="link text-black flex items-center gap-3"
                >
                  <HiOutlineDatabase size={23} className="min-w-max" />
                  Storage
                </NavLink>
              </li>
            </ul>

            <ul className="whitespace-pre text-[0.9rem] flex flex-col gap-5 border-b border-slate-300">
              <li>
                <NavLink
                  to="/"
                  className="link text-black flex items-center gap-3"
                >
                  <AiOutlineAppstore size={23} className="min-w-max" />
                  Appointment1
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className="link text-black flex items-center gap-3"
                >
                  <BsPerson size={23} className="min-w-max" />
                  Appointment2
                </NavLink>
              </li>
              <li className="pb-2">
                <NavLink
                  to="/"
                  className="link text-black flex items-center gap-3"
                >
                  <HiOutlineDatabase size={23} className="min-w-max" />
                  Appointment3
                </NavLink>
              </li>
            </ul>

            <li className="link text-black flex items-center gap-3">
              <SlSettings size={23} className="min-w-max" />
              <Logout />
            </li>
          </ul>
        </div>
        <motion.div
          onClick={() => {
            setOpen(!open);
          }}
          animate={
            open ? { x: 0, y: 0, rotate: 0 } : { x: -10, y: -100, rotate: 180 }
          }
          transition={{ duration: 0 }}
          className="absolute w-fit h-fit md:block z-50 hidden right-2 bottom-3 cursor-pointer"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>
      <div className="m-3 md:hidden" onClick={() => setOpen(true)}>
        <MdMenu size={25} />
      </div>
    </div>
  );
};

export default Sidebar;
