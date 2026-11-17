"use strict";
(()=>{
  const lang=(document.documentElement.lang||"it").slice(0,2).toLowerCase();
  const translations={
    it:{
      title:"PdT Storytelling Cards — richiesta commerciale (NON È UN ORDINE)",
      fields:["Nome","Email","Settore","Tipo di richiesta","Edizione","Numero di copie","Destinazione di consegna","Messaggio","Consenso aggiornamenti"],
      signature:"Signature: prezzo di lancio PROPOSTO 179 €; listino PREVISTO 199 €. Prezzo finale e spese di spedizione da confermare.",
      essential:"Essential: prezzo di lancio IPOTIZZATO 99 €. Prodotto in sviluppo, non ancora ordinabile.",
      notice:"Si tratta di un contatto senza impegno. Nessun ordine, pagamento, prenotazione o licenza digitale viene attivato con questo messaggio.",
      status:"Si apre la tua applicazione email: controlla il testo e premi Invia. Se non si apre, usa l'indirizzo mostrato qui sotto."
    },
    en:{
      title:"PdT Storytelling Cards — commercial enquiry (NOT AN ORDER)",
      fields:["Name","Email","Professional area","Request type","Edition","Number of sets","Shipping destination","Message","Updates consent"],
      signature:"Signature: PROPOSED launch price €179; EXPECTED standard price €199. Final price and shipping to be confirmed.",
      essential:"Essential: INDICATIVE launch price €99. In development, not available to order.",
      notice:"This is a non-binding enquiry. No order, payment, reservation or digital licence is activated.",
      status:"Your email app opens: review the draft and click Send. If it doesn't open, use the email address shown below."
    },
    es:{
      title:"PdT Storytelling Cards — consulta comercial (NO ES UN PEDIDO)",
      fields:["Nombre","Correo","Ámbito profesional","Tipo de consulta","Edición","Número de unidades","Destino de envío","Mensaje","Consentimiento novedades"],
      signature:"Signature: precio de lanzamiento PROPUESTO 179 €; precio habitual PREVISTO 199 €. Se confirmarán precio final y envío.",
      essential:"Essential: precio de lanzamiento ORIENTATIVO 99 €. En desarrollo, aún no disponible.",
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
    const editionField=fields.namedItem("edition");
    const typeField=fields.namedItem("interest");
    if(editionField&&typeField){
      editionField.addEventListener("change",()=>{
        if(editionField.value==="low"&&typeField.value==="purchase")typeField.value="waitlist";
        if(editionField.value==="top"&&typeField.value==="waitlist")typeField.value="purchase";
      });
    }
    form.addEventListener("submit",event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const v=name=>(fields.namedItem(name)?.value||"").trim();
      const selected=name=>{
        const node=fields.namedItem(name);
        return node?.selectedOptions?.length?node.selectedOptions[0].text.trim():"—";
      };
      const edition=v("edition");
      const pricing=edition==="top"?t.signature:edition==="low"?t.essential:t.signature+"\n"+t.essential;
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
        t.fields[8]+": "+(fields.namedItem("updates_consent")?.checked?"YES":"NO"),
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
  });
})();