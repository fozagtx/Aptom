import { WalletSelector } from "./WalletSelector";

export function Header() {
  return (
    <div className="mx-4 md:mx-0">
      <div className="bg-slate-50 border border-e-2 border-slate-200 rounded-2xl max-w-3xl mx-auto mt-4 pl-4 pr-[14px] flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <img src="/orb.jpg" alt="aptom" className="w-8 h-8 rounded-sm" />
            <span className="text-xl font-medium hidden md:block text-black">
              Aptom
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <div className="flex gap-2 items-center flex-wrap">
            <WalletSelector />
          </div>
        </nav>
      </div>
    </div>
  );
}
