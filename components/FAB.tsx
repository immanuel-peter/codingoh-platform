"use client";

import React, { Fragment, useState } from "react";
import { Tooltip } from "antd";
import { AiFillProject } from "react-icons/ai";
import { FaPlus, FaGear, FaThumbsUp, FaHandshake } from "react-icons/fa6";
import { IoChevronBack } from "react-icons/io5";
import { BsRobot } from "react-icons/bs";
import { Transition, Dialog } from "@headlessui/react";
import Link from "next/link";

const FAB = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Tooltip
        title="Control Center"
        arrow={false}
        color="blue"
        placement="left"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 hover:rotate-90 text-white rounded-full p-5 shadow-md"
        >
          <FaGear className="bg-inherit text-inherit text-2xl" />
        </button>
      </Tooltip>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 overflow-auto"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-400/75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-2/3 max-w-full transform overflow-auto rounded-2xl bg-white border-slate-200 border border-solid p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="p-2 text-3xl font-bold leading-6 text-gray-900 underline underline-offset-4"
                  >
                    Control Center
                  </Dialog.Title>

                  <div className="p-2 m-2 flex items-center justify-center">
                    <Link
                      href="/questions/add"
                      className="p-2 w-1/2 h-20 rounded-xl bg-blue-300 hover:bg-blue-400 flex items-center justify-center"
                    >
                      <div className="bg-inherit flex items-center justify-center">
                        <FaPlus className="bg-inherit text-4xl font-bold mr-4" />
                        <h1 className="bg-inherit text-3xl font-bold ml-4">
                          Add Question
                        </h1>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2 m-2 flex items-center justify-center">
                    <Link
                      href="/projects"
                      className="p-2 w-1/2 h-20 rounded-xl bg-blue-300 hover:bg-blue-400 flex items-center justify-center"
                    >
                      <div className="bg-inherit flex items-center justify-center">
                        <AiFillProject className="bg-inherit text-4xl font-bold mr-4" />
                        <h1 className="bg-inherit text-3xl font-bold ml-4">
                          View All Projects
                        </h1>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2 m-2 flex items-center justify-center">
                    <Link
                      href="/codebot"
                      className="p-2 w-1/2 h-20 rounded-xl bg-blue-300 hover:bg-blue-400 flex items-center justify-center"
                    >
                      <div className="bg-inherit flex items-center justify-center">
                        <BsRobot className="bg-inherit text-4xl font-bold mr-4" />
                        <h1 className="bg-inherit text-3xl font-bold ml-4">
                          Talk with CodeBot
                        </h1>
                        <span className="bg-inherit text-xs p-1 ml-4 border border-solid border-black rounded-lg">
                          Beta
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2 m-2 flex items-center justify-center">
                    <Link
                      href="https://successful-echium-b3f.notion.site/Support-CodingOH-67de2dbf28694086bbf3d59baa1fa10b?pvs=4"
                      className="p-2 w-1/2 h-20 rounded-xl bg-blue-300 hover:bg-blue-400 flex items-center justify-center"
                    >
                      <div className="bg-inherit flex items-center justify-center">
                        <FaHandshake className="bg-inherit text-4xl font-bold mr-4" />
                        <h1 className="bg-inherit text-3xl font-bold ml-4">
                          Help CodingOH
                        </h1>
                      </div>
                    </Link>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex flex-row justify-between items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-base font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <IoChevronBack className="mr-2 text-base bg-inherit" />
                      Back
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default FAB;
