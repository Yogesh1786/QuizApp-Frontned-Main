import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuizList.css";
import {
  FaPlus,
  FaEdit,
  FaList,
  FaSignOutAlt,
  FaPaperPlane,
} from "react-icons/fa";

import { baseUrl } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../store/slice/userSlice";

const QuizList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, isAdmin } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [isCorrect, setIsCorrect] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [response, setResponse] = useState([]);
  const [disabledQuizzes, setDisabledQuizzes] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(
    localStorage.getItem("submitted") === "true"
  );

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/quiz/all`)
      .then((res) => {
        setQuizzes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quizzes:", err);
      });
  }, [isSubmitted]);

  const handleSelect = (quizId, option, answer) => {
    if (!isSubmitted) {
      setSelectedOptions((prevState) => ({ ...prevState, [quizId]: option }));
      setIsCorrect((prevState) => ({
        ...prevState,
        [quizId]: option === answer,
      }));
      setDisabledQuizzes((prevState) => ({ ...prevState, [quizId]: true }));

      setResponse((prevState) => [
        ...prevState,
        { questionId: quizId, isCorrect: option === answer },
      ]);

      if (option === answer) {
        setCorrectCount((prevCount) => prevCount + 1);
      }
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedOptions).length === quizzes.length) {
      let { data } = await axios.post(`${baseUrl}/api/score/create`, {
        userId: userData._id,
        answer: response,
      });
      console.log("data", data);
      setIsSubmitted(true);
      localStorage.setItem("submitted", "true");
      setResponse([]);
    } else {
      toast("Please attempt all the questions!");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    dispatch(clearUser());
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedOptions({});
    setDisabledQuizzes({});
    setCorrectCount(0);
    localStorage.setItem("submitted", "false");
  };

  if (loading) {
    return (
      <div className="App loading-container">
        <div className="spinner-border text-dark" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedOptions).length;
  const totalQuestions = quizzes.length;
  const progressPercentage = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  return (
    <div className="container quiz-container py-3">
      <ToastContainer />
      {isSubmitted ? (
        <div>
          <div className="d-flex justify-content-between flex-wrap">
            <p className="result">
              Total Score: {Math.abs((correctCount / quizzes.length) * 100).toFixed(2)}%
            </p>
            <p className="result">
              Welcome Back <b>{userData.name} 👋</b>
            </p>
            <div className="progress w-100 my-3" style={{ height: "22px", borderRadius: "12px" }}>
              <div
                className="progress-bar progress-bar-striped bg-primary"
                role="progressbar"
                style={{ width: `${progressPercentage}%`, fontWeight: "600", fontSize: "0.9rem" }}
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {answeredCount} / {totalQuestions} Answered
              </div>
            </div>
          </div>
          <ul className="quiz-list">
            <p>You have already submitted your response!</p>
            <div className="d-flex justify-content-between align-items-center flex-wrap mt-2 p-3 bg-light rounded shadow-sm">
              <b>Check the correct answers:</b>
              <button className="btn btn-outline-success px-4 py-2 fw-semibold rounded-pill" onClick={handleReset}>
                🔄 Reset Quiz
              </button>
            </div>
            {quizzes.map((quiz) => (
              <li key={quiz._id} className="quiz-item mt-3">
                <p className="question">{quiz.question}</p>
                <p className="answer">
                  Correct Answer: <i>{quiz.answer}</i>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-baseline flex-wrap">
            <p className="result">
              Welcome Back <b>{userData.name} 👋</b>
            </p>
            <div className="d-flex gap-3 flex-wrap custom-button-group">
              {isAdmin && (
                <Link to="/create" className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow">
                  <FaPlus className="me-2" /> Add Quiz
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="btn btn-warning px-4 py-2 rounded-pill fw-semibold shadow">
                  <FaEdit className="me-2" /> Modify Quiz
                </Link>
              )}
              {isAdmin && (
                <Link to="/history" className="btn btn-info px-4 py-2 rounded-pill fw-semibold shadow text-white">
                  <FaList className="me-2" /> View Responses
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-danger px-4 py-2 rounded-pill fw-semibold shadow">
                <FaSignOutAlt className="me-2" /> Logout
              </button>
            </div>
          </div>
          <ol className="quiz-list">
            {quizzes.map((quiz) => (
              <li key={quiz._id} className="quiz-item mt-3">
                <p className="question">{quiz.question}</p>
                <ol className="option-list p-0">
                  {quiz.options.map((option, index) => {
                    const isSelected = selectedOptions[quiz._id] === option;
                    const buttonClass = isSelected
                      ? isCorrect[quiz._id]
                        ? "option-button selected correct"
                        : "option-button selected incorrect"
                      : "option-button btn-sm";
                    const isDisabled = disabledQuizzes[quiz._id] || isSubmitted;

                    const serialNumber = String.fromCharCode(65 + index).toLowerCase();

                    return (
                      <li key={index} className="option-item list-unstyled">
                        <button
                          onClick={() => handleSelect(quiz._id, option, quiz.answer)}
                          className={buttonClass}
                          disabled={isDisabled}
                        >
                          {serialNumber}. &nbsp; {option}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>
        </>
      )}
      {!isSubmitted && (
        <div className="text-end mt-4">
          <button
            className="btn btn-success px-5 py-2 rounded-pill fw-semibold shadow-sm"
            onClick={handleSubmit}
          >
            <FaPaperPlane className="me-2" /> Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizList;