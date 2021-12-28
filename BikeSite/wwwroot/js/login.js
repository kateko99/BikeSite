/*
const panel = document.querySelector(".form__google");
panel.addEventListener("click", () => {
    window.location.href = "/login/google?returnUrl=@returnUrl";
})
*/

function google_func(return_url) {
    window.location.href = `/login/google?returnUrl=${return_url}`
}