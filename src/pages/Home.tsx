import { Button } from '../components/Button';

import illustrationImg from '../assests/images/illustration.svg';
import logo from '../assests/images/logo.svg';
import googleIconImg from '../assests/images/google-icon.svg';

import '../styles/auth.scss';


export function Home() {
  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustrção simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidadas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="Letmeask" />
          <button className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form>
            <input 
              type="text"
              placeholder="Digite o código da sala"    
            />
            <Button type="submit" >
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );

}