"use strict";
(()=>{
const lang=(document.documentElement.lang||"it").slice(0,2).toLowerCase();
const dict={it:["Nome","Email","Ambito","Interesse","Versione preferita","Copie indicative","Consenso aggiornamenti","Si apre la tua app email. Verifica e premi Invia."],en:["Name","Email","Area","Interest","Preferred edition","Copies","Updates consent","Your email app opens. Review and press Send."],es:["Nombre","Email","Ámbito","Interés","Versión preferida","Ejemplares","Consentimiento","Se abre tu correo. Revisa y pulsa Enviar."]};
const l=dict[lang]||dict.it;
// On mobile, the sticky CTA should never cover the enquiry form.
const stickyAction=document.querySelector(".preorder-mobile-action");
const interestSection=document.getElementById("interest");
if(stickyAction&&interestSection&&("IntersectionObserver" in window)){
  const watcher=new IntersectionObserver(entries=>{
    stickyAction.classList.toggle("is-hidden",entries.some(entry=>entry.isIntersecting));
  },{rootMargin:"0px 0px -12% 0px",threshold:0});
  watcher.observe(interestSection);
}
document.querySelectorAll("[data-edition-choice]").forEach(a=>a.addEventListener("click",()=>{const s=document.querySelector('form[data-interest-mailto] select[name="edition"]');if(s)s.value=a.dataset.editionChoice;}));
document.querySelectorAll("form[data-interest-mailto]").forEach(form=>form.addEventListener("submit",e=>{
e.preventDefault();if(!form.reportValidity())return;
const f=form.elements,s=n=>{let el=f.namedItem(n);return el&&el.selectedOptions?.length?el.selectedOptions[0].text:"—"};
const body=["PdT Storytelling Cards — non-binding interest (NO ORDER)",l[0]+": "+f.namedItem("name").value.trim(),l[1]+": "+f.namedItem("email").value.trim(),l[2]+": "+s("sector"),l[3]+": "+s("interest"),l[4]+": "+s("edition"),l[5]+": "+s("quantity"),l[6]+": "+(f.namedItem("updates_consent").checked?"YES":"NO"),"Privacy policy acknowledged: YES","No payment, reservation or licence activation."].join("\n");
const status=form.querySelector("[data-interest-status]");if(status)status.textContent=l[7];
window.location.href="mailto:"+form.dataset.recipient+"?subject="+encodeURIComponent(form.dataset.subject)+"&body="+encodeURIComponent(body);
}));
})();
