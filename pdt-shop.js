"use strict";
(()=>{
  const recipient="pdtstorytellingcards@gmail.com";
  const language=(document.documentElement.lang||"it").slice(0,2).toLowerCase();
  const messages={
    it:{
      signature:{
        subject:"PdT Signature — richiesta di acquisto / disponibilità",
        body:"Buongiorno,\n\nvorrei ricevere informazioni per acquistare PdT Signature, il kit completo con 102 carte, manuale e schede stampate nel cofanetto magnetico.\n\nPrezzo di lancio previsto PdT Signature: 179 € (listino futuro previsto 199 €, non un precedente prezzo applicato). Prezzo totale con imposte applicabili, spese di spedizione, disponibilità e tempi da confermare prima di ogni impegno.\n\nPotete indicarmi disponibilità, prezzo finale con eventuale spedizione, tempi e modalità per procedere?\n\nNome:\nNumero di copie:\nDestinazione di consegna (Paese/città):\n\nSo che questa email non costituisce un ordine né un pagamento.\nGrazie!"
      },
      copy:"Email copiata.",fallback:"Copia manualmente l'indirizzo email qui accanto."
    },
    en:{
      signature:{
        subject:"PdT Signature — purchase / availability enquiry",
        body:"Hello,\n\nI'd like to enquire about purchasing PdT Signature, the complete kit with 102 cards, printed manual and activity sheets in a magnetic box.\n\nPlanned Signature launch price: €179 (planned future list price €199, not a previously charged price). Total price including applicable taxes, shipping charges, availability and delivery times to be confirmed before any commitment.\n\nPlease let me know availability, final price including any shipping, lead time and how to proceed.\n\nName:\nNumber of sets:\nShipping country/city:\n\nI understand this email is not an order or payment.\nThank you!"
      },
      copy:"Email address copied.",fallback:"Please copy the email address shown beside the button."
    },
    es:{
      signature:{
        subject:"PdT Signature — solicitud de compra / disponibilidad",
        body:"Hola,\n\nQuisiera información para adquirir PdT Signature, el kit completo con 102 cartas, manual y fichas impresas en un cofre magnético.\n\nPrecio de lanzamiento previsto Signature: 179 € (precio de catálogo futuro previsto 199 €, no aplicado anteriormente). Precio total con impuestos aplicables, gastos de envío, disponibilidad y plazos por confirmar antes de cualquier compromiso.\n\n¿Podrían indicarme disponibilidad, precio final con posibles gastos de envío, plazos y forma de proceder?\n\nNombre:\nNúmero de unidades:\nPaís/ciudad de entrega:\n\nEntiendo que este correo no constituye un pedido ni un pago.\n¡Gracias!"
      },
      copy:"Dirección de correo copiada.",fallback:"Copia manualmente el correo que aparece junto al botón."
    }
  };
  const i18n=messages[language]||messages.it;
  document.querySelectorAll("a[data-shop-edition]").forEach(link=>{
    const version=i18n[link.dataset.shopEdition];
    if(!version)return;
    link.setAttribute("href","mailto:"+recipient+"?subject="+encodeURIComponent(version.subject)+"&body="+encodeURIComponent(version.body));
    link.setAttribute("rel","nofollow");
  });
  document.querySelectorAll("[data-shop-copy]").forEach(button=>{
    button.addEventListener("click",async()=>{
      const status=button.parentElement?.querySelector("[data-shop-copy-status]");
      try{
        if(!navigator.clipboard||!navigator.clipboard.writeText)throw Error("Clipboard unavailable");
        await navigator.clipboard.writeText(recipient);
        if(status)status.textContent=i18n.copy;
      }catch(_){
        if(status)status.textContent=i18n.fallback;
      }
    });
  });
})();