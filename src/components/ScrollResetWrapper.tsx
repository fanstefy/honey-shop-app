import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "./Spinner";

function ScrollResetWrapper({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.scrollY < 150) return;
    // prvo resetuj stanje
    setReady(false);

    // postavi odmah scroll na vrh
    window.scrollTo(0, 0);

    // funkcija proverava da li smo stvarno na scrollY = 0
    const checkScroll = () => {
      if (window.scrollY === 0) {
        setTimeout(() => {
          setReady(true);
        }, 350);
      } else {
        requestAnimationFrame(checkScroll);
      }
    };

    // pokreće proveru
    requestAnimationFrame(checkScroll);
  }, [pathname]);

  if (!ready) {
    return <Spinner />;
  }

  return <>{children}</>;
}

export default ScrollResetWrapper;
