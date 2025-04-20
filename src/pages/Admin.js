import React, { useEffect, useState } from "react";
import { baseUrl } from "../api";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaHome } from "react-icons/fa";
import "../components/QuizList.css";

const AdminPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    id: "",
    text: "",
  });

  const fetchAllQuiz = () => {
    axios
      .get(`${baseUrl}/api/quiz/all`)
      .then((res) => {
        setQuizzes(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching quizzes:", err));
  };

  const handleDeleteOne = (id) => {
    if (window.confirm("Delete this quiz?")) {
      axios.delete(`${baseUrl}/api/quiz/delete/${id}`).then(() => fetchAllQuiz());
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("This will delete ALL quizzes. Are you sure?")) {
      axios.delete(`${baseUrl}/api/quiz/delete/all`).then(() => fetchAllQuiz());
    }
  };

  const openEditModal = (id, question) => {
    setEditModal({ isOpen: true, id, text: question });
  };

  const handleEditChange = (e) => {
    setEditModal((prev) => ({ ...prev, text: e.target.value }));
  };

  const submitEdit = () => {
    axios
      .put(`${baseUrl}/api/quiz/update/${editModal.id}`, {
        question: editModal.text,
      })
      .then(() => {
        fetchAllQuiz();
        setEditModal({ isOpen: false, id: "", text: "" });
      })
      .catch((err) => console.error("Error updating quiz:", err));
  };

  useEffect(() => {
    fetchAllQuiz();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-primary">📋 Quiz Admin Panel</h2>
        <div className="d-flex gap-3 flex-wrap">
          <Link to="/" className="btn btn-outline-primary d-flex align-items-center gap-2">
            <FaHome /> Home
          </Link>
          <button onClick={handleDeleteAll} className="btn btn-outline-danger d-flex align-items-center gap-2">
            <FaTrash /> Delete All
          </button>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center my-5">
          <h4 className="text-muted">🚫 No quizzes available</h4>
          <p className="text-secondary">Add new quizzes from the Create Quiz page.</p>
        </div>
      ) : (
        <div className="table-responsive shadow rounded border">
          <table className="table table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th>Question</th>
                <th style={{ width: "160px" }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={quiz._id}>
                  <td className="fw-semibold">{index + 1}</td>
                  <td>{quiz.question}</td>
                  <td className="text-center">
                    <div className="d-inline-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
                        onClick={() => openEditModal(quiz._id, quiz.question)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                        onClick={() => handleDeleteOne(quiz._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog p-4 bg-white shadow rounded">
            <div className="modal-header border-bottom">
              <h5 className="modal-title text-primary">✏️ Edit Quiz Question</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setEditModal({ isOpen: false, id: "", text: "" })}
              ></button>
            </div>
            <div className="modal-body mt-3">
              <label className="form-label fw-semibold">Question:</label>
              <textarea
                className="form-control"
                rows="4"
                value={editModal.text}
                onChange={handleEditChange}
              />
            </div>
            <div className="modal-footer d-flex justify-content-end gap-2 mt-3 border-top pt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setEditModal({ isOpen: false, id: "", text: "" })}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={submitEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
