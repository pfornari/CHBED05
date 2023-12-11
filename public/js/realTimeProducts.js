document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  socket.on("updateProducts", (products) => {
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = products
      .map((product) => `<li>${product.title} - $${product.price}</li>`)
      .join("");
  });

  const newProductForm = document.getElementById("newProductForm");
  newProductForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const productData = {
      title: document.getElementById("title").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      code: document.getElementById("code").value,
      stock: document.getElementById("stock").value,
      category: document.getElementById("category").value,
      thumbnails: document.getElementById("thumbnails").value.split(","),
    };

    socket.emit("addProduct", productData);
    newProductForm.reset();
  });

  const updateProductForm = document.getElementById("updateProductForm");
  updateProductForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const productData = {
      id: document.getElementById("updateId").value,
      title: document.getElementById("updateTitle").value,
      price: document.getElementById("updatePrice").value,
      description: document.getElementById("updateDescription").value,
      code: document.getElementById("updateCode").value,
      stock: document.getElementById("updateStock").value,
      category: document.getElementById("updateCategory").value,
      thumbnails: document.getElementById("updateThumbnails").value.split(","),
    };

    socket.emit("updateProduct", productData);
    updateProductForm.reset();
  });

  const deleteProductForm = document.getElementById("deleteProductForm");
  deleteProductForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const productId = document.getElementById("deleteId").value;
    socket.emit("deleteProduct", productId);
    deleteProductForm.reset();
  });
});
