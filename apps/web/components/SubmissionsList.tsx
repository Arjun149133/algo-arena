import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

type Submission = {
  id: string;
  problemAttemptId: string;
  code: string;
  language: string;
  status: string;
  createdAt: string;
};

const SubmissionsList = ({
  problemId,
  submissionId,
}: {
  problemId: string;
  submissionId: string | null;
}) => {
  const [submissionList, setSubmissionList] = useState<Submission[]>([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoader(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submission/problem/${problemId}`
      );

      if (res.status !== 200) {
        console.error("Error fetching submissions");
        return;
      }

      if (res.data.length === 0) {
        setLoader(false);
        return;
      }

      const filteredSubmissions = res.data[0].submissions.filter(
        (submission: Submission) => submission.status !== "PENDING"
      );

      setSubmissionList(filteredSubmissions);
      setLoader(false);
    };

    fetchSubmissions();
  }, [problemId, submissionId]);

  if (loader) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      {submissionList.length === 0 ? (
        <div>No Submissions.</div>
      ) : (
        <div>
          <div className=" grid grid-cols-6 gap-4 mb-4">
            <h2 className=" col-span-2">Created At</h2>
            <h2 className=" col-span-2">Status</h2>
            <h2 className=" col-span-1">Language</h2>
            <h1 className=" col-span-1">Code</h1>
          </div>
          <div>
            {submissionList.map((submission) => (
              <div key={submission.id} className=" grid grid-cols-6 gap-4 mb-4">
                <p className=" col-span-2">
                  {new Date(submission.createdAt).toLocaleString()}
                </p>
                <p
                  className={`${submission.status.startsWith("ACCEPTED") ? " text-green-500" : " text-red-400"} col-span-2`}
                >
                  {submission.status}
                </p>
                <p className=" col-span-1">{submission.language}</p>
                <Dialog>
                  <DialogTrigger>View Code</DialogTrigger>
                  <DialogContent className=" bg-leetcode-dark">
                    <DialogHeader>
                      <DialogTitle className=" text-md text-gray-400">
                        Code:
                      </DialogTitle>
                      <DialogDescription className=" text-md">
                        {submission.code.split("\n").map((line, index) => (
                          <span key={index} className=" flex flex-col">
                            {line}
                          </span>
                        ))}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsList;
