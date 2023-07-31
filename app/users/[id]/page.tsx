"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@mui/joy";
import { FaEdit, FaDatabase } from "react-icons/fa";
import {
  JavascriptOriginal,
  PythonOriginal,
  JavaOriginal,
  CsharpPlain,
  CplusplusPlain,
  RubyPlain,
  Html5Original,
  Css3Original,
  MicrosoftsqlserverPlain,
  MysqlOriginal,
  PostgresqlOriginal,
  SqliteOriginal,
  OracleOriginal,
  RedisOriginal,
  MongodbOriginal,
  TypescriptOriginal,
  BashOriginal,
  GitOriginal,
  GithubOriginal,
  COriginal,
  PhpOriginal,
  GoOriginalWordmark,
  RustPlain,
  KotlinOriginal,
  LuaOriginal,
  DartOriginal,
  SwiftOriginal,
  RPlain,
  DotNetOriginal,
  MatlabOriginal,
  ScalaOriginal,
  JuliaOriginal,
  FirebasePlain,
  Neo4jOriginal,
  AmazonwebservicesOriginal,
  AzureOriginal,
  GooglecloudOriginal,
  DigitaloceanOriginal,
  HerokuOriginal,
  NodejsOriginal,
  ReactOriginal,
  JqueryOriginal,
  ExpressOriginal,
  AngularjsOriginal,
  NextjsOriginal,
  DotnetcorePlain,
  VuejsOriginal,
  WordpressPlain,
  FlaskOriginal,
  SpringOriginal,
  DjangoPlain,
  FastapiOriginal,
  LaravelPlain,
  SvelteOriginal,
  NumpyOriginal,
  PandasOriginal,
  TensorflowLine,
  FlutterOriginal,
  ApachekafkaOriginal,
  PytorchOriginal,
  OpencvOriginal,
  ElectronOriginal,
  XamarinOriginal,
  DockerOriginal,
  NpmOriginalWordmark,
  YarnOriginal,
  WebpackOriginal,
  KubernetesPlain,
  NugetOriginal,
  VscodeOriginal,
  IntellijOriginal,
  AndroidstudioOriginal,
  PycharmOriginal,
  JupyterOriginal,
  XcodeOriginal,
  WebstormOriginal,
  JiraOriginal,
  ConfluenceOriginal,
  MarkdownOriginal,
  TrelloPlain,
  TailwindcssPlain,
  Windows8Original,
  AndroidOriginal,
  UbuntuPlain,
  LinuxOriginal,
  ChromeOriginal,
  FigmaOriginal,
} from "devicons-react";
import { Progress, Tooltip } from "antd";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import Link from "next/link";

import { users, questions } from "@/dummy/questions";
import { User } from "@/types";
import { getTopLanguages, stringifyList } from "@/utils";
import { Navbar, Card, Question } from "@/components";
import { sortQuestionsAndContributions } from "@/utils";
import Banner from "@/public/banner.png";
import Avatar from "@/public/avatar.png";

