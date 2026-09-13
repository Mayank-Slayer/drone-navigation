export const predictImage = async (image) => {
  const res = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image }),
  });
  return res.json();
};

// 🔥 NEW
export const detectObjects = async (image) => {
  const res = await fetch("http://127.0.0.1:8000/detect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image }),
  });

  return res.json();
};