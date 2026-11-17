"use strict";
(()=>{
  const recipient="pdtstorytellingcards@gmail.com";
  const language=(document.documentElement.lang||"it").slice(0,2).toLowerCase();
  const messages={
    it:{
      signature:{
        subject:"PdT Signature — richiesta di acquisto / disponibilità",
        body:"Buongiorno,\n\nvorrei ricevere informazioni per acquistare PdT Signature, il kit completo con 102 carte, manuale e schede stampate nel cofanetto magnetico.\n\nPrezzo di lancio proposto sul sito: 179 € (listino previsto: 199 €), soggetto a conferma.\n\nPotete indicarmi disponibilità, prezzo finale con eventuale spedizione, tempi e modalità per procedere?\n\nNome:\nNumero di copie:\nDestinazione di consegna (Paese/città):\n\nSo che questa email non costituisce un ordine né un pagamento.\nGrazie!"
      },
      essential:{
        subject:"PdT Essential — richiesta di informazioni (in sviluppo)",
        body:"Buongiorno,\n\nsono interessato a PdT Essential: 102 carte con custodia compatta e manuale/schede in formato digitale.\n\nPrezzo di lancio ipotizzato: 99 €, non definitivo. So che Essential è ancora in sviluppo e non è ordinabile.\n\nVorrei conoscere tempi previsti e modalità per ricevere aggiornamenti.\n\nNome:\n\nGrazie!"
      },
      copy:"Email copiata.",fallback:"Copia manualmente l'indirizzo email qui accanto."
    },
    en:{
      signature:{
        subject:"PdT Signature — purchase / availability enquiry",
        body:"Hello,\n\nI'd like to enquire about purchasing PdT Signature, the complete kit with 102 cards, printed manual and activity sheets in a magnetic box.\n\nProposed launch price on the website: €179 (expected standard price: €199), subject to confirmation.\n\nPlease let me know availability, final price including any shipping, lead time and how to proceed.\n\nName:\nNumber of sets:\nShipping country/city:\n\nI understand this email is not an order or payment.\nThank you!"
      },
      essential:{
        subject:"PdT Essential — interest (in development)",
        body:"Hello,\n\nI'm interested in PdT Essential: 102 cards in compact packaging, with a digital manual and activity sheets.\n\nIndicative launch price: €99 (not final). I understand Essential is in development and cannot be ordered yet.\n\nPlease let me know when it might become available.\n\nName:\n\nThank you!"
      },
      copy:"Email address copied.",fallback:"Please copy the email address shown beside the button."
    },
    es:{
      signature:{
        subject:"PdT Signature — solicitud de compra / disponibilidad",
        body:"Hola,\n\nQuisiera información para adquirir PdT Signature, el kit completo con 102 cartas, manual y fichas impresas en un cofre magnético.\n\nPrecio de lanzamiento propuesto: 179 € (precio habitual previsto: 199 €), sujeto a confirmación.\n\n¿Podrían indicarme disponibilidad, precio final con posibles gastos de envío, plazos y forma de proceder?\n\nNombre:\nNúmero de unidades:\nPaís/ciudad de entrega:\n\nEntiendo que este correo no constituye un pedido ni un pago.\n¡Gracias!"
      },
      essential:{
        subject:"PdT Essential — consulta (en desarrollo)",
        body:"Hola,\n\nMe interesa PdT Essential: 102 cartas en un estuche compacto, con manual y fichas en formato digital.\n\nPrecio de lanzamiento orientativo: 99 €, no definitivo. Entiendo que Essential sigue en desarrollo y no se puede comprar todavía.\n\nMe gustaría recibir información sobre su futura disponibilidad.\n\nNombre:\n\n¡Gracias!"
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