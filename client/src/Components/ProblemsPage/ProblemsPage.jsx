import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./ProblemsPage.css";
import { backendUrl } from "../../constants.js";
import Alert from "../alert/alert";

const ProblemsPage = () => {
  const [CodeSeg, setCodeSeg] = useState("");
  const { pid } = useParams();
  const cleanId = pid.substring(1);
  const [problem, setProblem] = useState(null);
  const [submission, setSubmission] = useState("");
  const [pastSubmissions, setPastSubmissions] = useState([]);
  const [submissionError, setSubmissionError] = useState("No Submissions Yet");
  const [alert, setAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const initSubmissions = async () => {
    const response = await fetch(`${backendUrl}/submissions/${cleanId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });

    if(response.status === 200){
      const json = await response.json();
      setPastSubmissions(json.submissions.reverse());
    }
    else{
      setSubmissionError("Login to see your submissions");
    }

    
  };

  useEffect(() => {
    const init = async () => {
      const response = await fetch(`${backendUrl}/problems/${cleanId}`, {
        method: "GET",
      });

      const json = await response.json();
      setProblem(json.problem);
    };

    init();
    initSubmissions();
  }, []);

  const handleKey = (event) => {
    if (event.key == "Tab") {
      event.preventDefault();
      const { selectionStart, selectionEnd, value } = event.target;
      const val =
        value.substring(0, selectionStart) +
        "\t" +
        value.substring(selectionStart);
      event.target.value = val;
      event.target.selectionStart = event.target.selectionEnd =
        selectionStart + 1;
    }
    setCodeSeg(event.value);
  };

  const submit = async () => {
    const response = await fetch(`${backendUrl}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ submission: submission, problemId: cleanId }),
    });
    initSubmissions();
    setAlertProps({
      message: "Submission successful",
      type: "success",
    })
    setSubmission("");
    setAlert(true);
  };

  setTimeout(() => {
    setAlert(false);
  }, 2000)

  return (
    <div>
      {alert && <Alert message={alertProps.message} type={alertProps.type} />}
      {problem ? (
        <div id="problempage" className="flex-row">
          <div className="ques">
            <h1>{problem.title}</h1>
            <h5>Description</h5>
            <p>{problem.description}</p>
            <code>Input : {problem.exampleIn}</code>
            <code>Output : {problem.exampleOut}</code>
            <div className="submissions">
              <h5>Submissions</h5>
              <div className="submissionList">
                {pastSubmissions.length > 0 ? (
                  pastSubmissions.map((submission, index) => {
                    return (
                      <div className="eachSubmission" key={index}>
                        <p>{submission.submission}</p>
                        
                        <p
                          style={{
                            color: submission.status === "AC" ? "green" : "red",
                          }}
                        >
                          {submission.status}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div>{submissionError}</div>
                )}
              </div>
            </div>
          </div>
          <div className="code">
            <h1>Code Here</h1>
            <div className="code-form">
              <textarea
                onChange={(e) => setSubmission(e.target.value)}
                name="SolvedCode"
                onKeyDown={(event) => handleKey(event)}
                value={submission}
              ></textarea>
              <button
                type="submit"
                id="submit"
                onClick={() => submit()}
                disabled={submission === ""}
              >
                SubmitCode
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>The searched Question Doesn't exist</div>
      )}
    </div>
  );
};

export default ProblemsPage;
