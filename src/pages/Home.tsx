import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";

import illustrationImg from "../assests/images/illustration.svg";
import logo from "../assests/images/logo.svg";
import googleIconImg from "../assests/images/google-icon.svg";
import darkImg from "../assests/images/moon.png";
import lightImg from "../assests/images/sun.png";

import { Button } from "../components/Button";

import "../styles/auth.scss";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { useTheme } from "../hooks/useTheme";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");
  const { theme, toggleTheme } = useTheme();

  async function handleCreateRoom() {
    if (!user) {
      signInWithGoogle();
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room does not exists.");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Room already closed.");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustrção simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidadas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <button onClick={toggleTheme} className="btn-toggle">
          {theme === "light" ? (
            <img src={lightImg} alt="Alterar tema do site" />
          ) : (
            <img src={darkImg} alt="Alterar tema do site" />
          )}
        </button>
        <div className="main-content">
          <img src={logo} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
