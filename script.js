let categories = JSON.parse(localStorage.getItem("categories")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
//*********************************************************************************************************************************************    ADD CATEGORIES   ***************************************************************************************************************************************************//
// This function is used to create categories.
function addCategory() {
  const categoryName = document.getElementById("categoryName").value;
  const gstRate = parseFloat(document.getElementById("gstRate").value);

  //  Validation if category input field is not empty and gstRate is not string & less than 0.
  if (!categoryName || isNaN(gstRate) || gstRate < 0) {
    alert("Invalid input. Please provide valid data.");
    return;
  }
  // If above case passes then data will be stored in localStorage array of categories.
  categories.push({ name: categoryName, rate: gstRate });
  saveDataToLocalStorage();
  alert("Categories created", categories);
  // Clear the form
  document.getElementById("categoryForm").reset();
  // After creation and storage will navigate to products page.
  window.location.href = "product.html";
}
//*********************************************************************************************************************************************    UPDATE GST RATE   ********************************************************************************************************************************************** //
// This function is used to update gstRate.
function updateGstRate() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const newGstRate = parseFloat(document.getElementById("newGstRate").value);
  //  Validation if selectedCategory dropdown field is not empty and newGstRate is not string & less than 0.
  if (!selectedCategory || isNaN(newGstRate) || newGstRate < 0) {
    alert("Invalid input. Please provide valid data.");
    return;
  }

  // Find the selected category and update its GST rate.
  const categoryToUpdate = categories.find(
    (category) => category.name === selectedCategory
  );
  if (categoryToUpdate) {
    categoryToUpdate.rate = newGstRate;
    saveDataToLocalStorage();
    alert("Updated Categories", categories);
  } else {
    alert("Category not found. Please select a valid category.");
  }

  // Clear the form
  document.getElementById("gstForm").reset();
  // After updation and storage will navigate to products page.
  window.location.href = "product.html";
}

function updateTaxRate() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const selectProductElement = document.getElementById("selectProduct");

  // Clear existing options
  selectProductElement.innerHTML =
    '<option value="" selected disabled>Select Product</option>';

  // Add products based on the selected category
  const productsInCategory = products.filter(
    (product) => product.category === selectedCategory
  );
  productsInCategory.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.name;
    option.text = product.name;
    selectProductElement.appendChild(option);
  });
}
//*********************************************************************************************************************************************    ADD PRODUCTS   ********************************************************************************************************************************************** //
// This function is to create Products.
function addProduct() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const productName = document.getElementById("productName").value;
  const productPrice = parseFloat(
    document.getElementById("productPrice").value
  );
  //  Validation if selectedCategory dropdown field is not empty and productName is not empty & productPrice is not a string & not less than 0.
  if (
    !selectedCategory ||
    !productName ||
    isNaN(productPrice) ||
    productPrice < 0
  ) {
    alert("Invalid input. Please provide valid data.");
    return;
  }
  // If above case passes add the product to the list.
  products.push({
    category: selectedCategory,
    name: productName,
    price: productPrice,
  });
  saveDataToLocalStorage();
  alert("Products created", products);

  // Clear the form
  document.getElementById("productForm").reset();
  generateProductTable();
}

