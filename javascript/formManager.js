const form = document.getElementById("my-form");

async function handleSubmit(event) {
    event.preventDefault();
    const status = document.getElementById("my-form-status");
    const data = new FormData(event.target);
    status.innerHTML = "Envoi du formulaire...";
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            Accept: "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                status.innerHTML = "Envoi du formulaire réussi";
                form.reset();
            } else {
                response.json().then((data) => {
                    if (Object.hasOwn(data, "errors")) {
                        status.innerHTML = data["errors"].map((error) => error["message"]).join(", ");
                    } else {
                        status.innerHTML = "Oops! Un probleme est survenue";
                    }
                });
            }
        })
        .catch((error) => {
            status.innerHTML = "Oops! Un probleme est survenue";
        });
}
const listenForm = () => {
    form.addEventListener("submit", handleSubmit);
};

export default listenForm;
