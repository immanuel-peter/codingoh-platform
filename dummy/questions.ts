import { varStatus, randEl } from "@/utils";
import { Question, User, Project } from "@/types";

// Users
export const users: User[] = [
  {
    id: 7094247,
    name: "John Doe",
    about:
      "I am a software engineer with 5 years of experience. I am interested in web development and machine learning.",
    email: "johndoe@example.com",
    position: "Software Engineer",
    fileAttachments: ["resume.pdf"],
    codingLanguages: [
      { language: "JavaScript", proficiency: 80 },
      { language: "Python", proficiency: 95 },
      { language: "Java", proficiency: 65 },
    ],
    isOnline: varStatus(),
    location: "New York",
    company: "ABC Tech",
    skills: ["Web Development", "Machine Learning", "Software Engineering"],
    education: "XYZ University",
    platforms: ["Facebook", "TikTok", "YouTube", "Discord", "Instagram"],
  },
  {
    id: 2425855,
    name: "Jane Doe",
    about:
      "I am a student who is learning to code. I am interested in front-end development and web design.",
    email: "janedoe@example.com",
    position: "Student",
    fileAttachments: [],
    codingLanguages: [
      { language: "HTML", proficiency: 70 },
      { language: "CSS", proficiency: 60 },
      { language: "JavaScript", proficiency: 85 },
    ],
    isOnline: varStatus(),
    location: "Los Angeles",
    company: "XYZ University",
    skills: ["Front-end Development", "Web Design"],
    education: "ABC College",
    platforms: ["Facebook", "Twitter", "Stack Overflow", "TikTok", "Dropbox"],
  },
  {
    id: 6436184,
    name: "Peter Smith",
    about:
      "I am a senior software engineer with 10 years of experience. I am interested in distributed systems and cloud computing.",
    email: "petersmith@example.com",
    position: "Senior Software Engineer",
    fileAttachments: ["portfolio.pdf"],
    codingLanguages: [
      { language: "Java", proficiency: 90 },
      { language: "Python", proficiency: 75 },
      { language: "Go", proficiency: 80 },
    ],
    isOnline: varStatus(),
    location: "San Francisco",
    company: "Tech Solutions Inc.",
    skills: ["Distributed Systems", "Cloud Computing", "Java"],
    education: "XYZ University",
    platforms: ["Twitter", "YouTube", "TikTok", "Reddit", "Codepen"],
  },
  {
    id: 5460166,
    name: "Mary Jones",
    about:
      "I am a junior software engineer with 2 years of experience. I am interested in mobile development and big data.",
    email: "maryjones@example.com",
    position: "Junior Software Engineer",
    fileAttachments: ["cv.pdf"],
    codingLanguages: [
      { language: "Swift", proficiency: 85 },
      { language: "Java", proficiency: 70 },
      { language: "Python", proficiency: 60 },
    ],
    isOnline: varStatus(),
    location: "Chicago",
    company: "Tech Innovators",
    skills: ["Mobile Development", "Big Data", "Swift"],
    education: "ABC College",
    platforms: ["Reddit", "Twitter", "Dropbox", "Twitch", "GitHub"],
  },
  {
    id: 8973098,
    name: "Susan Brown",
    about:
      "I am a self-taught developer who is interested in full-stack development. I am also interested in open source software.",
    email: "susanbrown@example.com",
    position: "Full-Stack Developer",
    fileAttachments: ["projects.pdf"],
    codingLanguages: [
      { language: "JavaScript", proficiency: 70 },
      { language: "Python", proficiency: 85 },
      { language: "Ruby", proficiency: 60 },
    ],
    isOnline: varStatus(),
    location: "Seattle",
    company: "OpenSource Solutions",
    skills: ["Full-Stack Development", "Open Source", "JavaScript"],
    education: "XYZ University",
    platforms: ["Reddit", "Discord", "Dropbox", "Twitch", "Codepen"],
  },
  {
    id: 8446183,
    name: "David Jones",
    about:
      "I am a recent graduate with a degree in computer science. I am interested in artificial intelligence and machine learning.",
    email: "davidjones@example.com",
    position: "Software Engineer Intern",
    fileAttachments: ["transcript.pdf"],
    codingLanguages: [
      { language: "Python", proficiency: 80 },
      { language: "Java", proficiency: 75 },
      { language: "TensorFlow", proficiency: 70 },
    ],
    isOnline: varStatus(),
    location: "Boston",
    company: "AI Solutions",
    skills: ["Artificial Intelligence", "Machine Learning", "Python"],
    education: "ABC College",
    platforms: ["Dropbox", "Facebook", "GitHub", "Stack Overflow", "TikTok"],
  },
  {
    id: 5681446,
    name: "Elizabeth Smith",
    about:
      "I am a web developer with 3 years of experience. I am interested in front-end development and user experience.",
    email: "elizabethsmith@example.com",
    position: "Web Developer",
    fileAttachments: ["portfolio.pdf"],
    codingLanguages: [
      { language: "HTML", proficiency: 75 },
      { language: "CSS", proficiency: 80 },
      { language: "JavaScript", proficiency: 90 },
      { language: "React", proficiency: 70 },
    ],
    isOnline: varStatus(),
    location: "Miami",
    company: "Web Creators",
    skills: ["Front-end Development", "User Experience", "React"],
    education: "XYZ University",
    platforms: ["LinkedIn", "Discord", "YouTube", "Dropbox", "Instagram"],
  },
  {
    id: 7658604,
    name: "Michael Brown",
    about:
      "I am a full-stack developer with 5 years of experience. I am interested in back-end development and cloud computing.",
    email: "michaelbrown@example.com",
    position: "Full-Stack Developer",
    fileAttachments: ["resume.pdf"],
    codingLanguages: [
      { language: "Java", proficiency: 85 },
      { language: "Python", proficiency: 80 },
      { language: "Node.js", proficiency: 70 },
      { language: "AWS", proficiency: 75 },
    ],
    isOnline: varStatus(),
    location: "Denver",
    company: "Cloud Solutions Ltd.",
    skills: ["Full-Stack Development", "Back-end Development", "Java"],
    education: "ABC College",
    platforms: ["Twitch", "Discord", "Codepen", "Twitter", "Medium"],
  },
  {
    id: 1691053,
    name: "Emily Johnson",
    about:
      "I am a front-end developer with a passion for creating beautiful and interactive user interfaces.",
    email: "emilyjohnson@example.com",
    position: "Front-End Developer",
    fileAttachments: ["portfolio.pdf"],
    codingLanguages: [
      { language: "HTML", proficiency: 80 },
      { language: "CSS", proficiency: 70 },
      { language: "JavaScript", proficiency: 85 },
      { language: "React", proficiency: 90 },
    ],
    isOnline: varStatus(),
    location: "Austin",
    company: "UI Designers Inc.",
    skills: ["Front-end Development", "User Interface Design", "React"],
    education: "XYZ University",
    platforms: ["Twitch", "Twitter", "LinkedIn", "YouTube", "TikTok"],
  },
  {
    id: 9601998,
    name: "Robert Wilson",
    about:
      "I am a backend developer specializing in building scalable and efficient server-side applications.",
    email: "robertwilson@example.com",
    position: "Backend Developer",
    fileAttachments: ["resume.pdf"],
    codingLanguages: [
      { language: "Python", proficiency: 90 },
      { language: "Java", proficiency: 75 },
      { language: "Node.js", proficiency: 80 },
      { language: "MongoDB", proficiency: 70 },
    ],
    isOnline: varStatus(),
    location: "San Diego",
    company: "Server Solutions",
    skills: ["Back-end Development", "Server-side Applications", "Python"],
    education: "ABC College",
    platforms: ["GitHub", "Facebook", "LinkedIn", "Twitch", "Medium"],
  },
  {
    id: 9100672,
    name: "Jennifer Lee",
    about:
      "I am a UX/UI designer with a focus on creating delightful user experiences and intuitive interfaces.",
    email: "jenniferlee@example.com",
    position: "UX/UI Designer",
    fileAttachments: ["portfolio.pdf"],
    codingLanguages: [
      { language: "HTML", proficiency: 85 },
      { language: "CSS", proficiency: 75 },
      { language: "JavaScript", proficiency: 70 },
      { language: "Figma", proficiency: 80 },
      { language: "React", proficiency: 50 },
    ],
    isOnline: varStatus(),
    location: "Seattle",
    company: "Design Studios",
    skills: ["UX Design", "UI Design", "Figma"],
    education: "XYZ University",
    platforms: ["TikTok", "Instagram", "Twitch", "LinkedIn", "Discord"],
  },
  {
    id: 3012944,
    name: "Richard Thompson",
    about:
      "I am a data scientist with expertise in analyzing and interpreting complex data sets.",
    email: "richardthompson@example.com",
    position: "Data Scientist",
    fileAttachments: ["resume.pdf"],
    codingLanguages: [
      { language: "Python", proficiency: 90 },
      { language: "R", proficiency: 85 },
      { language: "SQL", proficiency: 70 },
      { language: "TensorFlow", proficiency: 80 },
    ],
    isOnline: varStatus(),
    location: "San Francisco",
    company: "Data Insights",
    skills: ["Data Science", "Data Analysis", "Python"],
    education: "ABC College",
    platforms: ["Stack Overflow", "Medium", "TikTok", "LinkedIn", "Facebook"],
  },
  {
    id: 6081524,
    name: "Lisa Davis",
    about:
      "I am a DevOps engineer experienced in automating and streamlining development processes.",
    email: "lisadavis@example.com",
    position: "DevOps Engineer",
    fileAttachments: ["resume.pdf"],
    codingLanguages: [
      { language: "Python", proficiency: 85 },
      { language: "Bash", proficiency: 75 },
      { language: "Docker", proficiency: 80 },
      { language: "Kubernetes", proficiency: 70 },
    ],
    isOnline: varStatus(),
    location: "Austin",
    company: "DevOps Solutions",
    skills: ["DevOps", "Automation", "Python"],
    education: "XYZ University",
    platforms: ["LinkedIn", "TikTok", "Dropbox", "Facebook", "Reddit"],
  },
  {
    id: 8734925,
    name: "Isabella David",
    about:
      "I'm a coding enthusiast who loves crafting clean and efficient code. I'm constantly exploring new challenges and learning more about the tech world. You can often find me contributing to open-source projects and sharing my coding insights on forums. Let's connect and learn together on this exciting coding journey!",
    email: "isabelladavis@example.com",
    position: "Full Stack Developer",
    fileAttachments: ["cv.pdf"],
    codingLanguages: [
      { language: "JavaScript", proficiency: 90 },
      { language: "Python", proficiency: 85 },
      { language: "React", proficiency: 80 },
      { language: "Node.js", proficiency: 75 },
      { language: "HTML", proficiency: 95 },
      { language: "CSS", proficiency: 90 },
      { language: "Java", proficiency: 70 },
      { language: "SQL", proficiency: 65 },
      { language: "TypeScript", proficiency: 85 },
      { language: "Express.js", proficiency: 70 },
      { language: "Flask", proficiency: 60 },
      { language: "MongoDB", proficiency: 80 },
      { language: "Git", proficiency: 85 },
      { language: "AWS", proficiency: 75 },
      { language: "Azure", proficiency: 70 },
      { language: "Google Cloud", proficiency: 70 },
      { language: "TensorFlow", proficiency: 75 },
    ],
    isOnline: varStatus(),
    location: "San Francisco",
    company: "TechSprint Solutions",
    skills: [
      "Frontend Development",
      "React and React Native",
      "Backend Development",
      "Python Programming",
      "Database Management",
      "Full Stack Web Development",
      "TypeScript",
      "UI/UX Design",
      "Version Control",
      "Test-Driven Development",
      "RESTful APIs",
      "DevOps and CI/CD",
      "Cloud Services",
      "Data Analysis and Visualization",
      "Mobile App Development",
      "Agile Software Development",
      "Docker and Containerization",
      "Machine Learning",
      "Cybersecurity Fundamentals",
      "Software Architecture and Design Patterns",
    ],
    education: "Stanford University",
    platforms: ["Twitch", "GitHub", "YouTube", "Discord", "Medium"],
  },
];

