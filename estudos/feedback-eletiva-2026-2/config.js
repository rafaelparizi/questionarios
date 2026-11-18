// Feedback Disciplina Eletiva 2026/2: uso crítico de IAG e dinâmica de debates.
// TCLE adaptado do estudo Collab2Us (mesma estrutura e pesquisador), ajustado para
// questionário on-line anônimo com estudantes.
// Escala de concordância usada em todas as afirmativas (rótulos pedidos pelo pesquisador).
var CONCORDANCIA = ["Discordo totalmente", "Discordo", "Neutro / Indeciso", "Concordo", "Concordo totalmente"];

window.ESTUDO = {
  id: "feedback-eletiva-2026-2",
  envioUrl: "https://script.google.com/macros/s/AKfycbw04jQ8MX5FfSpXgXE1Kz6WJqdHIVIzOT8C2_FihivV0UlsRBsUwIQQP-InJ383caQNiA/exec",

  marca: "Feedback · Disciplina Eletiva 2026/2",
  titulo: "Questionário de Avaliação: IA no Desenvolvimento e Dinâmicas em Grupo",
  subtitulo: "São 18 afirmativas e 3 questões abertas sobre o uso de IA generativa (IAG), os temas dos grupos, os debates e as dinâmicas da disciplina. Leva cerca de 10 minutos. As respostas são anônimas e não existem respostas certas ou erradas.",
  contato: { nome: "Prof. Dr. Rafael Baldiati Parizi", email: "rafael.parizi@iffar.edu.br" },

  // Coleta anônima: sem código de participante.
  participante: { pedir: false },

  tcle: {
    versao: "v2",
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
        "Após o consentimento, você responderá a um questionário on-line com 18 afirmativas, avaliadas em uma escala de 1 (discordo totalmente) a 5 (concordo totalmente), e três questões abertas. O tempo estimado é de cerca de 10 minutos. As questões abertas são opcionais, e você pode fechar a página a qualquer momento sem enviar suas respostas."
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
      intro: "Indique o seu nível de concordância com as afirmações abaixo, utilizando a escala: 1 = Discordo totalmente · 2 = Discordo · 3 = Neutro / Indeciso · 4 = Concordo · 5 = Concordo totalmente.",
      questoes: [
        { id: "IAG1", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "Consigo identificar erros ou limitações em códigos ou textos gerados por IAG." },
        { id: "IAG2", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "Verifico o que a IAG produz antes de usar em um trabalho." },
        { id: "IAG3", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "Consigo justificar quando usar e quando não usar IAG em um projeto de software." }
      ]
    },
    {
      rotulo: "Conteúdos",
      titulo: "Avaliação dos conteúdos (temas dos grupos)",
      intro: "Cada afirmativa corresponde ao tema apresentado por um grupo. Indique seu nível de concordância, de 1 (discordo totalmente) a 5 (concordo totalmente).",
      questoes: [
        { id: "G1", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "<strong>Grupo 1:</strong> Compreendo como as diferentes visões do LLM (como colega, desenvolvedor júnior ou “rubber duck”) exigem níveis diferentes de supervisão e responsabilidade do desenvolvedor humano." },
        { id: "G2", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "<strong>Grupo 2:</strong> Entendo o conceito de “confiança calibrada” e reconheço que confiar cegamente na IA (over-trust) é tão prejudicial para o projeto quanto rejeitá-la totalmente (under-trust)." },
        { id: "G3", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "<strong>Grupo 3:</strong> Ficou claro para mim que o uso da IA já traz ganhos comprovados nas fases de Codificação e Teste, mas sua aplicação na fase de Design do software ainda carece de maturidade e pesquisas." },
        { id: "G4", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "<strong>Grupo 4:</strong> Concordo que a IA está deslocando a identidade do desenvolvedor de um mero “codificador” para um “orquestrador”, exigindo novas habilidades de validação, ética e supervisão." },
        { id: "G5", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "<strong>Grupo 5:</strong> Percebo que o hábito de tirar dúvidas exclusivamente com a IA, deixando de interagir com os colegas de equipe, pode causar a “erosão” da confiança e prejudicar o capital social da empresa." },
        { id: "G6", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "<strong>Grupo 6:</strong> Compreendi o “paradoxo produtividade-qualidade”, em que o tempo ganho gerando código com a IA muitas vezes precisa ser gasto na revisão minuciosa e correção de erros sutis." },
        { id: "G7", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "<strong>Grupo 7:</strong> Reconheço que a Engenharia de Prompt não é apenas digitar comandos, mas sim uma “competência colaborativa” que exige pensamento crítico humano contínuo (Human-in-the-Loop)." },
        { id: "G8", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "<strong>Grupo 8:</strong> Acredito que a IA aumenta significativamente a autonomia e o aprendizado do programador Júnior, sem eliminar a necessidade da experiência e da mentoria do programador Sênior." }
      ]
    },
    {
      rotulo: "Debates",
      titulo: "Os debates da disciplina",
      intro: "Considerando os debates realizados na disciplina, indique seu grau de concordância com cada afirmativa, de 1 (discordo totalmente) a 5 (concordo totalmente).",
      questoes: [
        { id: "DEB1", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "Preparar-me para debater me levou a buscar fontes além das respostas da IAG." },
        { id: "DEB2", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "Durante os debates, mudei de opinião sobre algum uso de IAG no desenvolvimento de software." },
        { id: "DEB3", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "Debater com colegas me ajudou mais do que uma aula expositiva sobre o mesmo tema teria ajudado." }
      ]
    },
    {
      rotulo: "Dinâmicas",
      titulo: "Avaliação das dinâmicas práticas",
      intro: "Pense na dinâmica que o seu grupo preparou e aplicou com a turma e responda, de 1 (discordo totalmente) a 5 (concordo totalmente).",
      questoes: [
        { id: "DIN1", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "O processo de elaboração e preparação da nossa dinâmica foi eficiente e colaborativo." },
        { id: "DIN2", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "A dinâmica que aplicamos cumpriu o objetivo de facilitar o aprendizado prático do nosso tema." },
        { id: "DIN3", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "A nossa atividade conseguiu engajar a turma e prender a atenção dos colegas." },
        { id: "DIN4", tipo: "likert", escala: CONCORDANCIA, cores: true, texto: "A dinâmica provocou reflexões relevantes e estimulou um debate real sobre o assunto." },
        { id: "DIN_comentario", tipo: "textoLongo", linhas: 3, texto: "(Opcional) Se desejar, deixe um breve comentário justificando suas notas sobre a dinâmica do seu grupo." }
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
