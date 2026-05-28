const button = document.getElementById("btn");

button.addEventListener("click", async () => {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await response.json();
    document.getElementById("result").innerHTML = `<img src="${data.message}" width="300">`;
});
