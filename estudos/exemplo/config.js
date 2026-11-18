// Configuração de UMA pesquisa. Para criar outra, copie a pasta estudos/exemplo,
// troque o id e edite os textos e as perguntas. Formato completo: README.md na raiz.
window.ESTUDO = {
  // Identificador da pesquisa: vira o nome da aba na planilha. Não mude depois de começar a coleta.
  id: "exemplo-turma-2026",

  // URL /exec do Google Apps Script (apps-script/README.md). Vazia = modo de teste, nada é enviado.
  envioUrl: "https://script.google.com/macros/s/AKfycbw04jQ8MX5FfSpXgXE1Kz6WJqdHIVIzOT8C2_FihivV0UlsRBsUwIQQP-InJ383caQNiA/exec",

  marca: "Pesquisa · IFFar",
  titulo: "Percepção dos estudantes sobre a disciplina",
  subtitulo: "Leva cerca de 10 minutos. Não existem respostas certas ou erradas; responda conforme sua experiência.",
  contato: { nome: "Prof. Dr. Rafael Baldiati Parizi", email: "rafael.parizi@iffar.edu.br" },

  // Código do participante (ex.: P01). pedir:false = coleta sem código.
  // Dica: o link ...index.html?codigo=P01 já preenche o campo.
  participante: { pedir: true, rotulo: "Código do participante", ajuda: "Informado pelo professor (ex.: A01)", obrigatorio: false },

  // TCLE. Remova o bloco inteiro (ou use tcle: null) para um questionário sem termo.
  tcle: {
    versao: "v1", // mude se alterar o texto do termo: quem aceitou a versão antiga aceita de novo
    titulo: "Termo de Consentimento Livre e Esclarecido",
    resumo: "Leia o termo com calma. A participação é voluntária e você pode desistir a qualquer momento.",
    info: [
      "<strong>Pesquisador responsável:</strong> Prof. Dr. Rafael Baldiati Parizi",
      "Instituto Federal Farroupilha · <a href=\"mailto:rafael.parizi@iffar.edu.br\">rafael.parizi@iffar.edu.br</a>",
      "<strong>CAAE:</strong> 00000000.0.0000.0000"
    ],
    secoes: [
      { titulo: "1. Convite", paragrafos: [
        "Você está sendo convidado(a) a participar de uma pesquisa sobre ... (texto de exemplo)."
      ]},
      { titulo: "2. Procedimentos", paragrafos: [
        "Você responderá a um questionário on-line com perguntas fechadas e abertas, com duração aproximada de 10 minutos."
      ]},
      { titulo: "3. Riscos, benefícios e privacidade", paragrafos: [
        "Os riscos são mínimos, como cansaço ou desconforto ao responder. As respostas são tratadas de forma confidencial e divulgadas apenas de forma agrupada.",
        "Sua participação ou recusa não afeta suas notas nem sua relação com a instituição."
      ]}
    ],
    aceite: "Li e compreendi este termo e <strong>concordo voluntariamente em participar</strong> da pesquisa.",
    // Autorizações extras (opcional). Cada uma vira uma coluna tcle_<id> na planilha.
    autorizacoes: [
      { id: "citacao", titulo: "Uso de trechos das respostas abertas",
        ajuda: "Esta decisão é independente da concordância em participar.",
        opcoes: [
          { valor: "autorizo", texto: "<strong>AUTORIZO</strong> o uso de trechos sem identificação em publicações." },
          { valor: "nao-autorizo", texto: "<strong>NÃO AUTORIZO</strong> o uso de trechos." }
        ] }
    ]
  },

  partes: [
    {
      rotulo: "Perfil",
      titulo: "Sobre você",
      questoes: [
        { id: "idade", tipo: "numero", texto: "Qual a sua idade?", min: 14, max: 99, obrigatoria: true },
        { id: "curso", tipo: "lista", texto: "Qual o seu curso?", opcoes: ["Sistemas de Informação", "Técnico em Informática", "Outro"] },
        { id: "trabalha", tipo: "unica", texto: "Você trabalha na área de TI?", opcoes: ["Sim", "Não"] },
        { id: "trabalha_onde", tipo: "texto", texto: "Em que tipo de empresa?", mostrarSe: { id: "trabalha", igual: "Sim" } },
        { id: "ferramentas", tipo: "multipla", texto: "Quais ferramentas você já usou?", opcoes: ["Trello", "Jira", "Miro", "GitHub"], outro: "Outra:", obrigatoria: false }
      ]
    },
    {
      rotulo: "Avaliação",
      titulo: "Sua experiência na disciplina",
      intro: "Indique seu grau de concordância com cada afirmativa, de 1 (discordo totalmente) a 5 (concordo totalmente).",
      questoes: [
        { tipo: "secao", texto: "Conteúdo" },
        { id: "A1", tipo: "likert", escala: "concordancia5", texto: "Os conteúdos foram relevantes para minha formação." },
        { id: "A2", tipo: "likert", escala: "concordancia5", texto: "As atividades práticas ajudaram a entender a teoria." },
        { tipo: "secao", texto: "Frequência", nota: "Considere o semestre inteiro." },
        { id: "F1", tipo: "likert", escala: "frequencia5", texto: "Com que frequência você estudou fora da aula?" },
        { id: "nps", tipo: "likert", escala: { de: 0, ate: 10, min: "Nada provável", max: "Muito provável" },
          texto: "De 0 a 10, quanto você recomendaria esta disciplina a um colega?" }
      ]
    },
    {
      rotulo: "Questões abertas",
      titulo: "Com suas palavras",
      questoes: [
        { id: "Q1", tipo: "textoLongo", texto: "O que mais ajudou na sua aprendizagem?" },
        { id: "Q2", tipo: "textoLongo", texto: "O que você mudaria?" }
      ]
    }
  ],

  conclusao: {
    titulo: "Obrigado pela participação!",
    mensagem: "Suas respostas foram registradas."
  }
};
