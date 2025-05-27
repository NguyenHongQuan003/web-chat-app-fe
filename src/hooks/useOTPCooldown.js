import { useState, useEffect } from "react";

const useOTPCooldown = (initialTime = 60) => {
  const [cooldown, setCooldown] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isCooldownActive && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else if (cooldown === 0) {
      setIsCooldownActive(false);
    }
    return () => clearInterval(timer);
  }, [cooldown, isCooldownActive]);

  const startCooldown = () => {
    setCooldown(initialTime);
    setIsCooldownActive(true);
  };

  return {
    cooldown,
    isCooldownActive,
    startCooldown,
  };
};

export default useOTPCooldown;
