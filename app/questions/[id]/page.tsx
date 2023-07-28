"use client";

import React from "react";
import { FaLightbulb, FaPlus } from "react-icons/fa6";
import { Tooltip } from "@mui/material";

import { questions, users } from "@/dummy/questions";
import { Question, User, Contributor } from "@/types";
import { Navbar } from "@/components";
import { daysBetweenDateAndToday } from "@/utils";

const getQuestion = (userId: string): Question | undefined => {
  return questions.find((question) => question.id === Number(userId));
};

const QuestionPage = ({ params }: { params: { id: string } }) => {
  const question = getQuestion(params.id);

  if (!question) return false;

  const subText =
    "I have a WPF - mvvm application. I have method in viewmodel that communicates with service layer and service layer communicates with database using entity framework. I am puzzled what to return if user is not found in database.";

  const codeString = `
    using KnitterNotebook.Database;
    using KnitterNotebook.Exceptions;
    using KnitterNotebook.Models;
    using KnitterNotebook.Models.Dtos;
    using KnitterNotebook.Services.Interfaces;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Threading.Tasks;

    namespace KnitterNotebook.Services
    {
        public class UserService : CrudService<User>, IUserService
        {
            private readonly DatabaseContext _databaseContext;

            public UserService(DatabaseContext databaseContext) : base(databaseContext)
            {
                _databaseContext = databaseContext;
            }

            public async Task<string> GetNicknameAsync(int id)
                => (await _databaseContext.Users.FindAsync(id)
                    ?? throw new EntityNotFoundException(ExceptionsMessages.UserWithIdNotFound(id)))
                    .Nickname;

            public async Task<string?> GetNicknameAsync2(int id)
                => await _databaseContext.Users.FindAsync(id)?.Nickname;

        }
    }
`;

  return (
    <>
      <Navbar />
      <div className="p-3 m-0">
        <div className="mx-auto max-w-5xl py-6 px-8 bg-sky-200">
          <h1 className="bg-inherit text-4xl text-center">
            {question.question}
          </h1>
          <div className="flex flex-row justify-between items-center my-2 bg-inherit">
            <span className="bg-inherit">{question.asker.name}</span>
            <span className="bg-inherit">
              {daysBetweenDateAndToday(question.date)}
            </span>
          </div>
        </div>
        <div className="mx-auto max-w-5xl h- py-6 px-8 bg-emerald-200">
          <p className="bg-inherit">{subText}</p>
        </div>
      </div>

      <button className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-md">
        <div className="flex flex-row items-center justify-center bg-inherit text-inherit">
          <FaLightbulb className="bg-inherit text-inherit mr-2" />
          Help CodingOH
        </div>
      </button>
      <Tooltip title="Add Question" placement="left">
        <button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-5 shadow-md">
          <FaPlus className="bg-inherit text-inherit text-2xl" />
        </button>
      </Tooltip>
    </>
  );
};

export default QuestionPage;