export const allIcons: { [name: string]: React.ReactNode } = {
  JavaScript: <JavascriptOriginal size={25} />,
  Python: <PythonOriginal size={25} />,
  Java: <JavaOriginal size={25} />,
  "C#": <CsharpPlain size={25} />,
  "C++": <CplusplusPlain size={25} />,
  Ruby: <RubyPlain size={25} />,
  HTML: <Html5Original size={25} />,
  CSS: <Css3Original size={25} />,
  SQL: <FaDatabase />,
  "Microsoft SQL Server": <MicrosoftsqlserverPlain size={25} />,
  MySQL: <MysqlOriginal size={25} />,
  PostgreSQL: <PostgresqlOriginal size={25} />,
  SQLite: <SqliteOriginal size={25} />,
  Oracle: <OracleOriginal size={25} />,
  Redis: <RedisOriginal size={25} />,
  MongoDB: <MongodbOriginal size={25} />,
  TypeScript: <TypescriptOriginal size={25} />,
  Bash: <BashOriginal size={25} />,
  Git: <GitOriginal size={25} />,
  GitHub: <GithubOriginal size={25} />,
  C: <COriginal size={25} />,
  PHP: <PhpOriginal size={25} />,
  Go: <GoOriginalWordmark size={25} />,
  Rust: <RustPlain size={25} />,
  Kotlin: <KotlinOriginal size={25} />,
  Lua: <LuaOriginal size={25} />,
  Dart: <DartOriginal size={25} />,
  Swift: <SwiftOriginal size={25} />,
  R: <RPlain size={25} />,
  ".NET": <DotNetOriginal size={25} />,
  MATLAB: <MatlabOriginal size={25} />,
  Scala: <ScalaOriginal size={25} />,
  Julia: <JuliaOriginal size={25} />,
  Firebase: <FirebasePlain size={25} />,
  Neo4j: <Neo4jOriginal size={25} />,
  "Amazon Web Services": <AmazonwebservicesOriginal size={25} />,
  Azure: <AzureOriginal size={25} />,
  "Google Cloud": <GooglecloudOriginal size={25} />,
  DigitalOcean: <DigitaloceanOriginal size={25} />,
  Heroku: <HerokuOriginal size={25} />,
  "Node.js": <NodejsOriginal size={25} />,
  React: <ReactOriginal size={25} />,
  jQuery: <JqueryOriginal size={25} />,
  "Express.js": <ExpressOriginal size={25} />,
  AngularJS: <AngularjsOriginal size={25} />,
  "Next.js": <NextjsOriginal size={25} />,
  ".NET Core": <DotnetcorePlain size={25} />,
  "Vue.js": <VuejsOriginal size={25} />,
  WordPress: <WordpressPlain size={25} />,
  Flask: <FlaskOriginal size={25} />,
  Spring: <SpringOriginal size={25} />,
  Django: <DjangoPlain size={25} />,
  FastAPI: <FastapiOriginal size={25} />,
  Laravel: <LaravelPlain size={25} />,
  Svelte: <SvelteOriginal size={25} />,
  NumPy: <NumpyOriginal size={25} />,
  Pandas: <PandasOriginal size={25} />,
  TensorFlow: <TensorflowLine size={25} />,
  Flutter: <FlutterOriginal size={25} />,
  "Apache Kafka": <ApachekafkaOriginal size={25} />,
  PyTorch: <PytorchOriginal size={25} />,
  OpenCV: <OpencvOriginal size={25} />,
  Electron: <ElectronOriginal size={25} />,
  Xamarin: <XamarinOriginal size={25} />,
  Docker: <DockerOriginal size={25} />,
  npm: <NpmOriginalWordmark size={25} />,
  Yarn: <YarnOriginal size={25} />,
  Webpack: <WebpackOriginal size={25} />,
  Kubernetes: <KubernetesPlain size={25} />,
  NuGet: <NugetOriginal size={25} />,
  "VS Code": <VscodeOriginal size={25} />,
  "IntelliJ IDEA": <IntellijOriginal size={25} />,
  "Android Studio": <AndroidstudioOriginal size={25} />,
  PyCharm: <PycharmOriginal size={25} />,
  Jupyter: <JupyterOriginal size={25} />,
  Xcode: <XcodeOriginal size={25} />,
  WebStorm: <WebstormOriginal size={25} />,
  Jira: <JiraOriginal size={25} />,
  Confluence: <ConfluenceOriginal size={25} />,
  Markdown: <MarkdownOriginal size={25} />,
  Trello: <TrelloPlain size={25} />,
  "Tailwind CSS": <TailwindcssPlain size={25} />,
  Windows: <Windows8Original size={25} />,
  Android: <AndroidOriginal size={25} />,
  Ubuntu: <UbuntuPlain size={25} />,
  Linux: <LinuxOriginal size={25} />,
  Chrome: <ChromeOriginal size={25} />,
  Figma: <FigmaOriginal size={25} />,
};

const getUser = (userId: string): User | undefined => {
  return users.find((user) => user.id === Number(userId));
};

