import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";
// Components
import QuestionCard from "./components/QuestionCard";
// types
import { QuestionsState, Difficulty } from "./API";
// Styles
import { GlobalStyle, Wrapper } from "./App.styles";
import LogoImage from "./images/quiz-logo.png";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
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

  const inputNumberHandler = (e: any) => {
    setInputNumber(e.target.value);
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    console.log(inputNumber);
    setIsSubmitted(true);
  };

  const startTrivia = async () => {
    setLoading(true);
    // setIsSubmitted(true);
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
    const nextQ = number + 1;

    if (nextQ === inputNumber) {
      // setGameOver(true);
      // setIsSubmitted(false);
      setReset(true);
      console.log("i am inside");
    } else {
      setNumber(nextQ);
    }
  };

  const resetHandler = () => {
    console.log("i am inside reset");
    setGameOver(true);
    setIsSubmitted(false);
    setReset(false);
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <img alt="logoimage" src={LogoImage}></img>
        {!isSubmitted || userAnswers.length === inputNumber ? (
          <form onSubmit={submitHandler}>
            <label htmlFor="number">Number of Questions:</label>
            <input
              id="number"
              type="number"
              onChange={inputNumberHandler}
            ></input>
            <label htmlFor="level">Choose Difficulty Level:</label>
            <select name="level" id="level">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button>START</button>
          </form>
        ) : null}
        {gameOver || userAnswers.length === inputNumber ? (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        ) : null}
        {isSubmitted && !gameOver ? (
          <p className="score">Score: {score}</p>
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
        number !== inputNumber - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
        {reset && number !== inputNumber && (
          <button className="next" onClick={resetHandler}>
            reset
          </button>
        )}
      </Wrapper>
    </>
  );
};

export default App;
