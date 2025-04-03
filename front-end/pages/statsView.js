import { apiClient } from "../utils/client.js";

export const statsView = async () => {
    let formattedStats = [];

    try {
        const rawStats = await apiClient.get("stats");
        formattedStats = rawStats.map(stat => ({
            nom: stat.categorie,
            compte: parseInt(stat.total)
        }));
    } catch (err) {
        console.error("Erreur chargement stats :", err);
        return `<pre>{ "error": "Impossible de charger les statistiques" }</pre>`;
    }

    // Génère le HTML
    const html = `
    <section class="stats-toggle">
      <h2>Statistiques des produits</h2>
      <button id="toggleViewBtn">🧩 Basculer l'affichage</button>

      <div id="viewContainer">
        <pre id="jsonView">${JSON.stringify(formattedStats, null, 2)}</pre>
        <table id="listView" class="hidden">
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Quantité</th>
            </tr>
          </thead>
          <tbody>
            ${formattedStats.map(stat => `
              <tr>
                <td>${stat.nom}</td>
                <td>${stat.compte}</td>
              </tr>
            `).join("")}
          </tbody>
         </table>

      </div>
    </section>

    <style>
      .stats-toggle {
        max-width: 700px;
        margin: 2rem auto;
        padding: 1rem;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      button#toggleViewBtn {
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        background-color: #007bff;
        border: none;
        color: white;
        border-radius: 5px;
        cursor: pointer;
      }

      button#toggleViewBtn:hover {
        background-color: #0056b3;
      }

      pre, ul {
        font-family: monospace;
        font-size: 1rem;
        white-space: pre-wrap;
        word-break: break-word;
        background: #f9f9f9;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      ul li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
      }
      
      table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-family: "Inter", sans-serif;
  font-size: 0.95rem;
  background: #fefefe;
  border: 1px solid #e3e3e3;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  border-radius: 6px;
  overflow: hidden;
}

thead {
  background-color: #f2f2f2;
}

th, td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

tr:hover {
  background-color: #f9f9f9;
}

th {
  font-weight: 600;
  color: #333;
}


      .hidden {
        display: none;
      }
    </style>
  `;

    // Attache les événements après injection dans le DOM
    setTimeout(() => {
        const btn = document.getElementById("toggleViewBtn");
        const jsonView = document.getElementById("jsonView");
        const listView = document.getElementById("listView");

        if (btn && jsonView && listView) {
            btn.addEventListener("click", () => {
                jsonView.classList.toggle("hidden");
                listView.classList.toggle("hidden");
            });
        }
    }, 0);

    return html;
};
