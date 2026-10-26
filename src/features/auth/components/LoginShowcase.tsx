import { BoxesIcon } from 'lucide-react'

const panelGradient = {
  backgroundImage:
    'radial-gradient(110% 80% at 0% 0%, #525252 0%, transparent 55%), radial-gradient(90% 70% at 100% 100%, #3f3f3f 0%, transparent 60%), linear-gradient(160deg, #262626 0%, #0a0a0a 100%)',
}

export default function LoginShowcase() {
  return (
    <aside
      className="relative hidden min-h-[580px] flex-col justify-between overflow-hidden rounded-[24px] p-8 text-white md:flex"
      style={panelGradient}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute -top-28 -left-32 w-[34rem] blur-2xl" viewBox="0 0 500 500">
          <defs>
            <linearGradient id="login-blob-light" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fafafa" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#a3a3a3" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#171717" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#login-blob-light)"
            d="M421.5 321.5Q385 393 312.5 422Q240 451 166 422.5Q92 394 64.5 317Q37 240 70 168Q103 96 176.5 62Q250 28 322 63Q394 98 426 169Q458 240 421.5 321.5Z"
          />
        </svg>

        <svg className="absolute -right-36 -bottom-32 w-[30rem]" viewBox="0 0 500 500">
          <defs>
            <linearGradient id="login-blob-dark" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#737373" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#login-blob-dark)"
            d="M438 296q-21 86-104 124t-170-5Q77 372 58 284t36-158q55-70 145-83t161 53q71 66 38 200Z"
          />
        </svg>

        <div className="absolute top-1/3 right-10 size-44 rounded-full bg-white/15 blur-3xl" />

        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 400 580"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M-20 360C80 280 150 450 250 350S420 280 440 330" stroke="white" strokeOpacity="0.12" />
          <path d="M-20 400C90 320 160 490 260 390S420 320 440 370" stroke="white" strokeOpacity="0.08" />
          <path d="M-20 440C100 360 170 530 270 430S420 360 440 410" stroke="white" strokeOpacity="0.05" />
        </svg>

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
      </div>

      <span className="relative flex size-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
        <BoxesIcon className="size-5" />
      </span>

      <div className="relative max-w-sm">
        <p className="text-sm text-white/60">Tu turno, en orden</p>
        <h2 className="mt-3 font-heading text-3xl leading-tight font-semibold tracking-tight">
          Cobra, controla tu inventario y cierra caja desde un solo lugar
        </h2>
      </div>
    </aside>
  )
}
