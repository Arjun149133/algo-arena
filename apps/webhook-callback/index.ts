import express from "express";
import { randomUUID } from "crypto";
import { prisma } from "@repo/db/client";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

const runMap: Map<string, string[]> = new Map();
const tokenMap: Map<string, string | null> = new Map();

type RunData = {
  token: string;
};

type TestCaseResult = {
  result: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  message?: string;
};

app.post("/webhook/run/create", async (req, res) => {
  const { submissionTokenArray: data } = req.body;

  const newRunId = randomUUID();

  runMap.set(newRunId, []);

  data.map((value: RunData) => {
    tokenMap.set(value.token, null);
    runMap.get(newRunId)?.push(value.token);
  });

  res.status(200).json({ runId: newRunId });
});

app.post("/webhook/run/check", async (req, res) => {
  const data = req.body;

  const runId = data.runId;

  const tokenArray = runMap.get(runId);

  if (!tokenArray) {
    res.status(404).json({ error: "Run not found" });
    return;
  }

  let allCompleted = true;
  for (const token of tokenArray) {
    if (tokenMap.get(token) === null) {
      allCompleted = false;
      break;
    }
  }

  if (allCompleted) {
    // const results: TestCaseResult[] = tokenArray.map(async (token) => {
    //   const res = await axios.get(
    //     `${process.env.JUDGE0_URL}/submissions/${token}?base64_encoded=false`
    //   );

    //   const data = res.data;

    //   if (data.error) {
    //     return {
    //       result: data.error as string,
    //       status: "PENDING",
    //     };
    //   }

    //   if (data.status.description === "Accepted") {
    //     return {
    //       result: data.stdout as string,
    //       status: "ACCEPTED",
    //     };
    //   } else if (data.status.description === "Wrong Answer") {
    //     return {
    //       result: data.stdout as string,
    //       status: "REJECTED",
    //     };
    //   } else {
    //     return {
    //       result: data.stderr as string,
    //       status: "REJECTED",
    //       message: data.message as string,
    //     };
    //   }
    // });

    res.status(200).json({
      status: "COMPLETED",
      results: Array.from(tokenArray),
    });
  } else {
    res.status(200).json({ status: "PENDING" });
  }
});

app.put("/webhook/run", async (req, res) => {
  const data = req.body;

  const token = data.token;

  let result = data.status.description;

  if (data.compile_output) {
    result =
      data.status.description +
      "," +
      Buffer.from(data.stderr, "base64").toString("utf8");
  }

  tokenMap.set(token, result);

  res.status(200).send("OK");
});

app.post("/webhook/submission/check", async (req, res) => {
  try {
    const data = req.body;

    const submissionId: string = data.submissionId;

    const testCases = await prisma.tokenTestCase.findMany({
      where: {
        submissionId: submissionId,
      },
    });

    let allCompleted = true;

    for (const testCase of testCases) {
      if (testCase.status === "PENDING") {
        allCompleted = false;
        break;
      }
    }

    if (allCompleted) {
      for (const testCase of testCases) {
        if (testCase.status !== "ACCEPTED") {
          await prisma.submission.update({
            where: {
              id: submissionId,
            },
            data: {
              status: "REJECTED",
            },
          });
          break;
        }
      }

      res.status(200).json({
        status: "COMPLETED",
        results: testCases,
      });
    } else {
      res.status(200).json({ status: "PENDING" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/webhook/submission", async (req, res) => {
  try {
    const data = req.body;
    const token: string = data.token;

    console.log(data);

    if (token === undefined) {
      res.status(400).send("Token is required");
      return;
    }

    const status = getStatusFromDescription(data.status.description);

    await prisma.$transaction(async (prisma) => {
      await prisma.tokenTestCase.update({
        where: {
          tokenId: token,
        },
        data: {
          status: status,
          // message: Buffer.from(data.stderr, "base64").toString("utf8"),
        },
      });
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const getStatusFromDescription = (description: string) => {
  if (description === "Accepted") {
    return "ACCEPTED";
  } else if (description === "Wrong Answer") {
    return "WRONG_ANSWER";
  } else if (description.startsWith("Time Limit Exceeded")) {
    return "TIME_LIMIT_EXCEEDED";
  } else if (description.startsWith("Memory Limit Exceeded")) {
    return "MEMORY_LIMIT_EXCEEDED";
  } else if (description.startsWith("Runtime Error")) {
    return "RUNTIME_ERROR";
  } else if (description.startsWith("Compilation Error")) {
    return "COMPILATION_ERROR";
  }
};
