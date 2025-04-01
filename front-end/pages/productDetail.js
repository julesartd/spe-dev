export const productDetailView = async ({ id }) => {
    const product = await fetchProductById(id);
    return `
    <h1>${product.name}</h1>
    <p>${product.description}</p>
    <p><strong>${product.price} €</strong></p>
  `;
};

const fetchProductById = (id) =>
    Promise.resolve({
        id,
        name: `Produit #${id}`,
        description: "Un super produit",
        price: 42,
    });
