import React from "react";
import { FloatButton } from "antd";
import {
  PlusOutlined,
  ProjectOutlined,
  RobotOutlined,
  BulbOutlined,
} from "@ant-design/icons";

const NewFAB = () => {
  return (
    <>
      <FloatButton.Group
        trigger="hover"
        type="primary"
        shape="circle"
        icon={<PlusOutlined className="bg-blue-500 text-blue-500" />}
      >
        <FloatButton
          shape="circle"
          className="bg-transparent"
          icon={<BulbOutlined />}
          tooltip={<div className="text-black bg-gray-200">Help CodingOH</div>}
        />
        <FloatButton
          shape="circle"
          className="bg-transparent"
          icon={<RobotOutlined />}
          tooltip={
            <div className="text-black bg-gray-200">Talk to CodeBot</div>
          }
        />
        <FloatButton
          shape="circle"
          className="bg-transparent"
          
          icon={<ProjectOutlined />}
          tooltip={
            <div className="text-black bg-gray-200">View All Projects</div>
          }
          href="/projects"
        />
        <FloatButton
          shape="circle"
          className="bg-transparent"
          
          icon={<PlusOutlined />}
          tooltip={<div className="text-black bg-gray-200">Add Question</div>}
        />
      </FloatButton.Group>
    </>
  );
};

export default NewFAB;