const UserPage = ({ params }: { params: { id: string } }) => {
  const user = getUser(params.id);

  if (!user) return false;

  const userMap = sortQuestionsAndContributions(questions, users);
  const userQuestionsAndContributions = userMap[user.id];

  const topLanguages = getTopLanguages(user.codingLanguages, 5);

  return (
    <>
      <Navbar />
      <div className="p-3 m-0">
        <div className="relative flex h-32 w-full items-center justify-between rounded-xl bg-cover px-10 mb-4">
          <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full mr-20">
              <Badge
                badgeContent={user.isOnline ? "Online" : "Offline"}
                color={user.isOnline ? "success" : "danger"}
                size="md"
                variant="soft"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeInset="10%"
              >
                <Image
                  src={Avatar}
                  alt="profile picture"
                  className="h-full w-full rounded-full"
                />
              </Badge>
            </div>
            <div className="flex-grow">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <span className="text-lg font-normal">{user.position}</span>
            </div>
          </div>
          <div>
            <button className="p-3 bg-cyan-300 hover:bg-cyan-400 border border-solid border-cyan-400 hover:border-cyan-500 items-center justify-between flex flex-row rounded-lg">
              <FaEdit className="mr-3 bg-inherit" />
              Edit Profile
            </button>
          </div>
        </div>
        <Image
          src={Banner}
          alt="background cover"
          className="h-2 w-full rounded-xl"
        />
      </div>
      <main className="p-3 m-0 grid grid-cols-4 grid-flow-row gap-4">
        <div className="row-span-3 border border-solid border-gray-300 rounded-xl h-fit">
          <h1 className="p-2 ml-3 text-2xl font-bold rounded-t-xl">Stack</h1>
          <hr className="border-solid border border-black mb-4" />
          <div className="pb-3 grid grid-cols-4 gap-4 items-center content-evenly justify-evenly justify-items-center rounded-b-xl">
            {topLanguages
              .sort((a, b) => b.proficiency - a.proficiency)
              .map((language) => (
                <>
                  <div className="col-span-1">
                    <Tooltip
                      title={language.language}
                      arrow={false}
                      placement="right"
                    >
                      {allIcons[language.language]}
                    </Tooltip>
                  </div>
                  <Progress
                    percent={language.proficiency}
                    format={(percent) => percent}
                    className="col-span-3"
                  />
                </>
              ))}
            {user.codingLanguages.length > 5 ? (
              <button className="col-start-3 col-span-2 text-base text-blue-500 flex flex-row right-0 self-end items-center justify-between">
                See More
                <MdOutlineKeyboardDoubleArrowRight className="ml-3" />
              </button>
            ) : null}
          </div>
        </div>
        <div className="col-span-3 border border-solid border-gray-300 rounded-xl p-2 h-fit">
          <h1 className="text-2xl font-bold ml-3 underline underline-offset-4">
            About
          </h1>
          <p className="ml-3 mt-2">{user.about}</p>
        </div>
        <div className="col-span-3 col-start-2 border border-solid border-gray-300 rounded-xl h-fit">
          <h1 className="text-2xl font-bold ml-3 p-2 rounded-tr-xl">
            Questions
          </h1>
          <hr className="border-solid border border-black" />
          <div className="rounded-b-xl">
            <ul role="list" className="divide-y divide-gray-500 rounded-b-xl">
              {userQuestionsAndContributions.contributedQuestions.map(
                (question, index) => (
                  <li key={index}>
                    <Link
                      href={`/questions/${question.id}`}
                      className="flex justify-between gap-x-6 px-3 py-3"
                    >
                      <Question
                        question={question.question}
                        asker={question.asker.name}
                        contributors={question.contributors}
                        date={question.date}
                        answered={question.isAnswered}
                      />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default UserPage;

/*
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className={`w-${getRandomSize()} h-${getRandomSize()} rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-4`}
            ></div>
          ))}
        </div>
*/

/*
{user ? (
        <div>
          <h1>ID: {user.id}</h1>
          <h1>Name: {user.name}</h1>
          <h1>About: {user.about}</h1>
          <h1>Languages: {stringifyList(user.codingLanguages)}</h1>
          <h1>Email: {user.email}</h1>
          <h1>Files: {stringifyList(user.fileAttachments)}</h1>
          <h1>Online: {user.isOnline ? "True" : "False"}</h1>
          <h1>Position: {user.position}</h1>
        </div>
      ) : (
        <h1>User Does Not Exist</h1>
      )}
*/

/*
<div className="flex justify-start ml-2 mr-5">
          <Card
            name={user.name}
            position={user.position}
            languages={user.codingLanguages}
            isOnline={user.isOnline}
          />
        </div>

<div className="divide-y divide-gray-600">
          <div>
            <ul role="list" className="divide-y divide-gray-600">
              {userQuestionsAndContributions.askedQuestions.map(
                (question, index) => (
                  <li key={index} className="flex justify-between gap-x-6 py-5">
                    <Question
                      question={question.question}
                      asker={question.asker.name}
                      contributors={question.contributors.length}
                      date={question.date}
                      answered={question.isAnswered}
                    />
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <ul role="list" className="divide-y divide-gray-600">
              {userQuestionsAndContributions.contributedQuestions.map(
                (question, index) => (
                  <li key={index} className="flex justify-between gap-x-6 py-5">
                    <Question
                      question={question.question}
                      asker={question.asker.name}
                      contributors={question.contributors.length}
                      date={question.date}
                      answered={question.isAnswered}
                    />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
*/
