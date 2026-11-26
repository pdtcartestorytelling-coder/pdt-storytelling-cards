"use strict";
(()=>{
  const lang=(document.documentElement.lang||"it").slice(0,2).toLowerCase();
  const translations={
    it:{
      title:"PdT Storytelling Cards — richiesta commerciale (NON È UN ORDINE)",
      fields:["Nome","Email","Settore","Tipo di richiesta","Edizione","Numero di copie","Destinazione di consegna","Messaggio"],
      signature:"PdT Signature — prezzo di lancio previsto: 149 € per il Lotto 01 (50 cofanetti previsti). Listino futuro previsto 199 € (non prezzo precedente). Prezzo totale con imposte applicabili, spese di spedizione, disponibilità e tempi da confermare prima di ogni impegno.",
      notice:"Si tratta di un contatto senza impegno. Nessun ordine, pagamento, prenotazione o licenza digitale viene attivato con questo messaggio.",
      status:"Si apre la tua applicazione email: controlla il testo e premi Invia. Se non si apre, usa l'indirizzo mostrato qui sotto."
    },
    en:{
      title:"PdT Storytelling Cards — commercial enquiry (NOT AN ORDER)",
      fields:["Name","Email","Professional area","Request type","Edition","Number of sets","Shipping destination","Message"],
      signature:"PdT Signature — planned launch price: €149 for Batch 01 (50 boxed sets planned). Planned future list price €199 (not a former price). Total price including applicable taxes, shipping charges, availability and delivery times to be confirmed before any commitment.",
      notice:"This is a non-binding enquiry. No order, payment, reservation or digital licence is activated.",
      status:"Your email app opens: review the draft and click Send. If it doesn't open, use the email address shown below."
    },
    es:{
      title:"PdT Storytelling Cards — consulta comercial (NO ES UN PEDIDO)",
      fields:["Nombre","Correo","Ámbito profesional","Tipo de consulta","Edición","Número de unidades","Destino de envío","Mensaje"],
      signature:"PdT Signature — precio de lanzamiento previsto: 149 € para el Lote 01 (50 estuches previstos). Precio de catálogo futuro previsto 199 € (no precio anterior). Precio total con impuestos aplicables, gastos de envío, disponibilidad y plazos por confirmar antes de cualquier compromiso.",
      notice:"Es una consulta sin compromiso. No genera pedido, pago, reserva ni licencia digital.",
      status:"Se abre tu correo: revisa el borrador y pulsa Enviar. Si no se abre, usa la dirección que aparece abajo."
    }
  };
  const t=translations[lang]||translations.it;
  const stickyAction=document.querySelector(".preorder-mobile-action");
  const interestSection=document.getElementById("interest");
  if(stickyAction&&interestSection&&("IntersectionObserver" in window)){
    const watcher=new IntersectionObserver(entries=>{
      stickyAction.classList.toggle("is-hidden",entries.some(entry=>entry.isIntersecting));
    },{rootMargin:"0px 0px -12% 0px",threshold:0});
    watcher.observe(interestSection);
  }
  document.querySelectorAll("form[data-interest-mailto]").forEach(form=>{
    const fields=form.elements;
    form.addEventListener("submit",event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const v=name=>(fields.namedItem(name)?.value||"").trim();
      const selected=name=>{
        const node=fields.namedItem(name);
        if(name==="edition")return "PdT Signature";
        return node?.selectedOptions?.length?node.selectedOptions[0].text.trim():"—";
      };
      const pricing=t.signature;
      const lines=[
        t.title,
        "",
        t.fields[0]+": "+v("name"),
        t.fields[1]+": "+v("email"),
        t.fields[2]+": "+selected("sector"),
        t.fields[3]+": "+selected("interest"),
        t.fields[4]+": "+selected("edition"),
        t.fields[5]+": "+selected("quantity"),
        t.fields[6]+": "+v("destination"),
        t.fields[7]+": "+v("message"),
        "",
        pricing,
        t.notice,
        "Privacy policy read: YES"
      ];
      const subject=form.dataset.subject+" — "+selected("edition");
      const status=form.querySelector("[data-interest-status]");
      if(status)status.textContent=t.status;
      window.location.href="mailto:"+encodeURIComponent(form.dataset.recipient).replace(/%40/g,"@")+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(lines.join("\n"));
    });
    // Enable controls only after the submit handler is successfully installed.
    form.querySelectorAll("[data-pdt-enable]").forEach(control => { control.disabled = false; });
    const fallback = form.querySelector("[data-pdt-form-fallback]");
    if (fallback) fallback.hidden = true;
  });
})();