"use strict";
(() => {document.querySelectorAll("form[data-interest-mailto]").forEach(form => {
form.addEventListener("submit",event => {
event.preventDefault();if(!form.reportValidity())return;
const n=form.elements;
const values=["PdT Storytelling Cards — expression of interest, not an order",
"Name: "+n.namedItem("name").value.trim(),
"Email: "+n.namedItem("email").value.trim(),
"Professional area: "+n.namedItem("sector").selectedOptions[0].text,
"Interest: "+n.namedItem("interest").selectedOptions[0].text,
"Indicative copies: "+n.namedItem("quantity").selectedOptions[0].text,
"Optional updates consent: "+(n.namedItem("updates_consent").checked?"YES":"NO"),
"Privacy policy acknowledged: YES",
"No order, payment or reservation is made."];
const status=form.querySelector("[data-interest-status]");
if(status)status.textContent="Email app opening: review and press Send to complete your request.";
window.location.href="mailto:"+form.dataset.recipient+"?subject="+encodeURIComponent(form.dataset.subject)+"&body="+encodeURIComponent(values.join("\n"));
});});})();