//*********************************************************************************************************************************************  GENERATES PRODUCT TABLE & DELETE   ************************************************************************************************************************* //
function deleteProduct(index) {
  // Remove the category at the specified index
  products.splice(index, 1);
  saveDataToLocalStorage(); // Save the updated category data to localStorage
  console.log("Categories:", categories);

  // Refresh the category table after deleting a category
  generateProductTable();
}
function generateProductTable() {
  const productTable = document.getElementById("productTable");
  productTable.innerHTML = ""; // Clear existing content

  // Display header row
  const headerRow = productTable.insertRow(0);
  headerRow.insertCell(0).textContent = "Category Name";
  headerRow.insertCell(1).textContent = "Product Name";
  headerRow.insertCell(2).textContent = "Product Price";
  headerRow.insertCell(3).textContent = "Action";

  // Iterate over products
  products.forEach((product, index) => {
    const row = productTable.insertRow(index + 1);
    row.insertCell(0).textContent = product.category; // Display the category name associated with the product
    row.insertCell(1).textContent = product.name;
    row.insertCell(2).textContent = product.price.toFixed(2);

    // Add a delete button to each row
    const deleteButton = document.createElement("span");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
      deleteProduct(index);
    };
    row.insertCell(3).appendChild(deleteButton);
  });
}
//*********************************************************************************************************************************************    ADD TO SALES   ************************************************************************************************************************* //
function addToSale() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const selectedProduct = document.getElementById("selectProduct").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (
    !selectedCategory ||
    !selectedProduct ||
    isNaN(quantity) ||
    quantity < 1
  ) {
    alert("Please Choose Category & Product & Quantity properly.");
    return;
  }

  // Find the selected product
  const selectedProductDetails = products.find(
    (product) =>
      product.category === selectedCategory && product.name === selectedProduct
  );

  if (!selectedProductDetails) {
    alert("Product not found. Please select a valid product.");
    return;
  }

  // Calculate total amount and tax
  const totalAmount = quantity * selectedProductDetails.price;
  const tax =
    totalAmount *
    (categories.find((category) => category.name === selectedCategory).rate /
      100);

  // Add the sale to the list
  sales.push({
    category: selectedCategory,
    product: selectedProduct,
    quantity: quantity,
    totalAmount: totalAmount,
    tax: tax,
  });

  saveDataToLocalStorage();
  alert("Sales created", sales);

  // Clear the form
  document.getElementById("saleForm").reset();
  generateBill();
}
//*********************************************************************************************************************************************    UPDATE TOTAL AMOUNT   ************************************************************************************************************************* //
function updateTotalAmount() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const selectedProduct = document.getElementById("selectProduct").value;
  const quantity = parseFloat(document.getElementById("quantity").value);

  // Find the selected product
  const selectedProductDetails = products.find(
    (product) =>
      product.category === selectedCategory && product.name === selectedProduct
  );

  if (selectedProductDetails) {
    // Populate GST rate and calculate total amount
    const gstRate = categories.find(
      (category) => category.name === selectedCategory
    ).rate;
    const totalAmount = quantity * selectedProductDetails.price;

    // Update the GST rate and total amount fields
    document.getElementById("gstRate").value = gstRate + "%";
    document.getElementById("totalAmount").value = totalAmount.toFixed(2);
  }
}
//*********************************************************************************************************************************************    GENERATES BILL   ************************************************************************************************************************* //
function generateBill() {
  const textBill = document.querySelector(".billHeading");
  textBill.innerHTML = "Final Bill";
  const billTable = document.getElementById("billTable");
  billTable.innerHTML = ""; // Clear existing content

  // Display header row
  const headerRow = billTable.insertRow(0);
  headerRow.insertCell(0).textContent = "Category";
  headerRow.insertCell(1).textContent = "Product";
  headerRow.insertCell(2).textContent = "Quantity";
  headerRow.insertCell(3).textContent = "Total Amount";
  headerRow.insertCell(4).textContent = "Tax";
  headerRow.insertCell(5).textContent = "Grand Total";
  headerRow.insertCell(6).textContent = "Actions";
  let grandTotal = 0;
  // Iterate over sales data
  sales.forEach((sale, index) => {
    const productDetails = products.find(
      (product) =>
        product.category === sale.category && product.name === sale.product
    );
    const categoryDetails = categories.find(
      (category) => category.name === sale.category
    );

    const row = billTable.insertRow(index + 1);
    row.insertCell(0).textContent = sale.category;
    row.insertCell(1).textContent = sale.product;
    row.insertCell(2).textContent = sale.quantity;
    row.insertCell(3).textContent = sale.totalAmount.toFixed(2);
    row.insertCell(4).textContent = sale.tax.toFixed(2);

    const grandTotalForRow = sale.totalAmount + sale.tax;
    grandTotal += grandTotalForRow;
    row.insertCell(5).textContent = grandTotalForRow.toFixed(2);

    // Add a delete button to each row
    const deleteButton = document.createElement("span");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
      deleteRow(index);
    };
    row.insertCell(6).appendChild(deleteButton);
  });

  // Display total row
  const totalRow = billTable.insertRow(sales.length + 1);
  totalRow.insertCell(4).textContent = "Total:";
  totalRow.insertCell(5).textContent = grandTotal.toFixed(2);
}

function deleteRow(index) {
  // Remove the sale at the specified index
  sales.splice(index, 1);
  saveDataToLocalStorage(); // Save the updated sales data to localStorage
  generateBill(); // Regenerate the bill table
}

// Function to dynamically populate category options in the select dropdown
function populateCategoryOptions() {
  const selectElement = document.getElementById("selectCategory");

  // Clear existing options
  selectElement.innerHTML =
    '<option value="" selected disabled>Select Category</option>';

  // Add options based on existing categories
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.text = category.name;
    selectElement.appendChild(option);
  });
}
//*********************************************************************************************************************************************    STORAGE INTO LOCAL-STORAGE   ************************************************************************************************************************* //
// Function to save data to localStorage
function saveDataToLocalStorage() {
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("sales", JSON.stringify(sales));
}
//*********************************************************************************************************************************************    POPULATING REQUIRED FIELDS   ************************************************************************************************************************* //
// Call the function to populate category options when the page loads
window.onload = function () {
  populateCategoryOptions();
  generateProductTable();
  generateBill();
  updateTotalAmount();
};