// Questions
export const questions: Question[] = [
  {
    id: 4820825,
    question: "How do I create a new thread in a forum?",
    asker: users[0],
    description:
      "I want to start a discussion on a forum but can't find the option to create a new thread. I've been browsing the forum for a while, but the interface isn't clear about how to do this.",
    time: "10:30 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `To create a new thread in a forum, follow these steps:

1. **Navigate to the Forum**: Log in to the forum website and navigate to the appropriate section where you want to create the thread.

2. **Click "New Thread"**: Look for a button or link labeled "New Thread" or something similar. This is usually located at the top of the forum section or within the navigation menu.

3. **Provide Title and Content**: Enter a descriptive title for your thread. This title should clearly reflect the topic of your discussion. Then, use the provided text editor to compose your thread's content.

4. **Formatting**: Use the text editor's formatting tools to enhance your content. You can use features like bold, italics, bullet points, and more to make your thread more organized and engaging.

5. **Add Tags (Optional)**: Some forums allow you to add tags to your thread. Tags help categorize your thread and make it easier for others to find.

6. **Preview and Submit**: Before submitting, preview your thread to ensure that it appears as intended. Once you're satisfied, click the "Submit" or "Post" button to publish your thread.

7. **Engage**: Keep an eye on your thread for replies and engage in discussions with other users who respond to your thread.

Remember to follow the forum's guidelines and etiquette while creating your thread.
    `,
    contributors: [{ user: users[0], contributionTime: "10:35 AM" }],
    tags: ["forum", "discussion", "community", "how-to"],
  },
  {
    id: 9950463,
    question: "How do I format code in a post?",
    asker: users[1],
    description:
      "I'm trying to share a piece of code on the forum, but it looks messy and unreadable. I've looked around the formatting options, but I can't figure out how to properly format the code.",
    time: "10:35 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `## When formatting code in a post, you can use Markdown or the forum's built-in code formatting tools:

1. **Using Markdown**:
To format code using Markdown, enclose the code within triple backticks (\`\`\`). Specify the programming language after the opening backticks to enable syntax highlighting. For example:

\`\`\`javascript
console.log("Hello, world!");
\`\`\`

2. **Using Forum Tools**:
Some forums offer dedicated code formatting buttons. Look for a button that resembles "{ }" or "Code" in the text editor. Click it and paste your code within the designated area.

Always preview your post to ensure proper code formatting before submitting.
    `,
    contributors: [{ user: users[4], contributionTime: "10:40 AM" }],
    tags: ["formatting"],
  },
  {
    id: 7687595,
    question: "What is the difference between a class and an object?",
    asker: users[2],
    description:
      "I'm learning about object-oriented programming, and I'm confused about the concepts of classes and objects. I've read some explanations, but I'm struggling to grasp the distinction between them.",
    time: "10:40 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `In object-oriented programming:

- A **class** is a blueprint or template that defines the structure and behavior of objects. It encapsulates data and methods that define the properties and actions an object of that class can have.

- An **object** is an instance of a class. It represents a specific occurrence or realization of the class's structure and behavior. Objects can have their own unique data while adhering to the structure defined by the class.

In simpler terms, a class defines a category of objects, while an object is a specific instance of that category.
    `,
    contributors: [
      { user: users[2], contributionTime: "10:45 AM" },
      { user: users[0], contributionTime: "10:50 AM" },
    ],
    tags: ["oop", "object-oriented", "class", "object"],
  },
  {
    id: 5068742,
    question: "How do I debug a JavaScript error?",
    asker: users[3],
    description:
      "I've encountered an error in my JavaScript code, and my application isn't working as expected. I've tried using console.log statements, but I can't pinpoint the issue. I need guidance on debugging techniques.",
    time: "10:45 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `# Debugging JavaScript errors involves several steps:

1. **Identify the Error**: Look for error messages in the browser's console or developer tools. The error message will often provide information about the location and nature of the error.

2. **Inspect the Code**: Go to the indicated line in your code where the error occurred. Check for syntax errors, misspelled variables, or incorrect function calls.

3. **Use \`console.log()\`**: Insert \`console.log()\` statements at various points in your code to track the flow of data and identify where the error might be occurring.

4. **Breakpoints**: Set breakpoints in your code using the browser's developer tools. This allows you to pause code execution at specific points and inspect variable values.

5. **Step Through Code**: Use the debugger to step through your code line by line. This helps you understand how your code is behaving and identify problematic areas.

6. **Inspect Values**: Use the developer tools to inspect variable values, check if conditions are met, and identify any unexpected behavior.

7. **Try a Linter**: Use a JavaScript linter to catch potential issues in your code before they become errors.

8. **Online Resources**: If you're stuck, search online for similar issues and solutions. Developer forums and Stack Overflow can be helpful.

Remember, debugging is a skill that improves with practice. Don't hesitate to seek help from others when needed.
    `,
    contributors: [{ user: users[2], contributionTime: "10:50 AM" }],
    tags: ["javascript", "debugging"],
  },
  {
    id: 5387555,
    question: "How do I create a REST API?",
    asker: users[4],
    description:
      "I'm building a web application and need to create a REST API for communication between the front end and the back end. I've heard about RESTful APIs, but I'm not sure where to start and how to structure it.",
    time: "10:50 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `# Creating a REST API involves the following steps:

1. **Design Endpoints**: Plan the endpoints for your API. Each endpoint represents a resource or functionality. Use meaningful names and follow REST conventions.

2. **Choose HTTP Methods**: Assign appropriate HTTP methods (GET, POST, PUT, DELETE, etc.) to each endpoint based on the desired action.

3. **Set Up Server**: Create a backend server using a framework like Express (Node.js) or Django (Python).

4. **Define Routes**: Set up route handlers for each endpoint. These handlers receive requests, process data, and send responses.

5. **Connect to Database**: If your API involves data storage, connect it to a database (e.g., MySQL, MongoDB).

6. **Implement CRUD Operations**: Implement Create, Read, Update, and Delete operations for each resource.

7. **Middleware and Validation**: Use middleware for tasks like authentication, authorization, and input validation.

8. **Testing**: Thoroughly test your API using tools like Postman or automated testing frameworks.

9. **Documentation**: Provide clear documentation for your API, including endpoint descriptions, request/response formats, and examples.

10. **Security**: Implement security measures like HTTPS, authentication tokens, and rate limiting to protect your API.

11. **Deployment**: Deploy your API to a server or cloud service. Ensure it's accessible and scalable.

12. **Monitoring and Maintenance**: Monitor your API's performance, handle errors gracefully, and regularly update and improve it.
    `,
    contributors: [
      { user: users[4], contributionTime: "10:55 AM" },
      { user: users[0], contributionTime: "11:00 AM" },
      { user: users[1], contributionTime: "11:05 AM" },
    ],
    tags: ["rest-api"],
  },
  {
    id: 6100185,
    question: "How do I create a mobile app?",
    asker: users[5],
    description:
      "I have an idea for a mobile app and want to turn it into reality. I've heard about different app development approaches, like native and hybrid. I'm not sure which one to choose and how to get started.",
    time: "11:00 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `## Creating a mobile app involves several steps:

1. **Define Your Idea**: Clearly define your app's purpose, target audience, and features. Consider platforms (iOS, Android) and development frameworks.

2. **Design UI/UX**: Create wireframes and mockups for the app's user interface. Design a user-friendly and visually appealing layout.

3. **Choose a Development Approach**:

- **Native**: Develop separate apps for iOS (Swift/Objective-C) and Android (Kotlin/Java).
- **Hybrid**: Use frameworks like React Native or Flutter to create cross-platform apps with a single codebase.
- **Web App**: Build a responsive web app that works on mobile browsers.

4. **Set Up Development Environment**: Install the necessary tools and SDKs for your chosen platform and framework.

5. **Develop App Logic**: Write code to implement the app's functionality, including user interactions and data handling.

6. **Test Thoroughly**: Test your app on real devices and emulators. Identify and fix bugs, ensure responsive design, and test different scenarios.

7. **Optimize Performance**: Optimize the app's performance by reducing loading times, memory usage, and optimizing images.

8. **Integrate Backend**: If your app requires backend services, set up a server to handle data storage, authentication, and other functionality.

9. **Security**: Implement security practices to protect user data and prevent unauthorized access.

10. **Publish to App Stores**:

- For iOS, create an Apple Developer account, package the app, and submit it to the App Store.
- For Android, set up a Google Play Developer account, package the app, and submit it to the Google Play Store.

11. **Monitor and Update**: Keep an eye on user feedback and app performance. Regularly update the app to fix bugs, add new features, and improve the user experience.

12. **Marketing and Launch**: Plan a marketing strategy to promote your app. Create a website, social media presence, and promotional materials to attract users.

13. **Gather User Feedback**: Encourage users to provide feedback, reviews, and ratings. Use their input to make further improvements.

14. **Maintain and Enhance**: Continuously update your app based on user feedback, changing trends, and technological advancements.

Creating a mobile app requires a combination of coding skills, design expertise, and business understanding. It's a rewarding journey that can lead to a successful product in the app market.
    `,
    contributors: [
      { user: users[2], contributionTime: "11:05 AM" },
      { user: users[6], contributionTime: "11:10 AM" },
      { user: users[0], contributionTime: "11:15 AM" },
    ],
    tags: ["mobile", "mobile-app", "app-development", "native"],
  },
  {
    id: 7010497,
    question: "How do I deploy a website to the cloud?",
    asker: users[6],
    description:
      "I've finished developing my website and now want to make it accessible online. I've heard about cloud services for hosting, but I'm unsure about the steps to deploy my website to the cloud.",
    time: "11:15 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `## To deploy a website to the cloud, follow these steps:

1. **Choose a Cloud Provider**: Select a cloud provider like AWS, Azure, Google Cloud, or Netlify.

2. **Set Up an Account**: Create an account on the chosen cloud platform and set up payment options.

3. **Prepare Your Website**:

- Make sure your website is well-structured and functional.
- Bundle assets, minify code, and optimize images for better performance.

4. **Select a Deployment Method**:

- For static websites, consider platforms like Netlify or GitHub Pages for easy deployment.
- For dynamic websites, set up virtual machines or containers.

5. **Configure Hosting**:

- For static sites, upload your site files to the cloud provider using the provided tools.
- For dynamic sites, configure server settings, databases, and domain names.

6. **Set Up SSL**: Configure SSL certificates for secure HTTPS connections.

7. **Domain Configuration**:

- Point your domain name to your cloud provider's servers using DNS settings.
- Update domain records to match your cloud provider's configuration.

8. **Test Your Website**:

- Test your website thoroughly to ensure it works as expected in the cloud environment.
- Test across different devices and browsers.

9. **Scaling**: Configure auto-scaling if needed to handle varying traffic loads.

10. **Backup and Monitoring**: Set up backup solutions and monitoring tools to ensure your site's availability.

11. **Launch Your Website**: Once everything is set up, deploy your website to the cloud.

12. **Continuous Deployment**: Implement continuous integration and continuous deployment (CI/CD) pipelines for automated updates.

13. **Monitor and Optimize**: Regularly monitor your website's performance and security. Optimize resources for cost efficiency.

14. **Updates and Maintenance**: Keep your website up to date with the latest content, features, and security patches.

Deploying to the cloud provides scalability, reliability, and accessibility to users across the globe.
    `,
    contributors: [
      { user: users[5], contributionTime: "11:20 AM" },
      { user: users[3], contributionTime: "11:25 AM" },
    ],
    tags: ["cloud", "deployment", "web-development"],
  },
  {
    id: 5368397,
    question: "How do I create a database?",
    asker: users[7],
    description:
      "I need to store data for my web application and want to set up a database. However, I'm new to databases, and concepts like tables, relationships, and queries are a bit overwhelming.",
    time: "11:20 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `## Creating a database involves these steps:

1. **Choose Database Type**: Decide between SQL databases (e.g., MySQL, PostgreSQL) and NoSQL databases (e.g., MongoDB, Firebase).

2. **Select a Database System**: Choose a specific database system that fits your needs and requirements.

3. **Install Database Software**: Install the chosen database software on your server or use cloud-based solutions.

4. **Design Database Schema**:

- Plan the structure of your database, including tables, fields, relationships, and data types.
- For NoSQL databases, define collections, documents, and properties.

5. **Create Tables/Collections**: Set up tables or collections based on your schema design.

6. **Define Data Constraints**: Implement constraints like primary keys, foreign keys, indexes, and validation rules.

7. **Write Queries**: Learn and write queries to manipulate and retrieve data. Use SQL or query languages specific to your database.

8. **Data Population**: Insert initial data into your tables or collections.

9. **Backup and Recovery**: Set up regular backups and implement recovery procedures.

10. **Test and Optimize**: Test your database for performance, data integrity, and scalability. Optimize queries for efficiency.

11. **Security Measures**: Implement security measures to protect your data, such as access controls and encryption.

12. **Documentation**: Document your database schema, queries, and any relevant information.

13. **Scale**: Monitor your database's performance and scale resources as needed.

Remember, database design and management are critical to the success of your application. Plan carefully and ensure data integrity and security.
    `,
    contributors: [
      { user: users[1], contributionTime: "11:25 AM" },
      { user: users[7], contributionTime: "11:30 AM" },
      { user: users[4], contributionTime: "11:35 AM" },
    ],
    tags: ["database", "database-design"],
  },
  {
    id: 8862639,
    question:
      "What are the best practices for optimizing a website's performance?",
    asker: users[8],
    description:
      "My website feels sluggish, and I've heard that optimizing performance is crucial for user experience. I'm looking for ways to improve the loading speed and overall performance of my website.",
    time: "11:30 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `## Optimizing website performance is essential for user satisfaction and search engine rankings.
    
    Here are some best practices:

1. **Optimize Images**:

- Compress images without compromising quality.
- Use modern image formats like WebP.
- Specify image dimensions to prevent layout shifts.

2. **Minimize HTTP Requests**:

- Reduce the number of files loaded (CSS, JavaScript, images).
- Combine multiple files into a single one using techniques like minification.

3. **Use Content Delivery Networks (CDNs)**:

- Serve static assets from CDNs to reduce latency.
- CDNs distribute content across multiple servers for faster loading.

4. **Leverage Browser Caching**:

- Set cache headers to instruct browsers to cache static assets.
- Cached resources load faster on subsequent visits.

5. **Enable Gzip Compression**:

- Enable Gzip or Brotli compression to reduce the size of files transferred.

6. **Prioritize Above-the-Fold Content**:

- Load critical above-the-fold content (visible without scrolling) first.
- Defer loading less critical content until after the initial render.

7. **Reduce Server Response Time**:

- Optimize server performance and reduce response time.
- Use server-side caching mechanisms.

8. **Minimize Redirects**:

- Limit redirects as they add extra round-trips.
- Use direct links instead of unnecessary redirects.

9. **Optimize JavaScript and CSS**:

- Minify JavaScript and CSS files.
- Use asynchronous loading for non-essential scripts.

10. **Avoid Render-Blocking Resources**:

- Defer loading of JavaScript that isn't necessary for initial rendering.
- Place CSS in the document's head to prevent blocking.

11. **Use Lazy Loading**:

- Lazy-load images and other resources that are not immediately visible.
- Improve initial page load time and user experience.

12. **Monitor Performance**:

- Use tools like Google PageSpeed Insights or Lighthouse to analyze performance.
- Regularly check your website's performance metrics.

13. **Optimize for Mobile**:

- Ensure responsive design for mobile devices.
- Consider mobile-first development to prioritize smaller screens.

14. **Minimize Third-Party Scripts**:

- Evaluate the necessity of third-party scripts and only include essential ones.
- Third-party scripts can significantly impact performance.

Implementing these best practices will result in a faster, more efficient website that offers a better user experience.
    `,
    contributors: [{ user: users[5], contributionTime: "11:35 AM" }],
    tags: ["performance-optimization", "web-development", "optimization"],
  },
  {
    id: 4146265,
    question:
      "How can I secure my web application from common vulnerabilities?",
    asker: users[9],
    description:
      "I want to make sure my web application is secure and protected against common cyber threats. I've heard about vulnerabilities like SQL injection and cross-site scripting, but I'm not sure how to prevent them.",
    time: "11:35 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `Securing your web application involves multiple layers of protection. Here's how to guard against common vulnerabilities:

1. **Input Validation**:

- Validate and sanitize all user inputs to prevent SQL injection and cross-site scripting (XSS) attacks.
- Use frameworks or libraries that offer built-in input validation.

2. **Authentication and Authorization**:

- Implement strong user authentication mechanisms.
- Use role-based access control to ensure authorized access to different parts of your app.

3. **Use HTTPS**:

- Use HTTPS to encrypt data transmitted between the user's browser and your server.
- Obtain and install an SSL certificate for your domain.

4. **Secure Sessions**:

- Use secure session management practices.
- Implement session timeouts and regenerate session tokens after login.

5. **Protect Against CSRF**:

- Implement Cross-Site Request Forgery (CSRF) tokens to prevent unauthorized requests from being executed on behalf of a user.

6. **Prevent Clickjacking**:

- Use X-Frame-Options or Content Security Policy (CSP) headers to prevent clickjacking attacks.

7. **Sanitize User-Generated Content**:

- Filter and sanitize user-generated content to prevent malicious scripts from being executed.

8. **Secure Third-Party Libraries**:

- Keep third-party libraries updated to fix security vulnerabilities.
- Only use trusted and well-maintained libraries.

9. **Regular Security Audits**:

- Perform regular security audits and vulnerability assessments.
- Use tools to scan your codebase for known vulnerabilities.

10. **Limit Error Messages**:

- Avoid displaying detailed error messages to users.
- Log errors securely on the server and provide generic messages to users.

11. **Database Security**:

- Use parameterized queries or prepared statements to prevent SQL injection attacks.
- Secure your database server with strong authentication and access controls.

12. **Content Security Policy (CSP)**:

- Implement a Content Security Policy to control which resources can be loaded by your web application.

13. **Keep Software Updated**:

- Regularly update your server, web framework, and any plugins or modules.
- Updates often include security patches.

14. **Educate Your Team**:

- Train your development team about common security vulnerabilities and best practices.
- Ensure everyone follows secure coding guidelines.

By following these practices, you can significantly reduce the risk of common vulnerabilities in your web application.
    `,
    contributors: [
      { user: users[4], contributionTime: "11:40 AM" },
      { user: users[9], contributionTime: "11:45 AM" },
    ],
    tags: ["security", "web-application"],
  },
  {
    id: 1299307,
    question: "What are some popular front-end frameworks in 2023?",
    asker: users[10],
    description:
      "I'm considering learning a new front-end framework to stay up to date in my field. I've been searching online and asking around, but I'm not sure which ones are popular and relevant this year.",
    time: "11:40 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `In 2023, several front-end frameworks are widely used for building modern and responsive web applications:

1. **React**:

- Developed by Facebook, React is a component-based library that enables building dynamic and interactive user interfaces. It's known for its virtual DOM and reactivity, making it highly efficient.

2. **Vue.js**:

- Vue.js is a progressive JavaScript framework that's easy to integrate into existing projects. It emphasizes simplicity and offers features like Vue Router and Vuex for state management.

3. **Angular**:

- Developed by Google, Angular is a full-featured framework for building complex single-page applications (SPAs). It provides powerful tools for routing, state management, and dependency injection.

4. **Svelte**:

- Svelte is a relatively new framework that compiles components into highly efficient JavaScript at build time. It simplifies development by eliminating the need for a virtual DOM.

5. **Ember.js**:

- Ember.js is an opinionated framework that emphasizes convention over configuration. It offers strong conventions for structuring applications and includes features like Ember Data for data management.

6. **Next.js**:

- Next.js is a React framework that provides server-side rendering (SSR) and static site generation (SSG) out of the box. It's popular for 
building SEO-friendly and performant web applications.

7. **Nuxt.js**:

- Nuxt.js is similar to Next.js but is tailored for Vue.js applications. It offers server-side rendering and easy routing configuration for Vue applications.

8. **Stencil**:

- Stencil is a tool for building web components that can be used across different frameworks. It focuses on creating reusable UI components.

9. **Mithril**:

- Mithril is a lightweight and fast front-end framework known for its simplicity and performance. It includes a virtual DOM implementation and routing capabilities.

10. **Preact**:

- Preact is a fast and lightweight alternative to React. It offers a similar API to React but with a smaller footprint, making it ideal for performance-critical applications.

Each of these frameworks has its strengths and weaknesses, and the choice depends on factors like project requirements, team familiarity, and specific use cases.
    `,
    contributors: [{ user: users[8], contributionTime: "11:45 AM" }],
    tags: ["frotend", "framework", "web-dev", "2023"],
  },
  {
    id: 2021284,
    question: "How do I handle state management in a React application?",
    asker: users[11],
    description:
      "I'm building an application in React and struggling with state management. I've tried to manage state on my own, but it's becoming complex and confusing as the application grows.",
    time: "11:50 AM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `## Handling state in a React application can be achieved through various approaches:

1. **Local Component State**:

- For simple components with isolated state needs, use React's built-in useState hook.
- Define and manage state within the component itself.

2. **Prop Drilling**:

- Pass down state as props from a parent component to its child components.
- Effective for passing state to deeply nested components, but can become complex in larger applications.

3. **Context API**:

- Use React's Context API to create a shared state accessible by multiple components.
- Ideal for managing global state that needs to be accessed by components at different levels.

4. **Redux**:

- Implement Redux for centralized state management.
- Create a single source of truth (store) for the entire application.
- Suitable for complex applications with a lot of inter-component communication.

5. **Mobx**:

- Similar to Redux, Mobx provides a way to manage state.
- It uses observables to track changes and update components automatically.

6. **Recoil**:

- Recoil is a state management library developed by Facebook.
- It offers features like atoms (pieces of state) and selectors (computed state).

7. **Apollo Client (GraphQL)**:

- If using GraphQL for data fetching, Apollo Client offers built-in state management.
- It manages local state alongside fetched data seamlessly.

8. **Custom Hooks**:

- Create custom hooks to encapsulate state logic and make it reusable.
- This is a flexible way to manage state in functional components.

9. **Third-Party Libraries**:

- There are many third-party libraries like Zustand, Effector, and Valtio that offer alternative state management solutions.

Choose the state management approach that best fits your project's complexity, team familiarity, and scalability needs.
    `,
    contributors: [
      { user: users[10], contributionTime: "11:55 AM" },
      { user: users[2], contributionTime: "12:00 PM" },
    ],
    tags: ["react", "state", "state-management"],
  },
  {
    id: 4253932,
    question: "What are the key features of ES12 (ECMAScript 2021)?",
    asker: users[12],
    description:
      "I've heard about the release of ES12, and I want to stay up-to-date by learning about its key features. I've visited the official documentation, but the language seems dense and hard to understand.",
    time: "12:00 PM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `# ECMAScript 2021 (ES12) introduced several new features to the JavaScript language:

1. **\`String.prototype.replaceAll()\`**:

- A new method to replace all occurrences of a substring in a string with another substring.

2. **\`Promise.any()\`**:

- Returns a single resolved promise as soon as one of the input promises resolves, or rejects if all input promises reject.

3. **WeakRefs and FinalizationRegistry**:

- Weak references allow objects to be garbage collected even if they are referred to only by weak references.
- FinalizationRegistry allows you to register callbacks to be invoked when an object is garbage collected.

4. **Logical Assignment Operators**:

- Shorter syntax for combining assignment and logical operators, such as \`&&=\`, \`||=\`, and \`??=\`.

5. **Numeric Separators**:

- Allows the use of underscores \`_\` as separators in numeric literals for better readability.

6. **\`String.prototype.matchAll()\`**:

- Returns an iterator of all matched substrings in a string using a regular expression.

7. **\`String.prototype.trimStart()\` and \`String.prototype.trimEnd()\`**:

- New methods to remove whitespace characters from the beginning and end of a string.

8. **Private Fields and Methods**:

- Allows classes to have private instance fields and private methods using the # symbol.

9. **Temporal**:

- Introduces a new API for working with dates and times.

These are just a few of the features introduced in ECMAScript 2021. Each new version of ECMAScript brings improvements and enhancements to the JavaScript language.
    `,
    contributors: [{ user: users[11], contributionTime: "12:05 PM" }],
    tags: ["ecmascript", "es12"],
  },
  {
    id: 6466743,
    question: "How do I implement lazy loading in a web application?",
    asker: users[3],
    description:
      "My web app has a lot of images and data that's causing slow load times. I've heard that lazy loading can help, but I'm not sure how to implement it.",
    time: "12:05 PM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `Lazy loading is a technique that defers the loading of non-critical resources until they are actually needed. This improves initial page load times and saves bandwidth. Here's how to implement lazy loading:

1. **Images**:

- Use the \`loading="lazy"\` attribute on \`<img>\` elements.
- The browser will only load images as they become visible in the viewport.

2. **IFrames**:

- Use the \`loading="lazy"\` attribute on \`<iframe>\` elements to defer the loading of embedded content.

3. **JavaScript and CSS**:

- For JavaScript, use techniques like dynamically importing modules when needed.
- For CSS, consider using conditional loading based on user interactions.

4. **Intersection Observer**:

- Use the Intersection Observer API to detect when an element enters the viewport.
- Load content or trigger actions when the element is in view.

5. **Lazy Load Libraries**:

- Some libraries offer lazy loading features for their components or modules.
- Utilize these features to load only what's necessary initially.

6. **Infinite Scroll**:

- Implement infinite scrolling to load more content as the user scrolls down.
- This technique is common for loading additional items in lists or feeds.

7. **Media Queries**:

- Use media queries to load different stylesheets or resources based on screen size or device capabilities.

8. **Conditional Loading**:

- Use conditional statements in your code to load resources based on specific conditions or user interactions.

Remember to balance lazy loading with providing a good user experience. Critical content should still load promptly to avoid frustrating users.
    `,
    contributors: [
      { user: users[12], contributionTime: "12:10 PM" },
      { user: users[5], contributionTime: "12:15 PM" },
    ],
    tags: ["lazy-loading", "web-app"],
  },
  {
    id: 4458952,
    question: "What are some best practices for version control with Git?",
    asker: users[9],
    description:
      "I've been struggling with managing my code versions and coordinating with other developers on my team using Git. I've made a few errors, like overwriting code and not knowing how to revert changes, so I'm hoping to learn best practices to prevent such problems in the future.",
    time: "12:10 PM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `Using Git for version control is essential for collaboration and tracking changes in your codebase. Here are some best practices to follow:

1. **Use Descriptive Commit Messages**:

- Write clear and meaningful commit messages that describe the purpose of the changes.
- Use present-tense verbs and be concise.

2. **Commit Small and Often**:

- Make frequent, small commits instead of large, infrequent ones.
- Each commit should represent a logical unit of work.

3. **Branching Strategy**:

- Follow a branching strategy that fits your team's workflow (e.g., Gitflow, Feature Branching).
- Use branches for new features, bug fixes, and experiments.

4. **Pull Requests (PRs) or Merge Requests (MRs)**:

- Use PRs or MRs to review and discuss changes before merging them into the main branch.
- Encourages code review and catches issues early.

5. **Code Reviews**:

- Conduct thorough code reviews to catch bugs, improve code quality, and share knowledge.
- Provide constructive feedback and engage in discussions.

6. **Use \`.gitignore\`**:

- Create a \`.gitignore\` file to specify which files or directories should be ignored by Git.
- This avoids tracking unnecessary files (e.g., build artifacts, dependencies).

7. **Rebase vs. Merge**:

- Use \`git merge\` for incorporating changes from one branch into another.
- Use \`git rebase\` to maintain a cleaner commit history by incorporating changes as if they were made sequentially.

8. **Tagging Releases**:

- Use tags to mark significant releases or versions in your repository.
- Tags help you track and reference specific points in your history.

9. **Backup and Remote Repositories**:

- Keep backups of your repositories, and use remote repositories (like GitHub, GitLab, or Bitbucket) for collaboration and redundancy.

10. **Keep Repositories Clean**:

- Regularly clean up branches that are no longer needed.
- Delete merged branches to avoid clutter.

11. **Learn Basic Commands**:

- Familiarize yourself with essential Git commands like \`commit\`, \`push\`, \`pull\`, \`fetch\`, \`merge\`, and \`rebase\`.

By following these Git best practices, you'll ensure smoother collaboration, easier bug tracking, and a more organized version control history.
    `,
    contributors: [
      { user: users[6], contributionTime: "12:15 PM" },
      { user: users[4], contributionTime: "12:20 PM" },
    ],
    tags: ["git", "version-control"],
  },
  {
    id: 6320035,
    question:
      "How do I implement real-time communication in a web application?",
    asker: users[0],
    description:
      "I am building a web application that requires real-time updates and communication. I've looked at some options like AJAX and WebSockets, but I'm unsure of the best way to implement such a feature.",
    time: "12:20 PM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `### Implementing real-time communication in a web application involves using technologies like WebSockets or WebRTC.
    
    Here's a general guide:

1. **WebSockets**:

- WebSockets provide full-duplex communication channels over a single TCP connection.
- Establish a WebSocket connection between the client and server using the WebSocket API.

2. **Choose a WebSocket Library**:

- Consider using libraries like socket.io (Node.js), django-channels (Django), or ActionCable (Ruby on Rails) for easier WebSocket implementation.

3. **Server-Side Implementation**:

- Set up a WebSocket server on the backend to handle incoming connections and manage communication.
- Define event handlers for different types of messages.

4. **Client-Side Implementation**:

- In the browser, use the WebSocket API to create a WebSocket instance and handle messages.
- Send and receive messages through the WebSocket connection.

5. **Broadcasting and Rooms**:

- Implement broadcasting to send messages to multiple clients simultaneously.
- Use rooms or channels to group clients based on common interests.

6. **Authentication and Security**:

- Implement authentication and authorization to ensure secure communication.
- Use secure WebSocket connections (wss://) for encrypted data transfer.

7. **Error Handling**:

- Handle connection errors, timeouts, and disconnections gracefully.
- Provide feedback to users when real-time communication is unavailable.

8. **Testing**:

- Thoroughly test your real-time communication features with multiple users, including edge cases.

9. **Scaling**:

- Consider the scalability of your WebSocket server to handle a large number of concurrent connections.

10. **Use Cases**:

Implement real-time chat applications, live notifications, collaborative editing, online gaming, and more.
    `,
    contributors: [
      { user: users[3], contributionTime: "12:25 PM" },
      { user: users[13], contributionTime: "12:30 PM" },
    ],
    tags: [
      "real-time",
      "chat",
      "communication",
      "web-dev",
      "websockets",
      "web-app",
    ],
  },
  {
    id: 2966252,
    question:
      "What are the benefits of using serverless architecture in web development?",
    asker: users[8],
    description:
      "I've been hearing more about serverless architecture in web development and want to understand the benefits. I've read up on the basic concept, but need to understand why I might want to use it for my projects.",
    time: "12:25 PM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `## Serverless architecture offers several benefits in web development:

1. **Reduced Infrastructure Management**:

- With serverless, you don't need to manage servers, scaling, or provisioning. Cloud providers handle the infrastructure for you.

2. **Cost Efficiency**:

- Serverless services are pay-as-you-go, so you only pay for actual usage.
- There's no need to pay for idle resources, making it cost-effective for applications with varying traffic.

3. **Scalability**:

- Serverless services automatically scale based on demand, handling traffic spikes without manual intervention.

4. **Faster Development**:

- Developers can focus on writing code instead of configuring servers.
- Serverless encourages smaller, focused functions that are easier to develop and maintain.

5. **Automatic Updates and Patches**:

- Cloud providers handle updates, security patches, and maintenance tasks.

6. **Microservices Architecture**:

- Serverless encourages breaking applications into smaller, modular functions, promoting microservices architecture.

7. **Event-Driven**:

- Serverless functions can be triggered by events like HTTP requests, database changes, file uploads, etc.

8. **Reduced Time-to-Market**:

- Serverless architecture accelerates development, enabling quicker deployment of new features and updates.

9. **Global Availability**:

- Cloud providers offer serverless services in multiple regions, providing global availability for your application.

10. **Automatic Scaling**:

- Serverless functions automatically scale up or down based on incoming requests, ensuring optimal performance.

11. **Less Operational Overhead**:

- No need to manage server maintenance, security updates, or scaling decisions.

While serverless architecture has many benefits, it may not be suitable for all use cases. Evaluate your application's requirements and consider factors like latency, complexity, and potential vendor lock-in.
    `,
    contributors: [
      { user: users[2], contributionTime: "12:30 PM" },
      { user: users[6], contributionTime: "12:35 PM" },
    ],
    tags: ["serverless", "web-dev", "architecture", "scalability", "cloud"],
  },
  {
    id: 4665325,
    question: "How do I optimize database queries for better performance?",
    asker: users[4],
    description:
      "Some parts of my application are running slower than they should, and I've noticed that the problems occur when the app is interacting with the database. I suspect that my queries may not be optimized, but I'm unsure how to improve them.",
    time: "12:30 PM",
    date: "July 23, 2023",
    isAnswered: varStatus(),
    answer: `Optimizing database queries is crucial for improving the performance of your application. Here are some strategies:

1. **Use Indexes**:

- Indexes improve query performance by allowing the database to quickly locate rows.
- Identify columns frequently used in WHERE, JOIN, and ORDER BY clauses and create indexes on them.
2. **Avoid SELECT**:

- Retrieve only the columns you need, rather than selecting all columns.
- This reduces the amount of data transferred and improves query speed.
3. Use Joins Wisely:

- Use INNER JOIN, LEFT JOIN, RIGHT JOIN, or OUTER JOIN as needed.
- Be mindful of the performance impact of joins on large tables.
4. **Limit Data Retrieval**:

- Use LIMIT and OFFSET to retrieve a subset of rows, especially for pagination.
- This prevents fetching unnecessary data from the database.
5. **Denormalization**:

- Consider denormalizing data by combining related tables into a single table.
- This can reduce the need for complex joins in some cases.
6. **Caching**:

- Implement caching mechanisms to store frequently accessed data in memory.
- Use tools like Redis or Memcached for caching.
7. **Avoid Subqueries**:

- Subqueries can slow down performance. Try to rewrite queries to eliminate subqueries.
8. **Use EXPLAIN**:

- Use the EXPLAIN command to analyze the execution plan of your query.
- This helps identify bottlenecks and areas for optimization.
9. **Batch Operations**:

- Use batch operations for inserting, updating, or deleting multiple rows in a single query.
- This reduces the number of round-trips to the database.
10. **Normalize Data**:

- Organize data into separate tables to eliminate redundancy and improve data integrity.
- Normalization can help in certain scenarios but may not be necessary for all cases.
11. **Optimize Data Types**:

- Choose appropriate data types for your columns to reduce storage requirements and improve query speed.
12. **Monitor Performance**:

- Regularly monitor your database's performance and analyze slow queries.
- Use profiling tools to identify areas for improvement.
By implementing these practices and constantly monitoring your database's performance, you can achieve better query performance and a more responsive application.
    `,
    contributors: [
      { user: users[5], contributionTime: "12:35 PM" },
      { user: users[1], contributionTime: "12:40 PM" },
    ],
    tags: [
      "database",
      "performance-optimization",
      "query",
      "database-management",
    ],
  },
  {
    id: 4598371,
    question:
      "I'm trying to implement a sorting algorithm in Python for a large dataset, but it seems to be taking forever to process. What are some efficient techniques or optimizations I can apply to improve the performance of my sorting algorithm and handle large data sets more efficiently?",
    asker: users[13],
    description:
      "I'm working with a large dataset in Python, but the sorting algorithm I'm currently using is too slow and inefficient. I've done some research on other algorithms and tried tweaking my implementation, but I haven't found an optimized solution that can process the data in a reasonable time.",
    time: "12:35 PM",
    date: "August 4, 2023",
    isAnswered: varStatus(),
    answer: `### Sorting large datasets efficiently is crucial for optimal performance. Here are some techniques and optimizations you can apply:

1. **Choose the Right Algorithm**:

- Consider using an algorithm with better average-case time complexity.
- For example, quicksort, mergesort, or heapsort are often more efficient than bubble sort or insertion sort for large datasets.
2. **Use Built-In Functions**:

- Python's built-in \`sorted()\` function uses the Timsort algorithm, which is highly optimized for various scenarios.
3. **Optimize Memory Usage**:

- Use in-place sorting algorithms to minimize memory usage.
- Avoid unnecessary data duplication.
4. **Parallelize Sorting**:

- If possible, split the dataset into smaller chunks and sort them in parallel.
- Merge the sorted chunks to obtain the final sorted result.
5. **Use External Sorting**:

- For extremely large datasets that don't fit into memory, consider using external sorting techniques.
- External sorting involves dividing the data into chunks, sorting them in memory, and then merging them using external storage.
6. **Use an Indexed Data Structure**:

- Consider using indexed data structures like B-trees or skip lists for efficient sorting and retrieval.
7. **Preprocessing**:

- If you're performing other operations on the dataset as well, consider sorting it during an earlier stage.
8. **Avoid Unnecessary Comparisons**:

- Optimize comparison operations to minimize the number of comparisons needed.
9. **Implement Early Exit**:

- In some cases, you might detect that the data is already sorted or nearly sorted. You can exit early to save processing time.
10. **Profiling and Benchmarking**:

- Use profiling tools to identify bottlenecks in your sorting algorithm.
- Benchmark your algorithm against other sorting implementations to measure performance.
11. **Consider Language-Specific Optimizations**:

- Some programming languages offer language-specific sorting optimizations.
- In Python, for example, list comprehensions and generator expressions can improve memory efficiency.
Remember that the best approach depends on your specific use case, the characteristics of your dataset, and the constraints of your environment. Analyze your requirements and explore different strategies to find the most suitable optimization techniques for your sorting task.
    `,
    contributors: [{ user: users[4], contributionTime: "12:40 PM" }],
    tags: [
      "python",
      "algorithm",
      "sorting",
      "performance-optimization",
      "data-processing",
      "big-data",
    ],
  },
  {
    id: 9784531,
    question:
      "How can I dynamically update the contents of a select dropdown based on the selected value of another select dropdown using JavaScript?",
    asker: users[0],
    description:
      "I'm building a form with multiple dropdowns and want the options in one dropdown to change based on the user's selection in another dropdown. I've attempted to write a function to handle the change event, but the dynamic updates aren't working as expected.",
    time: "12:40 PM",
    date: "August 5, 2023",
    isAnswered: varStatus(),
    answer: `To achieve dynamic updates of a select dropdown based on the selection of another dropdown, you can use JavaScript and the DOM manipulation. Here's how you can do it:

Assuming you have two select dropdowns, let's call them \`mainDropdown\` and \`dependentDropdown\`:

\`\`\`html
<select id="mainDropdown">
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
  <!-- Add more options as needed -->
</select>

<select id="dependentDropdown">
  <!-- The contents of this dropdown will be dynamically updated based on the selection in mainDropdown -->
</select>
\`\`\`

\`\`\`javascript
// Get references to the select dropdowns
const mainDropdown = document.getElementById("mainDropdown");
const dependentDropdown = document.getElementById("dependentDropdown");

// Define the options for the dependent dropdown based on the main dropdown's selection
const optionsMap = {
  option1: ["Option 1-1", "Option 1-2", "Option 1-3"],
  option2: ["Option 2-1", "Option 2-2", "Option 2-3"],
  // Add more mappings as needed
};

// Function to update the dependent dropdown options
function updateDependentDropdown() {
  const selectedValue = mainDropdown.value;
  const options = optionsMap[selectedValue] || []; // Get the options for the selected value
  dependentDropdown.innerHTML = ""; // Clear existing options

  // Populate the dependent dropdown with new options
  options.forEach((optionText) => {
    const option = document.createElement("option");
    option.value = optionText;
    option.textContent = optionText;
    dependentDropdown.appendChild(option);
  });
}

// Attach an event listener to the main dropdown to trigger updates
mainDropdown.addEventListener("change", updateDependentDropdown);

// Initial update based on the default selection
updateDependentDropdown();
\`\`\`

In this example, when the user selects an option from the \`mainDropdown,\` the \`updateDependentDropdown\` function is called. This function reads the selected value from the main dropdown, retrieves the corresponding options from the \`optionsMap\`, clears the dependent dropdown's existing options, and populates it with the new options.

Remember to adjust the \`optionsMap\` object to match your specific use case and add more mapping entries as needed.

By following this approach, you can dynamically update the contents of a select dropdown based on the selected value of another select dropdown using JavaScript.
    `,
    contributors: [],
    tags: ["javascript", "web-dev", "dropdown", "dynamic", "event-handler"],
  },
];

// Projects
export const projects: Project[] = [
  {
    id: 1,
    owner: users[12],
    name: "React Web Application",
    description: "Building a modern web application using React and Redux.",
    startDate: new Date("2023-01-15"),
    endDate: new Date("2023-04-30"),
    status: "completed",
    stack: ["React", "Redux", "JavaScript"],
    needed: [
      "Frontend Development",
      "UI/UX Design",
      "Responsive Design",
      "Web Development",
      "JavaScript",
      "React",
      "Redux",
      "Test-Driven Development (TDD)",
      "Version Control",
      "Continuous Integration and Deployment (CI/CD)",
      "Quality Assurance",
      "User Interface Design",
      "User Experience Design",
      "Prototyping",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 2,
    owner: users[7],
    name: "Node.js API Development",
    description: "Creating a RESTful API using Node.js, Express, and MongoDB.",
    startDate: new Date("2023-02-10"),
    endDate: new Date("2023-09-30"),
    status: "ongoing",
    stack: ["Node.js", "Express.js", "MongoDB", "JavaScript"],
    needed: [
      "Backend Development",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "API Development",
      "Database Management",
      "RESTful Services",
      "Security Auditing",
      "Quality Assurance",
      "Version Control",
      "Continuous Integration and Deployment (CI/CD)",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 3,
    owner: users[13],
    name: "Python Data Analysis",
    description: "Analyzing large datasets with Python and Pandas.",
    startDate: new Date("2023-03-20"),
    status: "ongoing",
    stack: ["Python", "Pandas"],
    needed: [
      "Data Analysis",
      "Python",
      "Pandas",
      "Statistical Analysis",
      "Data Visualization",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 4,
    owner: users[6],
    name: "Angular E-commerce Platform",
    description:
      "Developing an e-commerce platform using Angular and Firebase.",
    startDate: new Date("2023-04-05"),
    endDate: new Date("2023-06-30"),
    status: "completed",
    stack: ["AngularJS", "Firebase", "JavaScript", "TypeScript"],
    needed: [
      "Frontend Development",
      "UI/UX Design",
      "Responsive Design",
      "Web Development",
      "JavaScript",
      "TypeScript",
      "AngularJS",
      "Firebase",
      "Quality Assurance",
      "Version Control",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 5,
    owner: users[10],
    name: "Java Mobile App",
    description: "Creating a mobile app for Android using Java and SQLite.",
    startDate: new Date("2023-05-10"),
    status: "on_hold",
    stack: ["Java", "SQLite"],
    needed: ["Mobile App Development", "Java", "SQLite", "UI/UX Design"],
    github: "www.github.com",
    image: "",
  },

  {
    id: 6,
    owner: users[11],
    name: "Swift iOS Game",
    description: "Designing and coding an iOS game using Swift and SpriteKit.",
    startDate: new Date("2023-06-25"),
    status: "on_hold",
    stack: ["Swift"],
    needed: [
      "Mobile App Development",
      "Swift",
      "Game Development",
      "UI/UX Design",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 7,
    owner: users[5],
    name: "Vue.js Single Page App",
    description: "Developing a single-page application using Vue.js and Vuex.",
    startDate: new Date("2023-07-15"),
    status: "ongoing",
    stack: ["Vue.js", "JavaScript"],
    needed: [
      "Frontend Development",
      "UI/UX Design",
      "Responsive Design",
      "Web Development",
      "JavaScript",
      "Vue.js",
      "State Management",
      "Quality Assurance",
      "Version Control",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 8,
    owner: users[1],
    name: "Django Blog Platform",
    description: "Building a blog platform using Django and PostgreSQL.",
    startDate: new Date("2023-08-10"),
    endDate: new Date("2023-12-31"),
    status: "ongoing",
    stack: ["Django", "PostgreSQL", "Python"],
    needed: [
      "Backend Development",
      "Django",
      "PostgreSQL",
      "Python",
      "Database Management",
      "Web Development",
      "Security Auditing",
      "Quality Assurance",
      "Version Control",
      "Continuous Integration and Deployment (CI/CD)",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 9,
    owner: users[0],
    name: "C# Desktop Application",
    description: "Creating a desktop application with C# and WinForms.",
    startDate: new Date("2023-09-20"),
    status: "ongoing",
    stack: ["C#"],
    needed: ["Desktop App Development", "C#", "WinForms"],
    github: "www.github.com",
    image: "",
  },
  {
    id: 10,
    owner: users[8],
    name: "Ruby on Rails API",
    description: "Developing a RESTful API using Ruby on Rails and MySQL.",
    startDate: new Date("2023-10-05"),
    endDate: new Date("2024-03-31"),
    status: "ongoing",
    stack: ["MySQL", "Ruby"],
    needed: [
      "Backend Development",
      "Ruby on Rails",
      "MySQL",
      "API Development",
      "Database Management",
      "Quality Assurance",
      "Version Control",
      "Continuous Integration and Deployment (CI/CD)",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 11,
    owner: users[9],
    name: "Unity3D Game Development",
    description: "Building a 3D game using Unity3D and C# scripting.",
    startDate: new Date("2023-11-10"),
    status: "on_hold",
    stack: ["Unity", "C#"],
    needed: ["Game Development", "Unity3D", "C#", "3D Modeling"],
    github: "www.github.com",
    image: "",
  },
  {
    id: 12,
    owner: users[13],
    name: "TypeScript Library",
    description:
      "Creating a reusable library in TypeScript for data manipulation.",
    startDate: new Date("2023-12-25"),
    endDate: new Date("2024-02-28"),
    status: "completed",
    stack: ["TypeScript"],
    needed: [
      "Software Development",
      "TypeScript",
      "Library Development",
      "Quality Assurance",
      "Version Control",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 13,
    owner: users[2],
    name: "Machine Learning Research",
    description:
      "This project aims to conduct in-depth research and experimentation in the field of machine learning. The team will explore various algorithms, models, and techniques to solve real-world problems, such as image recognition, natural language processing, and predictive analytics. The research will involve extensive data analysis, model training, and performance evaluation. The project's goal is to make advancements in machine learning and contribute to the development of intelligent systems.",
    startDate: new Date("2023-07-15"),
    status: "ongoing",
    stack: ["Python", "TensorFlow"],
    needed: [
      "Machine Learning",
      "Python",
      "TensorFlow",
      "Data Analysis",
      "Statistical Analysis",
      "Research",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 14,
    owner: users[5],
    name: "IoT Home Automation System",
    description:
      "In this project, we will design and implement a smart home automation system using Internet of Things (IoT) technologies. The system will integrate various IoT devices, sensors, and actuators to enable remote monitoring and control of home appliances and security features. We will develop a user-friendly mobile app that allows homeowners to manage their smart home remotely. Additionally, the project will emphasize data security and privacy to ensure that the system remains robust and protected against potential cyber threats.",
    startDate: new Date("2023-08-10"),
    endDate: new Date("2023-12-31"),
    status: "ongoing",
    stack: [
      "Python",
      "JavaScript",
      "C",
      "C++",
      "Java",
      "Node.js",
      "Raspberry Pi",
      "Arduino",
      "AWS",
      "MongoDB",
      "MySQL",
      "AngularJS",
    ],

    needed: [
      "IoT Development",
      "Embedded Systems",
      "Python",
      "JavaScript",
      "C",
      "C++",
      "Java",
      "Node.js",
      "AWS",
      "Database Management",
      "Security",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 15,
    owner: users[4],
    name: "Blockchain-Based Supply Chain Solution",
    description:
      "This project aims to create a decentralized supply chain solution using blockchain technology. The goal is to enhance transparency and traceability throughout the supply chain process, reducing fraud and ensuring the authenticity of products. We will leverage blockchain's distributed ledger to record every step of the supply chain, from raw material acquisition to the final product delivery. Smart contracts will automate contract enforcement, payment processing, and other relevant actions. The resulting platform will empower businesses and consumers with trust and reliability in the supply chain ecosystem.",
    startDate: new Date("2023-09-20"),
    status: "ongoing",
    stack: [
      "Polygon",
      "Solidity",
      "Go",
      "JavaScript",
      "Node.js",
      "MongoDB",
      "Express.js",
      "React",
      "Python",
      "C++",
      "Azure",
      "Docker",
      "Git",
      "Prometheus",
    ],
    needed: [
      "Blockchain Development",
      "Smart Contracts",
      "Polygon",
      "Solidity",
      "Go",
      "JavaScript",
      "Node.js",
      "Database Management",
      "Security",
      "Continuous Integration and Deployment (CI/CD)",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 16,
    owner: users[3],
    name: "Augmented Reality Game",
    description:
      "In this project, we will develop an exciting augmented reality (AR) game that blends the virtual world with the real environment. The game will be compatible with AR-capable smartphones and wearable devices, offering players a unique and immersive gaming experience. Players will embark on thrilling adventures as they interact with virtual characters and objects overlaid on the real-world surroundings. Our team will focus on optimizing the game's performance, designing captivating visuals, and incorporating innovative AR interactions to captivate players and keep them engaged.",
    startDate: new Date("2023-10-05"),
    endDate: new Date("2024-03-31"),
    status: "ongoing",
    stack: ["C#", "C++", "Unity", "Blender", "Maya", "OpenGL"],
    needed: [
      "Game Development",
      "Augmented Reality",
      "Unity",
      "C#",
      "C++",
      "3D Modeling",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 17,
    owner: users[0],
    name: "Flutter Mobile App",
    description:
      "Developing a cross-platform mobile app using Flutter for iOS and Android.",
    startDate: new Date("2023-01-15"),
    status: "completed",
    stack: ["Flutter", "Dart"],
    needed: ["Mobile App Development", "Flutter", "Dart", "UI/UX Design"],
    github: "www.github.com",
    image: "",
  },
  {
    id: 18,
    owner: users[1],
    name: "PHP Web Application",
    description:
      "Creating a dynamic web application using PHP and MySQL for backend processing.",
    startDate: new Date("2023-02-10"),
    endDate: new Date("2023-09-30"),
    status: "ongoing",
    stack: ["PHP", "MySQL"],
    needed: [
      "Backend Development",
      "PHP",
      "MySQL",
      "Web Development",
      "Database Management",
      "Security",
      "Quality Assurance",
      "Version Control",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 19,
    owner: users[10],
    name: "Data Visualization Dashboard",
    description:
      "Building an interactive data visualization dashboard using D3.js and React.",
    startDate: new Date("2023-03-20"),
    status: "ongoing",
    stack: ["D3.js", "React", "JavaScript"],
    needed: [
      "Frontend Development",
      "Data Visualization",
      "D3.js",
      "React",
      "JavaScript",
      "UI/UX Design",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 20,
    owner: users[12],
    name: "Rust Game Engine",
    description:
      "Designing a simple 2D game engine using Rust programming language.",
    startDate: new Date("2023-04-05"),
    endDate: new Date("2023-06-30"),
    status: "completed",
    stack: ["Rust"],
    needed: [
      "Game Development",
      "Rust",
      "Engine Development",
      "Quality Assurance",
      "Version Control",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 21,
    owner: users[13],
    name: "Cloud-Based Chat Application",
    description:
      "Developing a real-time chat application using WebSocket and cloud services like AWS.",
    startDate: new Date("2023-05-10"),
    status: "on_hold",
    stack: ["AWS"],
    needed: ["Backend Development", "AWS", "WebSocket", "Chat Application"],
    github: "www.github.com",
    image: "",
  },
  {
    id: 22,
    owner: users[6],
    name: "AR Interior Design App",
    description:
      "Creating an augmented reality app for interior design visualization using ARKit and ARCore.",
    startDate: new Date("2023-06-25"),
    status: "on_hold",
    stack: ["C#", "C++", "Unity", "Blender", "Maya", "OpenGL"],
    needed: [
      "App Development",
      "Augmented Reality",
      "ARKit",
      "ARCore",
      "C#",
      "C++",
      "3D Modeling",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 23,
    owner: users[13],
    name: "Jupyter Notebook Analytics",
    description:
      "Using Jupyter Notebook to perform in-depth data analysis and generate insights.",
    startDate: new Date("2023-07-15"),
    status: "ongoing",
    stack: ["Jupyter", "Python", "Pandas", "NumPy"],
    needed: [
      "Data Analysis",
      "Jupyter Notebook",
      "Python",
      "Pandas",
      "NumPy",
      "Statistical Analysis",
    ],
    github: "www.github.com",
    image: "",
  },
  {
    id: 24,
    owner: users[3],
    name: "Electron Desktop App",
    description:
      "Building a cross-platform desktop app using Electron, HTML, CSS, and JavaScript.",
    startDate: new Date("2023-08-10"),
    endDate: new Date("2023-12-31"),
    status: "ongoing",
    stack: ["Electron", "HTML", "CSS", "JavaScript"],
    needed: [
      "Desktop App Development",
      "Electron",
      "HTML",
      "CSS",
      "JavaScript",
    ],
    github: "www.github.com",
    image: "",
  },
];

export const tags: { value: string; label: string }[] = [
  { value: "javascript", label: "javascript" },
  { value: "python", label: "python" },
  { value: "java", label: "java" },
  { value: "c#", label: "c#" },
  { value: "php", label: "php" },
  { value: "html", label: "html" },
  { value: "css", label: "css" },
  { value: "reactjs", label: "reactjs" },
  { value: "angular", label: "angular" },
  { value: "node.js", label: "node.js" },
  { value: "ruby-on-rails", label: "ruby-on-rails" },
  { value: "django", label: "django" },
  { value: "express", label: "express" },
  { value: "vue.js", label: "vue.js" },
  { value: "typescript", label: "typescript" },
  { value: "android", label: "android" },
  { value: "ios", label: "ios" },
  { value: "swift", label: "swift" },
  { value: "kotlin", label: "kotlin" },
  { value: "flutter", label: "flutter" },
  { value: "firebase", label: "firebase" },
  { value: "aws", label: "aws" },
  { value: "docker", label: "docker" },
  { value: "kubernetes", label: "kubernetes" },
  { value: "git", label: "git" },
  { value: "github", label: "github" },
  { value: "sql", label: "sql" },
  { value: "mysql", label: "mysql" },
  { value: "postgresql", label: "postgresql" },
  { value: "mongodb", label: "mongodb" },
  { value: "rest", label: "rest" },
  { value: "graphql", label: "graphql" },
  { value: "api", label: "api" },
  { value: "json", label: "json" },
  { value: "xml", label: "xml" },
  { value: "npm", label: "npm" },
  { value: "yarn", label: "yarn" },
  { value: "webpack", label: "webpack" },
  { value: "gulp", label: "gulp" },
  { value: "babel", label: "babel" },
  { value: "sass", label: "sass" },
  { value: "less", label: "less" },
  { value: "css3", label: "css3" },
  { value: "html5", label: "html5" },
  { value: "responsive-design", label: "responsive-design" },
  { value: "design-patterns", label: "design-patterns" },
  { value: "algorithm", label: "algorithm" },
  { value: "data-structures", label: "data-structures" },
  { value: "testing", label: "testing" },
  { value: "unit-testing", label: "unit-testing" },
  { value: "integration-testing", label: "integration-testing" },
  { value: "continuous-integration", label: "continuous-integration" },
  { value: "agile", label: "agile" },
  { value: "scrum", label: "scrum" },
  { value: "kanban", label: "kanban" },
  { value: "devops", label: "devops" },
  { value: "docker-compose", label: "docker-compose" },
  { value: "linux", label: "linux" },
  { value: "bash", label: "bash" },
  { value: "shell", label: "shell" },
  { value: "windows", label: "windows" },
  { value: "macos", label: "macos" },
  { value: "version-control", label: "version-control" },
  { value: "agile", label: "agile" },
  { value: "scrum", label: "scrum" },
  { value: "kanban", label: "kanban" },
  { value: "devops", label: "devops" },
  { value: "docker-compose", label: "docker-compose" },
  { value: "linux", label: "linux" },
  { value: "bash", label: "bash" },
  { value: "shell", label: "shell" },
  { value: "windows", label: "windows" },
  { value: "macos", label: "macos" },
  { value: "version-control", label: "version-control" },
  { value: "git", label: "git" },
  { value: "svn", label: "svn" },
  { value: "mercurial", label: "mercurial" },
  { value: "perforce", label: "perforce" },
  { value: "agile-methodology", label: "agile-methodology" },
  { value: "waterfall", label: "waterfall" },
  { value: "pm2", label: "pm2" },
  { value: "npm-scripts", label: "npm-scripts" },
  { value: "webpack-config", label: "webpack-config" },
  { value: "eslint", label: "eslint" },
  { value: "prettier", label: "prettier" },
  { value: "babel", label: "babel" },
  { value: "webpack-plugins", label: "webpack-plugins" },
  { value: "webpack-loaders", label: "webpack-loaders" },
  { value: "webpack-dev-server", label: "webpack-dev-server" },
  { value: "redux", label: "redux" },
  { value: "mobx", label: "mobx" },
  { value: "ngrx", label: "ngrx" },
  { value: "rxjs", label: "rxjs" },
  { value: "state-management", label: "state-management" },
  { value: "design-patterns", label: "design-patterns" },
  { value: "solid-principles", label: "solid-principles" },
  { value: "oop", label: "oop" },
  { value: "functional-programming", label: "functional-programming" },
  { value: "react-hooks", label: "react-hooks" },
  { value: "custom-hooks", label: "custom-hooks" },
];

export const inboxItems: {
  randUser: User;
  randName: string;
  randQuestion: string;
  link: string;
  unread: boolean;
}[] = [
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
  {
    randUser: randEl(users),
    randName: randEl(users).name,
    randQuestion: randEl(questions).question,
    // item: `${randEl(users).name} responded to ${randEl(questions).question}`,
    link: `/questions/${randEl(questions).id}`,
    unread: true,
  },
];

export const techSkills: string[] = [
  "Problem Solving",
  "Critical Thinking",
  "Data Analysis",
  "Algorithm Design",
  "Machine Learning",
  "Artificial Intelligence",
  "Cloud Computing",
  "DevOps",
  "Agile Methodology",
  "Cybersecurity",
  "Network Architecture",
  "Database Management",
  "Big Data",
  "IoT (Internet of Things)",
  "UI/UX Design",
  "Product Management",
  "Project Management",
  "Data Visualization",
  "Statistical Analysis",
  "Version Control",
  "Continuous Integration",
  "Scrum",
  "Kanban",
  "Business Intelligence",
  "Natural Language Processing",
  "Robotics",
  "Digital Marketing",
  "Ethical Hacking",
  "Information Architecture",
  "User Research",
  "User-Centered Design",
  "User Interface Design",
  "User Experience Design",
  "System Architecture",
  "Mobile App Development",
  "Web Development",
  "API Design",
  "Test Automation",
  "Quality Assurance",
  "Parallel Computing",
  "Distributed Systems",
  "Containerization",
  "Microservices",
  "Virtual Reality",
  "Augmented Reality",
  "Blockchain",
  "Quantum Computing",
  "Data Engineering",
  "Data Science",
  "Business Analysis",
  "Risk Management",
  "Change Management",
  "IT Strategy",
  "Digital Transformation",
  "Leadership",
  "Time Management",
  "Communication Skills",
  "Cross-Functional Collaboration",
  "Strategic Thinking",
  "Decision Making",
  "Innovation",
  "Adaptability",
  "Troubleshooting",
  "Emotional Intelligence",
  "Crisis Management",
  "Vendor Management",
  "Ethical Leadership",
  "Remote Collaboration",
  "Cognitive Flexibility",
  "Stress Management",
  "Cultural Awareness",
  "Business Acumen",
  "Financial Literacy",
  "Data Privacy",
  "Compliance",
  "API Integration",
  "Frontend Development",
  "Backend Development",
  "Mobile UI Design",
  "Web UI Design",
  "Cloud Security",
  "Risk Assessment",
  "Incident Response",
  "Data Governance",
  "Predictive Analytics",
  "E-commerce",
  "Content Management",
  "Search Engine Optimization (SEO)",
  "User Acquisition",
  "Social Media Marketing",
  "Brand Strategy",
  "Content Strategy",
  "Technical Writing",
  "Presentation Skills",
  "Customer Relationship Management (CRM)",
  "Supply Chain Management",
  "Business Process Improvement",
  "Vendor Negotiation",
  "Data Warehousing",
  "Data Modeling",
  "Network Security",
  "Authentication and Authorization",
  "Data Ethics",
  "Change Leadership",
  "Code Refactoring",
  "Software Architecture",
  "Code Review",
  "Responsive Design",
  "Mobile Development",
  "Backend Development",
  "Frontend Development",
  "Web Design",
  "User Interface Design",
  "User Experience Design",
  "Wireframing",
  "Prototyping",
  "Product Design",
  "User-Centered Design",
  "Interaction Design",
  "Accessibility Design",
  "Database Administration",
  "Data Modeling",
  "Data Warehousing",
  "ETL (Extract, Transform, Load)",
  "Database Optimization",
  "Network Administration",
  "Firewall Management",
  "IT Support",
  "Serverless Architecture",
  "Container Orchestration",
  "Infrastructure as Code",
  "Microservices Architecture",
  "Cloud Architecture",
  "Cloud Security",
  "Penetration Testing",
  "Vulnerability Assessment",
  "Threat Intelligence",
  "Intrusion Detection",
  "Identity and Access Management (IAM)",
  "Secure Software Development",
  "Secure Coding Practices",
  "Incident Response",
  "Risk Assessment",
  "Security Auditing",
  "Compliance Management",
  "IT Governance",
  "Technical Troubleshooting",
  "Root Cause Analysis",
  "Network Monitoring",
  "Performance Tuning",
  "Load Balancing",
  "Backup and Recovery",
  "API Development",
  "API Integration",
  "RESTful Services",
  "GraphQL",
  "Microservices Development",
  "Automated Testing",
  "Continuous Integration and Deployment (CI/CD)",
  "Scalability",
  "Reliability Engineering",
  "Monitoring and Alerting",
  "Version Control Systems",
  "Software Development Life Cycle (SDLC)",
  "Agile Development",
  "Scrum",
  "Kanban",
  "Pair Programming",
  "Test-Driven Development (TDD)",
  "Behavior-Driven Development (BDD)",
  "Cross-Functional Collaboration",
  "Team Leadership",
  "Project Management",
  "Product Management",
  "Agile Coaching",
  "Stakeholder Management",
  "Strategic Planning",
  "Data Analysis",
  "Business Intelligence",
  "Predictive Analytics",
  "Data Visualization",
  "Machine Learning",
  "Natural Language Processing",
  "Data Mining",
  "Statistical Analysis",
  "Quantitative Analysis",
  "A/B Testing",
  "Market Research",
  "Competitor Analysis",
  "Financial Analysis",
  "Decision Analysis",
  "Digital Marketing",
  "Social Media Marketing",
  "Content Marketing",
  "Search Engine Optimization (SEO)",
  "Search Engine Marketing (SEM)",
  "Email Marketing",
  "Conversion Rate Optimization",
  "User Acquisition",
  "Customer Relationship Management (CRM)",
  "Salesforce Management",
  "E-commerce",
  "Supply Chain Management",
  "Business Process Improvement",
  "Change Management",
  "Quality Management",
  "Lean Methodology",
  "Six Sigma",
  "Vendor Management",
  "Contract Negotiation",
  "Legal and Regulatory Compliance",
  "ITIL Framework",
  "Technical Writing",
  "Documentation",
  "Presentation Skills",
  "Emotional Intelligence",
  "Conflict Resolution",
  "Negotiation Skills",
  "Time Management",
  "Leadership",
  "Adaptability",
  // ...and more
];
