export const loginView = async () => `
  <h1>Connexion</h1>
  <form onsubmit="handleLogin(event)">
    <input type="text" placeholder="Email" required />
    <input type="password" placeholder="Mot de passe" required />
    <button type="submit">Se connecter</button>
  </form>
  <script>
    window.handleLogin = (e) => {
      e.preventDefault();
      localStorage.setItem("auth", "true");
      window.location.href = "/dashboard";
    };
  </script>
`;
