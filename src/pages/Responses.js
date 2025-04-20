import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../api";
import moment from "moment";
import { Link } from "react-router-dom";
import { FaEye, FaDownload } from "react-icons/fa";

const UserResponse = () => {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);

  const getResponses = async () => {
    try {
      const [responsesRes, quizRes] = await Promise.all([
        axios.get(`${baseUrl}/api/score/all`),
        axios.get(`${baseUrl}/api/quiz/all`),
      ]);

      const quizzes = quizRes.data;

      const enrichedResponses = responsesRes.data.map((res) => {
        const enrichedAnswers =
          res.answers?.map((ans) => {
            const matchingQuiz = quizzes.find((q) => q._id === ans.questionId);
            return {
              ...ans,
              question: matchingQuiz?.question || "Unknown question",
              correct: matchingQuiz?.correctAnswer || "N/A",
            };
          }) || [];

        return { ...res, answers: enrichedAnswers };
      });

      setResponses(enrichedResponses);
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getResponses();
  }, []);

  const exportCSV = () => {
    let csvContent =
      "Name,Score,Date,Question,Selected Answer,Correct Answer\n";

    responses.forEach((res) => {
      if (res.answers && res.answers.length > 0) {
        res.answers.forEach((a) => {
          const row = [
            res.name,
            `${res.score}%`,
            moment(res.createdAt).format("LLL"),
            `"${a.question?.replace(/"/g, '""') || ""}"`,
            `"${a.selected || ""}"`,
            `"${a.correct || ""}"`,
          ];
          csvContent += row.join(",") + "\n";
        });
      } else {
        const row = [
          res.name,
          `${res.score}%`,
          moment(res.createdAt).format("LLL"),
          "",
          "",
          "",
        ];
        csvContent += row.join(",") + "\n";
      }
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `user_responses_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold">📊 User Quiz Responses</h2>
        <div className="d-flex gap-2">
          <button onClick={exportCSV} className="btn btn-success">
            <FaDownload className="me-2" />
            Export as CSV
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          {responses.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((e) => (
                    <tr key={e._id}>
                      <td>{e.name}</td>
                      <td>
                        <span className="badge bg-success px-3 py-2">
                          {e.score}%
                        </span>
                      </td>
                      <td>{moment(e.createdAt).format("LLL")}</td>
                      <td className="text-center">
                        <Link
                          to={`/responses/${e._id}`}
                          className="btn btn-sm btn-info"
                        >
                          <FaEye className="me-1" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <h5 className="text-muted">😕 No responses found.</h5>
              <p>
                Ask users to participate in the quiz to see their scores here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserResponse;
