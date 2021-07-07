import { useState, FormEvent } from "react";

import { Link, useHistory } from "react-router-dom";

import illustrationImg from "../assests/images/illustration.svg";
import logo from "../assests/images/logo.svg";
import darkImg from "../assests/images/moon.png";
import lightImg from "../assests/images/sun.png";

import { ButtonC } from "../components/Button";
import { database } from "../services/firebase";

import "../styles/auth.scss";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export function NewRoom() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.replace(`/admin/rooms/${firebaseRoom.key}`);
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <ButtonC type="submit">Criar sala</ButtonC>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
