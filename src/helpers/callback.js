export const callback = (name) => (error) => {
  console.log(error)
  if (error.status.toString().startsWith("2")) {
    console.log("🛑🛑🛑", name, "event success");
  } else {
    console.warn(name + " callback error 🛑", error);
  }
};
