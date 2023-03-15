import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";
// Components
import QuestionCard from "./components/QuestionCard";
// types
import { QuestionsState, Difficulty } from "./API";
// Styles
import { GlobalStyle, Wrapper } from "./App.styles";
import LogoImage from "./images/quiz-logo.png";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const style = {
  margin: "0 auto",
  marginTop: "12.8rem",
  padding: "0",
  maxWidth: "20rem",
  backgroundColor: "#eff4f7",
  boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.25)",
  borderRadius: "10px",
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [inputNumber, setInputNumber] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reset, setReset] = useState(false);
  const [open, setOpen] = useState(false);

  const inputNumberHandler = (e: any) => {
    setInputNumber(+e.target.value);
  };

  const startTrivia = async (e: any) => {
    setIsSubmitted(true);
    e.preventDefault();
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(inputNumber, Difficulty.EASY);
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: any) => {
    if (!gameOver) {
      // User's answer
      const answer = e.currentTarget.value;
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct) setScore((prev) => prev + 1);
      // Save the answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    // Move on to the next question if not the last question

    setNumber((prev) => prev + 1);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const resetHandler = () => {
    console.log("i am inside reset");
    setGameOver(true);
    setIsSubmitted(false);
    setQuestions([]);
    setLoading(false);
    setScore(0);
    setNumber(0);
    setUserAnswers([]);
    setInputNumber(0);
    setIsSubmitted(false);
    setReset(false);
    setOpen(false);
  };

  console.log(number);
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <img alt="logoimage" src={LogoImage}></img>
        {!reset && !isSubmitted ? (
          <form onSubmit={startTrivia}>
            <div className="number">
              <label htmlFor="number">Number of Questions: </label>
              <input
                id="number"
                type="number"
                onChange={inputNumberHandler}
              ></input>
            </div>
            <div className="btn">
              <Button onClick={startTrivia} variant="contained" sx={{ mt: 2 }}>
                START
              </Button>
            </div>
          </form>
        ) : null}
        {loading ? <p>Loading Questions...</p> : null}
        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={inputNumber}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {isSubmitted &&
        !gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        inputNumber !== number + 1 ? (
          <Button sx={{ mt: 2 }} variant="contained" onClick={nextQuestion}>
            Next Question
          </Button>
        ) : null}

        {!gameOver && !loading && userAnswers.length === inputNumber && (
          <>
            <Button onClick={handleOpen} variant="contained" sx={{ mt: 2 }}>
              Result
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <>
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    style={{
                      backgroundColor: "#1976d2",
                      textAlign: "center",
                      color: "white",
                      padding: "0.6rem 0",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  >
                    SCOREBOARD
                  </Typography>
                  <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2, ml: 1 }}
                  >
                    <p>Total Question: {inputNumber}</p>
                    <p>Correct Answer: {score}</p>
                    <p>
                      Congratulation!🥳 You Scored {score} marks out of{" "}
                      {inputNumber}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        onClick={resetHandler}
                        variant="contained"
                        sx={{ mb: 2 }}
                      >
                        Reset
                      </Button>
                    </div>
                  </Typography>
                </Box>
              </>
            </Modal>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default App;
