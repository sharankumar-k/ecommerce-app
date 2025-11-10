// src/api/localImages.js
const getLocalImage = (name = "", category = "") => {
  const text = `${name} ${category}`.toLowerCase();
  const base = "/assets/products";

  if (text.includes("phone") || text.includes("mobile")) return `${base}/phone.jpg`;
  if (text.includes("laptop") || text.includes("computer")) return `${base}/laptop.jpg`;
  if (text.includes("shoe")) return `${base}/shoes.jpg`;
  if (text.includes("shirt") || text.includes("cloth")) return `${base}/shirt.jpg`;
  if (text.includes("watch")) return `${base}/watch.jpg`;
  if (text.includes("tv")) return `${base}/tv.jpg`;
  if (text.includes("perfume")) return `${base}/perfume.jpg`;
  if (text.includes("book")) return `${base}/book.jpg`;

  return `${base}/placeholder.png`;
};

export default getLocalImage;
