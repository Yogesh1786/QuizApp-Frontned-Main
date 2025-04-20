import React, { useEffect, useState } from "react";
import { baseUrl } from "../api";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const QuizHistory = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);

  const getResponses = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/score/response/${responseId}`);
      setResponses(data.data); // should include selectedAnswer, correctAnswer, etc.
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getResponses();
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Quiz Response Summary</h3>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Selected Answer</th>
              <th>Correct Answer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {responses.length > 0 ? (
              responses.map((e, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td style={{ maxWidth: "400px", whiteSpace: "normal" }}>{e.question}</td>
                  <td>{e.selectedAnswer || "N/A"}</td>
                  <td>{e.correctAnswer || "N/A"}</td>
                  <td>
                    <span className={`badge ${e.isCorrect ? "bg-success" : "bg-danger"}`}>
                      {e.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No responses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizHistory;
