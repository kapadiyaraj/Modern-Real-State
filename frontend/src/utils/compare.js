const COMPARE_KEY = "compareProducts";

export const getCompareProducts = () => {
  return (
    JSON.parse(
      localStorage.getItem(COMPARE_KEY)
    ) || []
  );
};

export const addToCompare = (product) => {
  const products = getCompareProducts();

  const alreadyExists = products.some(
    (item) =>
      String(item.id) === String(product.id)
  );

  if (alreadyExists) {
    return {
      success: false,
      message: "Product already added to compare",
    };
  }

  const updatedProducts = [
    ...products,
    product,
  ];

  localStorage.setItem(
    COMPARE_KEY,
    JSON.stringify(updatedProducts)
  );

  window.dispatchEvent(
    new Event("compareUpdated")
  );

  return {
    success: true,
    message: "Product added to compare",
  };
};

export const removeFromCompare = (productId) => {
  const products = getCompareProducts();

  const updatedProducts = products.filter(
    (item) =>
      String(item.id) !== String(productId)
  );

  localStorage.setItem(
    COMPARE_KEY,
    JSON.stringify(updatedProducts)
  );

  window.dispatchEvent(
    new Event("compareUpdated")
  );

  return updatedProducts;
};