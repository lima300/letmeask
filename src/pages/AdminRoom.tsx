import { useHistory, useParams } from "react-router-dom";

import { useRoom } from "../hooks/useRoom";

import { database } from "../services/firebase";

import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { ButtonC } from "../components/Button";

import logoImg from "../assests/images/logo.svg";
import logoDark from "../assests/images/logoDark.svg";
import deleteImg from "../assests/images/delete.svg";
import checkImg from "../assests/images/check.svg";
import answerImg from "../assests/images/answer.svg";
import darkImg from "../assests/images/moon.png";
import lightImg from "../assests/images/sun.png";
import warning from "../assests/images/warning.svg";

import "../styles/room.scss";
import { useTheme } from "../hooks/useTheme";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";

// import { useAuth } from "../hooks/useAuth";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);
  const { theme, toggleTheme } = useTheme();
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState("");

  async function handleDeleteQuestion(questionId: string, del?: boolean) {
    if (del) {
      await database.ref(`rooms/${roomId}/questions/${question}`).remove();
    }
    toggleModal();
    setQuestion(questionId);
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlited: true,
    });
  }

  function toggleModal() {
    setShow(!show);
  }

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <img src={theme === "light" ? logoImg : logoDark} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <ButtonC isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </ButtonC>
            <button onClick={toggleTheme} className="btn-toggle">
              {theme === "light" ? (
                <img src={lightImg} alt="Alterar tema do site" />
              ) : (
                <img src={darkImg} alt="Alterar tema do site" />
              )}
            </button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s) </span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlited={question.isHighlited}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
        <Modal show={show}>
          <Modal.Header closeButton />
          <Modal.Body>
            <img className="warning pb-2" src={warning} alt="warning" />
            <h5>Tem certeza que você deseja excluir esta pegunta?</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={toggleModal}>
              Não
            </Button>
            <Button
              variant="success"
              onClick={() => handleDeleteQuestion("", true)}
            >
              Sim
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
}
