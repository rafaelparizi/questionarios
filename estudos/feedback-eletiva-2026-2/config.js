// Feedback Disciplina Eletiva 2026/2: uso crítico de IAG e dinâmica de debates.
// TCLE adaptado do estudo Collab2Us (mesma estrutura e pesquisador), ajustado para
// questionário on-line anônimo com estudantes.
window.ESTUDO = {
  id: "feedback-eletiva-2026-2",
  envioUrl: "https://script.google.com/macros/s/AKfycbw04jQ8MX5FfSpXgXE1Kz6WJqdHIVIzOT8C2_FihivV0UlsRBsUwIQQP-InJ383caQNiA/exec",

  marca: "Feedback · Disciplina Eletiva 2026/2",
  titulo: "Feedback Disciplina Eletiva 2026/2",
  subtitulo: "São 6 afirmativas e 2 questões abertas sobre o uso de IA generativa (IAG) e os debates da disciplina. Leva cerca de 5 minutos. As respostas são anônimas e não existem respostas certas ou erradas.",
  contato: { nome: "Prof. Dr. Rafael Baldiati Parizi", email: "rafael.parizi@iffar.edu.br" },

  // Coleta anônima: sem código de participante.
  participante: { pedir: false },

  tcle: {
    versao: "v1",
    titulo: "Termo de Consentimento Livre e Esclarecido",
    resumo: "Feedback dos estudantes da disciplina eletiva sobre o uso de IA generativa e a dinâmica de debates. Leia o termo com calma antes de decidir.",
    info: [
      "<strong>Pesquisador responsável:</strong> Prof. Dr. Rafael Baldiati Parizi",
      "Instituto Federal Farroupilha, campus São Borja · <a href=\"mailto:rafael.parizi@iffar.edu.br\">rafael.parizi@iffar.edu.br</a>"
    ],
    secoes: [
      { titulo: "1. Apresentação e convite", paragrafos: [
        "Você está sendo convidado(a) a participar voluntariamente de uma pesquisa sobre a disciplina eletiva cursada em 2026/2. Leia este termo e faça as perguntas que desejar antes de decidir. A pesquisa avalia a disciplina e suas atividades; não avalia você. A participação não vale nota, e a recusa ou a desistência não causará nenhum prejuízo às suas notas, à sua frequência ou à sua relação com o professor e a instituição."
      ]},
      { titulo: "2. Objetivo da pesquisa", paragrafos: [
        "O objetivo é compreender como os estudantes percebem o próprio uso crítico da inteligência artificial generativa (IAG) no desenvolvimento de software e como avaliam os debates realizados na disciplina, para aprimorar a dinâmica das próximas edições."
      ]},
      { titulo: "3. Procedimentos e duração", paragrafos: [
        "Após o consentimento, você responderá a um questionário on-line com seis afirmativas, avaliadas em uma escala de 1 (discordo totalmente) a 5 (concordo totalmente), e duas questões abertas. O tempo estimado é de cerca de 5 minutos. As questões abertas são opcionais, e você pode fechar a página a qualquer momento sem enviar suas respostas."
      ]},
      { titulo: "4. Riscos e cuidados", paragrafos: [
        "Os riscos são mínimos, como cansaço ou desconforto ao refletir sobre sua experiência na disciplina. Para reduzi-los, o questionário é curto, anônimo e não pede nenhuma informação pessoal. Caso sinta desconforto relacionado à participação, procure o pesquisador responsável."
      ]},
      { titulo: "5. Benefícios e despesas", paragrafos: [
        "Não há benefício direto. Sua participação poderá contribuir para melhorar a disciplina e o ensino sobre o uso de IAG no desenvolvimento de software. Não haverá pagamento nem custo para participar."
      ]},
      { titulo: "6. Privacidade e uso dos resultados", paragrafos: [
        "A coleta é anônima: o questionário não pede nome, matrícula, e-mail ou código, e o sistema não registra dados que identifiquem você. Ainda assim, evite mencionar nomes ou detalhes que permitam identificar você ou colegas nas respostas abertas.",
        "Os dados serão usados para fins científicos e educacionais, incluindo artigos e apresentações. Poderão ser divulgados resultados agrupados e trechos das respostas abertas, revisados para remover qualquer informação que permita identificação."
      ]},
      { titulo: "7. Armazenamento e retirada", paragrafos: [
        "As respostas ficam em armazenamento com acesso restrito ao pesquisador responsável por cinco anos após o encerramento da pesquisa e depois são eliminadas. Como as respostas são anônimas, depois do envio não é possível identificar qual é a sua; por isso, não será possível retirá-la individualmente. Se mudar de ideia antes de enviar, basta fechar a página."
      ]},
      { titulo: "8. Esclarecimentos e cópia do termo", paragrafos: [
        "Você poderá pedir esclarecimentos antes, durante ou após a participação pelo contato do pesquisador indicado no início desta página. Para dúvidas sobre aspectos éticos, procure o Comitê de Ética em Pesquisa do Instituto Federal Farroupilha, e-mail <a href=\"mailto:cep@iffar.edu.br\">cep@iffar.edu.br</a>. Você pode salvar uma cópia deste termo pelo link ao final da página."
      ]},
      { titulo: "9. Declaração de consentimento", paragrafos: [
        "Declaro que li este termo, compreendi os objetivos, procedimentos, riscos e benefícios da pesquisa e sei que posso recusar ou interromper minha participação sem prejuízo. Ao marcar a opção abaixo, concordo voluntariamente em participar e autorizo o uso das minhas respostas anônimas nas condições descritas."
      ]}
    ],
    aceite: "Li e compreendi este termo e <strong>concordo voluntariamente em participar</strong> da pesquisa.",
    autorizacoes: [],
    recusa: "Sua decisão de não participar não traz nenhum prejuízo e não afeta suas notas. Se mudar de ideia ou tiver dúvidas, fale com o professor."
  },

  partes: [
    {
      rotulo: "Uso crítico de IAG",
      titulo: "Seu uso de IA generativa",
      intro: "Indique seu grau de concordância com cada afirmativa, de 1 (discordo totalmente) a 5 (concordo totalmente).",
      questoes: [
        { id: "IAG1", tipo: "likert", escala: "concordancia5", texto: "Consigo identificar erros ou limitações em códigos ou textos gerados por IAG." },
        { id: "IAG2", tipo: "likert", escala: "concordancia5", texto: "Verifico o que a IAG produz antes de usar em um trabalho." },
        { id: "IAG3", tipo: "likert", escala: "concordancia5", texto: "Consigo justificar quando usar e quando não usar IAG em um projeto de software." }
      ]
    },
    {
      rotulo: "Debates",
      titulo: "Os debates da disciplina",
      intro: "Considerando os debates realizados na disciplina, indique seu grau de concordância com cada afirmativa, de 1 (discordo totalmente) a 5 (concordo totalmente).",
      questoes: [
        { id: "DEB1", tipo: "likert", escala: "concordancia5", texto: "Preparar-me para debater me levou a buscar fontes além das respostas da IAG." },
        { id: "DEB2", tipo: "likert", escala: "concordancia5", texto: "Durante os debates, mudei de opinião sobre algum uso de IAG no desenvolvimento de software." },
        { id: "DEB3", tipo: "likert", escala: "concordancia5", texto: "Debater com colegas me ajudou mais do que uma aula expositiva sobre o mesmo tema teria ajudado." }
      ]
    },
    {
      rotulo: "Questões abertas",
      titulo: "Com suas palavras",
      intro: "Responda com suas próprias palavras. Comentários críticos também ajudam a melhorar a disciplina. Evite citar nomes de colegas.",
      questoes: [
        { id: "AB1", tipo: "textoLongo", linhas: 5, texto: "Descreva um debate que mudou sua forma de usar IAG. O que mudou?" },
        { id: "AB2", tipo: "textoLongo", linhas: 5, texto: "O que você mudaria na dinâmica dos debates?" }
      ]
    }
  ],

  conclusao: {
    titulo: "Obrigado pela participação!",
    mensagem: "Suas respostas anônimas foram registradas."
  }
};
