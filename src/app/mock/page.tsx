import Letter from "@/components/Letter";

export default function MockLetterPage() {
  return (
    <Letter
      recipient="Luana"
      title="Para você, sempre"
      greeting="Oiii, meu amor"
      letterBody={`Tem coisas que eu **só consigo** te dizer assim, com tempo, sem pressa, em letrinha que demora para ser escrita. Você sabe — a gente conversa muito, mas algumas frases pedem _um lugar próprio_, longe do feed, longe do barulho. Esse aqui é o seu.

Eu lembro do dia que a gente se conheceu — você ==reclamou do meu café== em pleno sábado de manhã, e eu achei que ia ficar bravo, mas só consegui rir. Desde aquela manhã, todo café tem gosto de você por perto.

Obrigada por __aguentar minhas manias__, por rir das minhas piadas que ninguém entende, por chorar comigo nos filmes da Pixar. Obrigada por **existir do jeito que existe** — meio doida, meio doce, totalmente sua.

Se um dia você esquecer o quanto é amada, abre essa página. Tá tudo aqui, gravado para ==sempre==. ♡`}
      signature="Com amor — E."
      images={[
        {
          url: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=80",
          caption: "Primeiro café juntos ♡",
        },
        {
          url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
          caption: "Viagem de aniversário",
        },
        {
          url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&q=80",
          caption: null,
        },
        {
          url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80",
          caption: "Noite na praia",
        },
        {
          url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80",
          caption: "Domingo à toa ✿",
        },
        {
          url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80",
          caption: "Trilha no inverno",
        },
      ]}
    />
  );
}
