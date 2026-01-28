// src/components/TawkToChat.tsx ili ChatWidget.tsx
import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkToChat = () => {
  useEffect(() => {
    if (document.getElementById("tawkto-script")) {
      return;
    }

    // Inicijalizuj samo ako već nije
    if (!window.Tawk_API) {
      window.Tawk_API = {};
    }
    window.Tawk_LoadStart = new Date();

    (function () {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];

      s1.id = "tawkto-script";
      s1.async = true;
      s1.src = "https://embed.tawk.to/6963c2999fb0c8197f6eba1c/1jemr09vt";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");

      if (s0?.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      }
    })();

    // POSLE učitavanja script-a, postavi customizaciju
    window.Tawk_API.onLoad = function () {
      window.Tawk_API.setAttributes({
        language: "sr", // srpski jezik code
      });
      // Sada možeš bezbedno da setUješ customStyle
      if (window.Tawk_API) {
        window.Tawk_API.customStyle = {
          visibility: {
            desktop: {
              position: "br",
              xOffset: 20,
              yOffset: 80,
            },
            mobile: {
              position: "br",
              xOffset: 10,
              yOffset: 70,
            },
          },
        };
      }
    };
  }, []);

  return null;
};

export default TawkToChat;
