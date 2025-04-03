export const renderCategorySelect = (selected = "") => {
    const categories = [
        { value: "", label: "Sélectionnez une catégorie" },
        { value: "electronique", label: "Électronique" },
        { value: "vetements", label: "Vêtements" },
        { value: "maison", label: "Maison" },
        { value: "sport", label: "Sport" },
    ];

    return `
    <select id="categorie" name="categorie">
      ${categories.map(cat => `
        <option value="${cat.value}" ${cat.value === selected ? "selected" : ""}>
          ${cat.label}
        </option>
      `).join("")}
    </select>
  `;
};
