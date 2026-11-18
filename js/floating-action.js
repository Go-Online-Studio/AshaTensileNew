(function () {
  function initFloatingActionButtons() {
    if (document.getElementById("floating-action-buttons")) return;

    const phoneNumber = "919574720006";
    const telNumber = "+919574720006";
    const defaultMsg = encodeURIComponent("Hello Asha Tensile Structures, I would like to inquire about your tensile structures.");

    function isMobile() {
      const ua = navigator.userAgent || navigator.vendor || window.opera || "";
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
      return mobileRegex.test(ua) || (window.innerWidth <= 768);
    }

    const whatsappBase = isMobile()
      ? "https://api.whatsapp.com/send"
      : "https://web.whatsapp.com/send";

    const whatsappUrl = `${whatsappBase}?phone=${phoneNumber}&text=${defaultMsg}`;

    const container = document.createElement("div");
    container.id = "floating-action-buttons";
    container.className = "floating-action-buttons";
    container.setAttribute("aria-label", "Contact action shortcuts");

    container.innerHTML = `
      <!-- Phone Call FAB -->
      <a href="tel:${telNumber}" class="fab-btn fab-call" aria-label="Call Asha Tensile Structures" title="Call Us">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          <path d="M14.05 2a9 9 0 0 1 8 7.94" stroke-width="2"/>
          <path d="M14.05 6A5 5 0 0 1 18 10" stroke-width="2"/>
        </svg>
      </a>

      <!-- WhatsApp FAB (Regular WhatsApp with Dynamic Link) -->
      <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="fab-btn fab-whatsapp" id="fabWhatsappLink" aria-label="Chat on WhatsApp" title="WhatsApp Us">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 176" width="34" height="34">
          <circle cx="88" cy="88" r="88" fill="#25D366" />
          <g fill="#ffffff">
            <path d="M126.8 49.2a54.57 54.57 0 0 0-87.42 63.13l-5.79 28.11a2.08 2.08 0 0 0 .33 1.63 2.11 2.11 0 0 0 2.24.87l27.55-6.53A54.56 54.56 0 0 0 126.8 49.2m-8.59 68.56a42.74 42.74 0 0 1-49.22 8l-3.84-1.9-16.89 4 .05-.21 3.5-17-1.88-3.71a42.72 42.72 0 0 1 7.86-49.59 42.73 42.73 0 0 1 60.42 0 2 2 0 0 0 .22.22 42.72 42.72 0 0 1-.22 60.19"/>
            <path d="M116.71 105.29c-2.07 3.26-5.34 7.25-9.45 8.24-7.2 1.74-18.25.06-32-12.76l-.17-.15C63 89.41 59.86 80.08 60.62 72.68c.42-4.2 3.92-8 6.87-10.48a3.93 3.93 0 0 1 6.15 1.41l4.45 10a3.91 3.91 0 0 1-.49 4l-2.25 2.92a3.87 3.87 0 0 0-.35 4.32c1.26 2.21 4.28 5.46 7.63 8.47 3.76 3.4 7.93 6.51 10.57 7.57a3.82 3.82 0 0 0 4.19-.88l2.61-2.63a4 4 0 0 1 3.9-1l10.57 3a4 4 0 0 1 2.24 5.91"/>
          </g>
        </svg>
      </a>
    `;

    document.body.appendChild(container);

    // Update dynamic WhatsApp URL on window resize
    const updateWhatsappHref = () => {
      const waLink = document.getElementById("fabWhatsappLink");
      if (waLink) {
        const base = isMobile()
          ? "https://api.whatsapp.com/send"
          : "https://web.whatsapp.com/send";
        waLink.href = `${base}?phone=${phoneNumber}&text=${defaultMsg}`;
      }
    };

    window.addEventListener("resize", updateWhatsappHref, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFloatingActionButtons);
  } else {
    initFloatingActionButtons();
  }
})();
