import { MoveDiagonal, Circle } from "lucide-react";

type PopUpProps = {
  maximize: (state: boolean) => void;
};

export default function ChatPopUp({ maximize }: PopUpProps) {
  return (
    <div className="justify-items-end mr-8">
      <div className="bg-white flex items-center justify-between h-10 w-70 rounded-xl">
        <span className="m-2 inline-flex items-center">
          <Circle size={20} fill="#8e9089c8" />
          <p className="m-1 text-black font-semibold">ChatBot</p>
        </span>
        <button
          className="m-2 p-1 text-white bg-poly-green rounded-xl hover:cursor-pointer"
          type="button"
          onClick={() => maximize(true)}
        >
          <MoveDiagonal size={19} />
        </button>
      </div>
    </div>
  );
}
