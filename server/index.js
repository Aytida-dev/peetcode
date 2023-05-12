const express = require("express");
const app = express();
const port = 4000;
const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret";
const { auth } = require("./middleware");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());

const USERS = [];
const SUBMISSIONS = [];
let USER_ID_COUNTER = 1;
const PROBLEMS = [
  {
    problemId: "1",
    title: "401. Bitwise AND of Numbers Range",
    difficulty: "Medium",
    acceptance: "42%",
    description:
      "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    exampleIn: "left = 5, right = 7",
    exampleOut: "4",
  },
  {
    problemId: "2",
    title: "205. Add two numbers",
    difficulty: "Medium",
    acceptance: "41%",
    description:
      "Given two numbers, add them and return them in integer range. use MOD=1e9+7",
    exampleIn: "a = 100 , b = 200",
    exampleOut: "300",
  },
  {
    problemId: "3",
    title: "202. Happy Number",
    difficulty: "Easy",
    acceptance: "54.9%",
    description: "Write an algorithm to determine if a number n is happy.",
    exampleIn: "n = 19",
    exampleOut: "true",
  },
  {
    problemId: "4",
    title: "203. Remove Linked List Elements",
    difficulty: "Hard",
    acceptance: "42%",
    description: "Given number k , removed kth element",
    exampleIn: "list: 1->2->3 , k=2",
    exampleOut: "1->3",
  },
  {
    problemId: "5",
    title: "201. Bitwise AND of Numbers Range",
    difficulty: "Medium",
    acceptance: "42%",
    description:
      "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    exampleIn: "left = 5, right = 7",
    exampleOut: "4",
  },
  {
    problemId: "6",
    title: "205. Add two numbers",
    difficulty: "Medium",
    acceptance: "41%",
    description:
      "Given two numbers, add them and return them in integer range. use MOD=1e9+7",
    exampleIn: "a = 100 , b = 200",
    exampleOut: "300",
  },
  {
    problemId: "7",
    title: "202. Happy Number",
    difficulty: "Easy",
    acceptance: "54.9%",
    description: "Write an algorithm to determine if a number n is happy.",
    exampleIn: "n = 19",
    exampleOut: "true",
  },
  {
    problemId: "8",
    title: "203. Remove Linked List Elements",
    difficulty: "Hard",
    acceptance: "42%",
    description: "Given number k , removed kth element",
    exampleIn: "list: 1->2->3 , k=2",
    exampleOut: "1->3",
  },
];

// Routes
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email or password is missing" });
  }
  const user = USERS.find((user) => user.email === email);
  if (user) {
    return res.status(400).json({ error: "email already exists" });
  }
  const newUser = {
    userId: USER_ID_COUNTER++,
    email: email,
    password: password,
  };

  USERS.push(newUser);
  res.status(201).json({ msgg: "User created" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email or password is missing" });
  }
  const user = USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    return res.status(400).json({ error: "email or password is incorrect" });
  }
  const token = jwt.sign({ userId: user.userId }, JWT_SECRET);
  res.status(200).json({ token: token });
});

app.get("/problems", (req, res) => {
  const filteredProblems = PROBLEMS.map((x) => ({
    problemId: x.problemId,
    difficulty: x.difficulty,
    acceptance: x.acceptance,
    title: x.title,
  }));

  res.json({
    problems: filteredProblems,
  });
});

app.get("/problems/:Id", (req, res) => {
  const problemId = req.params.Id;
  const problem = PROBLEMS.find((x) => x.problemId === problemId);
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  res.json({
    problem: problem,
  });
});

app.get("/me", auth, (req, res) => {
  const user = USERS.find((user) => user.userId === req.userId);
  res.json({
    user: user,
  });
})

app.get("/submissions/:problemId", auth, (req, res) => {
  const problemId = req.params.problemId;
  const submissions = SUBMISSIONS.filter(x => x.problemId === problemId && x.userId === req.userId);
  res.json({
      submissions,
  })
})

app.post("/submissions", auth, (req, res) => {
  const isCorrect = Math.random() < 0.5;
    const problemId = req.body.problemId;
    const submission = req.body.submission;

    if (isCorrect) {
        SUBMISSIONS.push({
            submission,
            problemId,
            userId: req.userId,
            status: "AC"
        })
        return res.json({
            status: "AC"
        })
    } else {

        SUBMISSIONS.push({
            submission,
            problemId,
            userId: req.userId,
            status: "WA"
        })
        return res.json({
            status: "WA"
        })
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
