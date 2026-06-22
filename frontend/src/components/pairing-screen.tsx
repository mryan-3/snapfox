import { PairingHero } from "./pairing-hero";

interface Props {
  roomId: string;
  joinCode: string;
  setJoinCode: (c: string) => void;
  onJoin: () => void;
}

export function PairingScreen(props: Props) {
  return (
    <div className="w-full">
      <PairingHero {...props} />
    </div>
  );
}
