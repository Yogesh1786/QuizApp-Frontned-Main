import React, { useState } from "react";
import { baseUrl } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPaperPlane } from "react-icons/fa";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });

  const handleQuestionChange = (e) => {
    setFormData({ ...formData, question: e.target.value });
  };

  const handleOptionChange = (index, e) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = e.target.value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleAnswerChange = (e) => {
    setFormData({ ...formData, answer: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/api/quiz/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("✅ Question submitted successfully!", {
          theme: "colored",
        });
        setFormData({ question: "", options: ["", "", "", ""], answer: "" });
      } else {
        toast.error("❌ Failed to submit the question.", { theme: "colored" });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("⚠️ An error occurred. Please try again.", {
        theme: "colored",
      });
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "85vh", padding: "2rem" }}
    >
      <ToastContainer />
      <div
        className="card shadow-lg p-4 rounded-4 border-0 w-100"
        style={{ maxWidth: "900px", backgroundColor: "#fff" }}
      >
        <h2 className="text-center text-primary fw-bold mb-4">
          Create a Quiz Question
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Question */}
          <div className="mb-4">
            <label htmlFor="question" className="form-label fw-semibold">
              Question
            </label>
            <input
              type="text"
              id="question"
              className="form-control rounded-3 shadow-sm"
              placeholder="Enter your quiz question"
              value={formData.question}
              onChange={handleQuestionChange}
              required
            />
          </div>

          {/* Options */}
          {formData.options.map((option, index) => (
            <div className="mb-4" key={index}>
              <label
                htmlFor={`option${index}`}
                className="form-label fw-semibold"
              >
                Option {index + 1}
              </label>
              <input
                type="text"
                id={`option${index}`}
                className="form-control rounded-3 shadow-sm"
                placeholder={`Enter option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e)}
                required
              />
            </div>
          ))}

          {/* Answer */}
          <div className="mb-4">
            <label htmlFor="answer" className="form-label fw-semibold">
              Correct Answer
            </label>
            <input
              type="text"
              id="answer"
              className="form-control rounded-3 shadow-sm"
              placeholder="Enter the correct answer"
              value={formData.answer}
              onChange={handleAnswerChange}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 d-flex align-items-center justify-content-center gap-2 shadow custom-submit-btn"
            >
              <FaPaperPlane />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;
