const contextMenu = document.getElementById("contextMenu");
const scope = document.querySelector("body");

scope.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    const { clientX: mouseX, clientY: mouseY } = event;

    contextMenu.style.top = `${mouseY}px`;
    contextMenu.style.left = `${mouseX}px`;
    contextMenu.classList.add("visible");
})

scope.addEventListener("click", (e) => {
    contextMenu.classList.remove("visible");
})