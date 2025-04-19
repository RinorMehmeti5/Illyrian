import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Confetti, type ConfettiRef } from "../components/magicui/confetti";
import { Button } from "../components/ui/button";

const Team: React.FC = () => {
  const confettiRef = useRef<ConfettiRef>(null);

  return (
    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border">
      <h2 className="mb-4 text-2xl font-bold">Confetti Test</h2>

      <Button onClick={() => confettiRef.current?.fire({})} className="z-10">
        Click for Confetti!
      </Button>

      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 h-full w-full"
      />
    </div>
  );
};

export default Team;
