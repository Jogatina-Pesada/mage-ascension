const wikiSphereGuides = [
  {
    path: 'spheres.fate',
    title: 'Destino',
    originalTitle: 'Fate',
    summary: 'Probabilidade, sorte, azar, coincidências, promessas, juramentos, vínculos místicos e destino. Foco em manipular eventos sem alterar diretamente a matéria ou as pessoas.',
    examples: [
      ['Sorte garantida', 'Destino ●●', 'Todas as moedas caem a favor do alvo.'],
      ['Coincidência favorável', 'Destino ●● + Espaço ●●', 'A pessoa certa cruza seu caminho “por coincidência”.'],
      ['Maldição hereditária', 'Destino ●●● + Morte ●●', 'Uma maldição faz todos os descendentes de uma família morrerem jovens.'],
      ['Profecia verdadeira', 'Destino ●●●●● + Tempo ●●', 'Declarar um evento futuro que tende a acontecer inevitavelmente.'],
      ['Destino inevitável', 'Destino ●●●●● + Tempo ●●●●●', 'Declarar que um acontecimento é inevitável e reescrever a história para que ele sempre estivesse destinado a ocorrer.']
    ],
    levels: [
      'Perceber sorte, azar, vínculos, juramentos, maldições e probabilidades.',
      'Dar bônus ou penalidades por sorte ou azar, criar pequenos presságios e coincidências favoráveis.',
      'Criar maldições, bênçãos, juramentos mágicos e influenciar fortemente a probabilidade.',
      'Reescrever destinos de pessoas, impor geasa e criar laços místicos muito difíceis de quebrar.',
      'Alterar completamente o destino, transformar coincidências em certezas e manipular o tecido do karma.'
    ]
  },
  {
    path: 'spheres.space',
    title: 'Espaço',
    originalTitle: 'Correspondence — Correspondência',
    summary: 'Espaço, distância, localização e conexões entre lugares.',
    examples: [
      ['Teletransporte', 'Espaço ●●●●', 'Dobrar o espaço e aparecer em outro lugar.'],
      ['Visão do passado remoto', 'Espaço ●● + Tempo ●●', 'Observar uma sala como ela era dias atrás.'],
      ['Portal espaço-temporal', 'Espaço ●●●● + Tempo ●●●●', 'Abrir um portal para outro lugar e outra época.']
    ],
    levels: [
      'Perceber distâncias, localizar pessoas e objetos, enxergar locais remotos.',
      'Criar ligações entre lugares, atacar ou lançar magia à distância.',
      'Dobrar o espaço, teletransportar pequenos objetos, eliminar distância para efeitos.',
      'Teletransportar pessoas, criar portais estáveis.',
      'Remodelar completamente o espaço, existir em vários pontos ou criar dimensões espaciais complexas.'
    ]
  },
  {
    path: 'spheres.spirit',
    title: 'Espírito',
    originalTitle: 'Spirit',
    summary: 'Umbra, espíritos e mundos espirituais.',
    definition: ['Espírito', 'Uma entidade da Sombra que representa um conceito, emoção, objeto ou fenômeno. Exemplo: o espírito do sofrimento.'],
    examples: [
      ['Cruzar a Película', 'Espírito ●●●', 'Cruzar a Película para o mundo espiritual.'],
      ['Invocar um espírito', 'Espírito ●●●', 'Invocar um espírito.']
    ],
    levels: [
      'Perceber espíritos e a Penumbra.',
      'Conversar com espíritos e enfraquecer a Película.',
      'Cruzar para a Umbra e invocar espíritos.',
      'Controlar ou prender espíritos poderosos; viajar livremente pelos mundos espirituais.',
      'Criar reinos espirituais e alterar profundamente a Umbra.'
    ]
  },
  {
    path: 'spheres.forces',
    title: 'Forças',
    originalTitle: 'Forces',
    summary: 'Energia em todas as formas. Inclui fogo, eletricidade, calor, frio, luz, som, radiação e, limitadamente, gravidade.',
    examples: [
      ['Invisibilidade', 'Forças ●●●', 'Desviar a luz ao redor do mago.'],
      ['Bola de fogo', 'Forças ●●● + Primórdio ●●', 'Criar e lançar uma bola de fogo.'],
      ['Relâmpago à distância', 'Forças ●●● + Espaço ●●', 'Lançar um relâmpago contra um alvo distante.'],
      ['Criar uma pequena estrela', 'Forças ●●●●● + Primórdio ●●●●', 'Criar uma pequena estrela.']
    ],
    levels: [
      'Perceber energias.',
      'Criar ou mover pequenas quantidades de energia.',
      'Moldar grandes quantidades, como raios, explosões e campos.',
      'Converter uma energia em outra, controlar fenômenos extensos.',
      'Criar ou destruir enormes quantidades de energia; domínio quase absoluto das forças físicas.'
    ]
  },
  {
    path: 'spheres.matter',
    title: 'Matéria',
    originalTitle: 'Matter',
    summary: 'Toda matéria não viva. Inclui metal, pedra, madeira, plástico, tecido e líquidos.',
    examples: [
      ['Transmutação completa', 'Matéria ●●●●', 'Alterar completamente um material em outro.'],
      ['Ler o passado de um objeto', 'Matéria ●● + Tempo ●●', 'Observar acontecimentos ligados ao passado de um objeto.'],
      ['Petrificação', 'Matéria ●●●● + Vida ●●●', 'Transformar um organismo vivo em pedra.']
    ],
    levels: [
      'Analisar materiais.',
      'Alterar forma e propriedades superficiais.',
      'Transformar um material em outro semelhante.',
      'Transmutar completamente materiais.',
      'Criar ou destruir grandes massas de matéria complexa.'
    ]
  },
  {
    path: 'spheres.mind',
    title: 'Mente',
    originalTitle: 'Mind',
    summary: 'Pensamentos, emoções, memória e consciência.',
    examples: [
      ['Conversa mental à distância', 'Mente ●● + Espaço ●●', 'Conversar mentalmente com alguém do outro lado da cidade.'],
      ['Localização por padrão mental', 'Espaço ●● + Mente ●●', 'Encontrar alguém seguindo seu padrão mental.'],
      ['Criar um messias', 'Mente ●●●●● + Destino ●●●●', 'Criar um “messias” cujo destino e personalidade foram moldados para liderar uma era inteira.']
    ],
    levels: [
      'Ler emoções superficiais.',
      'Ler pensamentos e influenciar emoções.',
      'Controlar memórias, ilusões mentais e comandos complexos.',
      'Controlar completamente uma mente ou várias simultaneamente.',
      'Remodelar consciências, fundir ou dividir mentes, criar inteligências complexas.'
    ]
  },
  {
    path: 'spheres.death',
    title: 'Morte',
    originalTitle: 'Death',
    summary: 'Morte, decadência, fantasmas, sombras, almas, cadáveres e Submundo. É mais ampla do que necromancia: controla tudo que está relacionado ao fim da vida e ao estado entre vida e morte.',
    definition: ['Fantasma', 'O eco de uma pessoa morta.'],
    examples: [
      ['Conversar com um fantasma', 'Morte ●●', 'Conversar com um fantasma que ainda não virou um espírito na Umbra.'],
      ['Criar uma zona assombrada', 'Morte ●●●●', 'Fantasmas ficam presos ao local.'],
      ['Envelhecimento acelerado', 'Morte ●●● + Vida ●●', 'Envelhecer um corpo, que apodrece anos em segundos.'],
      ['Apodrecer uma porta', 'Morte ●●● + Matéria ●●', 'Decompor rapidamente uma porta.'],
      ['Apagar a consciência', 'Morte ●●●● + Mente ●●', 'O corpo permanece vivo, mas a consciência desaparece.'],
      ['Distinguir fantasma de espírito', 'Morte ●● + Espírito ●●', 'Descobrir se uma aparição é um fantasma ou um espírito.'],
      ['Preservar um cadáver', 'Morte ●●●● + Matéria ●●● + Vida ●●●', 'Preservar um corpo morto indefinidamente, impedindo qualquer decomposição.']
    ],
    levels: [
      'Perceber fantasmas, cadáveres, doenças espirituais, auras da morte e entradas para o Submundo.',
      'Conversar com fantasmas, fortalecê-los ou enfraquecê-los, manipular sombras e pequenas quantidades de decadência.',
      'Invocar fantasmas, acelerar decomposição, controlar sombras, afetar almas parcialmente.',
      'Aprisionar ou comandar fantasmas poderosos, viajar ao Submundo, separar alma e corpo.',
      'Criar ou destruir fantasmas, remodelar o Submundo, controlar completamente morte e decadência espiritual.'
    ]
  },
  {
    path: 'spheres.prime',
    title: 'Primórdio',
    originalTitle: 'Prime',
    summary: 'Quintessência, energia mágica pura e essência da realidade.',
    examples: [
      ['Encantar uma espada', 'Primórdio ●●● + Matéria ●●', 'Encantar uma espada com energia mágica.']
    ],
    levels: [
      'Ver Quintessência e padrões mágicos.',
      'Canalizar Quintessência e fortalecer efeitos mágicos.',
      'Criar energia primordial, encantar objetos simples.',
      'Criar Talismãs, fortalecer padrões mágicos permanentemente.',
      'Criar ou destruir grandes quantidades de Quintessência; manipular a essência da realidade.'
    ]
  },
  {
    path: 'spheres.time',
    title: 'Tempo',
    originalTitle: 'Time',
    summary: 'Fluxo temporal, passado, futuro e duração.',
    examples: [
      ['Congelar o tempo ao redor', 'Tempo ●●●', 'Congelar brevemente o tempo na área ao redor.']
    ],
    levels: [
      'Perceber passado próximo e futuro imediato.',
      'Ver passado e futuro com mais clareza, desacelerar ou acelerar pequenas percepções.',
      'Alterar velocidade do tempo local, congelar momentos breves.',
      'Viajar para outras épocas ou mover outros através do tempo.',
      'Reescrever linhas temporais e manipular o fluxo temporal em larga escala.'
    ]
  },
  {
    path: 'spheres.life',
    title: 'Vida',
    originalTitle: 'Life',
    summary: 'Toda matéria viva. Inclui humanos, animais, plantas, bactérias, órgãos e genética.',
    examples: [
      ['Cura instantânea', 'Vida ●●●', 'Curar instantaneamente ferimentos de um organismo vivo.'],
      ['Transformar um homem em lobo', 'Vida ●●●●', 'Remodelar totalmente o corpo de um ser vivo.'],
      ['Curar corpo e espírito', 'Vida ●●● + Espírito ●●', 'Curar simultaneamente o corpo e o espírito.'],
      ['Criar um novo ser vivo', 'Vida ●●●●● + Matéria ●●●● + Primórdio ●●●●', 'Criar um novo ser vivo do nada.']
    ],
    levels: [
      'Diagnosticar organismos vivos.',
      'Curar, fortalecer, causar pequenas alterações biológicas.',
      'Remodelar corpos, alterar atributos físicos, metamorfoses parciais.',
      'Transformações completas, criação de organismos simples.',
      'Criar novas formas de vida, reescrever genética e biologia livremente.'
    ]
  }
];

const wikiCombatGuide = {
  initiative: {
    title: 'Ordem dos turnos e Iniciativa',
    text: 'A ordem dos turnos é definida por uma rolagem de Iniciativa no início de cada combate. Cada participante realiza um teste de Destreza + Raciocínio, com dificuldade padrão, e o número de sucessos determina sua posição na rodada: quem obtiver mais sucessos age primeiro, seguido pelos demais em ordem decrescente. Em caso de empate, age primeiro quem possuir maior Destreza; persistindo o empate, a Narradora decide a ordem de forma apropriada à cena. A Iniciativa normalmente é rolada apenas uma vez e sua ordem permanece a mesma até o fim do combate, salvo efeitos mágicos ou habilidades que a alterem.'
  },
  steps: [
    {
      title: 'Teste de Ataque',
      subtitle: 'Verifica se o ataque acerta.',
      paragraphs: [
        'O atacante realiza uma rolagem utilizando o atributo e a habilidade apropriados ao ataque. A dificuldade é definida pelo narrador conforme as circunstâncias. Se a rolagem obtiver ao menos 1 sucesso, o ataque acerta.',
        'Em ataques com armas físicas, cada sucesso além do primeiro normalmente adiciona um dado à rolagem de dano.'
      ]
    },
    {
      title: 'Rolagem de Dano',
      subtitle: 'Determina a quantidade de dano potencial causado.',
      items: [
        ['Armas físicas', 'Utilizam o dano-base da arma, acrescido dos sucessos excedentes do teste de ataque.'],
        ['Ataques desarmados', 'Utilizam a Força do atacante.'],
        ['Magias', 'O dano depende do efeito criado, das Esferas utilizadas e dos sucessos obtidos na rolagem de Arcana, conforme interpretação do narrador.']
      ],
      paragraphs: ['Cada sucesso obtido na rolagem de dano corresponde a 1 nível de dano potencial.']
    },
    {
      title: 'Absorção do dano (Soak)',
      subtitle: 'Reduz o dano, quando permitido.',
      soak: [
        ['Contusão', 'Todos podem absorver com Vigor. Armaduras e efeitos mágicos podem adicionar dados.'],
        ['Letal', 'Humanos comuns não absorvem com Vigor. Apenas armaduras, magias ou poderes sobrenaturais permitem absorção.'],
        ['Agravado', 'Normalmente não pode ser absorvido por Vigor nem por armaduras comuns. Apenas efeitos mágicos ou poderes específicos permitem absorção.']
      ],
      paragraphs: ['Cada sucesso na rolagem de Absorção reduz 1 nível de dano.'],
      magicProtectionIntro: 'Magias podem permitir que um personagem absorva dano Letal e Agravado, mas não existe uma mecânica universal. Diferentemente de Vampiros ou Lobisomens, que possuem regras fixas para Absorção, os magos precisam criar um efeito mágico que justifique essa proteção.',
      magicProtections: [
        ['Armadura mágica', 'Matéria, Forças, Primórdio', 'Cria uma barreira ou fortalece roupas, pele ou objetos, concedendo dados extras de Absorção.'],
        ['Alteração do corpo', 'Vida', 'Torna o corpo mais resistente, com pele endurecida, ossos reforçados ou músculos densos, permitindo absorver danos que normalmente não seriam absorvíveis.'],
        ['Anulação ou redirecionamento do dano', 'Forças, Espaço, Primórdio, Tempo', 'Em vez de absorver o golpe, impede que ele cause dano: desvia projéteis, dissipa energia, desloca o ataque ou desacelera impactos. Tecnicamente, isso não é Absorção, mas costuma produzir o mesmo resultado prático.']
      ]
    },
    {
      title: 'Aplicação do dano',
      subtitle: 'Os níveis de dano restantes são marcados na trilha de Saúde.',
      paragraphs: []
    }
  ],
  examples: [
    [
      'Soco (Contusão)',
      'Força 3 + Briga 2 = 5 dados\nRolagem: 9, 8, 7, 4, 2 → 3 sucessos',
      'Ataque acerta.\nSucessos excedentes: 3 − 1 = 2',
      'Base: Força 3\n+ 2 sucessos excedentes = 5 dados\nRolagem: 10, 8, 7, 3, 2 → 3 sucessos',
      '3 níveis de dano Contusivo',
      'Vigor 3 = 3 dados\nRolagem: 9, 7, 1 → 2 sucessos − 1 cancelamento = 1 sucesso',
      '3 − 1 = 2 níveis de Contusão'
    ],
    [
      'Pistola (Letal)',
      'Destreza 3 + Armas de Fogo 2 = 5 dados\nRolagem: 10, 8, 7, 5, 3 → 3 sucessos',
      'Ataque acerta.\nSucessos excedentes: 3 − 1 = 2',
      'Base da pistola: 4\n+ 2 sucessos excedentes = 6 dados\nRolagem: 10, 9, 8, 7, 4, 2 → 4 sucessos',
      '4 níveis de dano Letal',
      'Humano não absorve dano Letal com Vigor.\nColete Kevlar +3 dados\nRolagem: 10, 8, 4 → 2 sucessos',
      '4 − 2 = 2 níveis de dano Letal'
    ],
    [
      'Garras Sobrenaturais (Agravado)',
      'Força 4 + Briga 3 = 7 dados\nRolagem: 10, 9, 8, 7, 6, 4, 2 → 5 sucessos',
      'Ataque acerta.\nSucessos excedentes: 5 − 1 = 4',
      'Base: Força 4\n+ 4 sucessos excedentes = 8 dados\nRolagem: 10, 9, 9, 8, 7, 5, 4, 2 → 5 sucessos',
      '5 níveis de dano Agravado',
      'O alvo não possui magia ou poder que absorva dano Agravado.\nNenhuma Absorção',
      '5 níveis de dano Agravado'
    ],
    [
      'Magia — Raio (Forças ●●●)',
      'Arcana 3 = 3 dados\nRolagem: 10, 8, 6 → 3 sucessos',
      'A magia é conjurada com sucesso. Neste exemplo, o narrador define que os sucessos determinam diretamente o dano.',
      'Não há rolagem de dano separada.\n3 sucessos de Arcana → 3 níveis de dano Letal',
      '3 níveis de dano Letal',
      'Humano não absorve dano Letal com Vigor.\nColete Kevlar +3 dados\nRolagem: 9, 8, 2 → 2 sucessos',
      '3 − 2 = 1 nível de dano Letal'
    ]
  ]
};

const wikiSpellcastingGuide = {
  steps: [
    {
      title: 'Descreva o efeito',
      text: 'A bruxa descreve o efeito que deseja produzir.'
    },
    {
      title: 'Determine as Esferas',
      text: 'A Narradora determina quais Esferas e o nível mínimo de cada uma são necessários.'
    },
    {
      title: 'Realize o teste de Arcana',
      text: 'Role uma quantidade de d10 igual à Arcana da bruxa.',
      difficulties: [
        ['3–6', 'Magia altamente coincidental'],
        ['6–7', 'Magia coincidental comum'],
        ['8–9', 'Magia vulgar'],
        ['+1', 'Caso existam Adormecidos (Sleepers) testemunhando uma magia vulgar']
      ]
    },
    {
      title: 'Conte os sucessos',
      items: [
        'Cada dado que atingir ou superar a dificuldade gera 1 sucesso.',
        'Resultados 1 cancelam sucessos e podem causar uma falha crítica (Botch).'
      ]
    },
    {
      title: 'Aplique o efeito',
      text: 'Quanto mais sucessos, maior a potência, duração, alcance, precisão ou quantidade de alvos.'
    },
    {
      title: 'Determine o Paradoxo',
      text: 'Magias vulgares, principalmente diante de Adormecidos, acumulam Paradoxo conforme sua natureza e intensidade.'
    }
  ],
  results: [
    ['Falha', 'A magia não produz efeito. Pode haver falha crítica ou geração adicional de Paradoxo, a critério da Narradora.'],
    ['1', 'Efeito mínimo. Geralmente curto, fraco ou parcialmente bem-sucedido.'],
    ['2', 'Efeito completo esperado para uma utilização comum da magia.'],
    ['3', 'Efeito poderoso, podendo ampliar duração, intensidade ou alcance.'],
    ['4', 'Efeito excepcional. Grandes áreas, vários alvos ou resultados muito precisos.'],
    ['5+', 'Feito extraordinário, frequentemente digno de grandes mestres da Arte.']
  ],
  resultNote: 'Algumas magias exigem um número mínimo de sucessos para funcionar, especialmente efeitos muito complexos, permanentes ou envolvendo vários alvos.',
  paradoxIntro: 'A quantidade exata sempre fica a critério da Narradora, mas a tabela serve como referência prática.',
  paradox: [
    ['Coincidental e plausível', '0'],
    ['Coincidental muito improvável', '0–1'],
    ['Vulgar sem testemunhas', '1'],
    ['Vulgar diante de Adormecidos', '2–3'],
    ['Grandes alterações da realidade', '+1 a +3 adicionais'],
    ['Falha crítica (Botch)', 'A Narradora pode adicionar Paradoxo extra conforme a gravidade']
  ],
  paradoxNote: 'Quanto mais impossível parecer o efeito para o Consenso, maior tende a ser o Paradoxo acumulado.',
  example: {
    title: 'Prisão Temporal de Fogo',
    intro: 'Uma bruxa deseja prender um inimigo dentro de uma esfera de chamas praticamente imóvel no tempo.',
    spheres: [
      ['Forças ●●●●', 'Criar e controlar fogo.'],
      ['Tempo ●●●●', 'Desacelerar o fluxo temporal ao redor do alvo.']
    ],
    casting: [
      'A bruxa possui Arcana 5, Forças 4 e Tempo 4.',
      'A Narradora considera a magia vulgar, com dificuldade 8.',
      'Rolagem: 5d10 → 10, 9, 8, 4, 1. São 3 sucessos com resultado 8 ou maior, menos 1 cancelamento pelo resultado 1: total de 2 sucessos, um efeito completo.'
    ],
    result: [
      'Surge uma prisão de fogo envolvendo o alvo.',
      'As chamas permanecem quase congeladas no tempo, queimando continuamente sem se espalhar.',
      'O alvo fica aprisionado por alguns turnos e sofre dano enquanto permanecer dentro da área.'
    ],
    alternatives: [
      ['3 sucessos', 'A duração seria maior ou o fogo causaria mais dano.'],
      ['4 sucessos', 'Poderia prender vários inimigos ou aumentar significativamente a área.'],
      ['5 sucessos ou mais', 'A prisão temporal poderia persistir por muito tempo, tornando-se extremamente difícil de escapar.']
    ],
    paradox: [
      ['Sem Adormecidos presentes', '1'],
      ['Diante de Adormecidos', '3']
    ],
    paradoxResult: 'Ao final da conjuração, esse valor é adicionado à reserva de Paradoxo da bruxa.'
  },
  combinedUse: {
    title: 'Usando magias e habilidades em conjunto',
    sections: [
      {
        title: 'Magia aprimorando Habilidades',
        text: 'As Esferas podem ser usadas para potencializar temporariamente Atributos e Habilidades, tornando a personagem mais forte, rápida, inteligente ou habilidosa em determinada tarefa. Por exemplo, Vida pode aumentar a força física ou os reflexos, Mente pode ampliar concentração, memória e raciocínio, enquanto Forças pode acelerar movimentos por meio de impulsos cinéticos. Após conjurar a magia, a ação normalmente é resolvida utilizando os valores aprimorados da ficha.'
      },
      {
        title: 'Habilidades viabilizando Magias',
        text: 'Embora o efeito de uma magia seja determinado pelas Esferas e pelo teste de Arcana, muitas magias também exigem conhecimento mundano para serem executadas com precisão. A Narradora pode solicitar uma Habilidade apropriada, como Medicina, Ciência, Ocultismo, Ofícios ou Armas de Fogo, para definir a qualidade técnica do resultado ou até reduzir a dificuldade da conjuração, especialmente quando o efeito depende de conhecimento especializado. Dessa forma, uma boa formação mundana torna as magias mais versáteis e convincentes, mesmo sem aumentar diretamente seu poder místico.'
      }
    ],
    cooperativeMagic: {
      title: 'Magia em Conjunto (Rituais Cooperativos)',
      paragraphs: [
        'Duas ou mais bruxas podem conjurar uma mesma magia em conjunto, unindo seus conhecimentos para realizar efeitos que seriam difíceis ou impossíveis individualmente. Cada participante deve possuir as Esferas correspondentes à parte da magia que está fornecendo ao ritual. Em conjunto, o grupo deve atender a todos os requisitos de Esferas e níveis exigidos pelo efeito.',
        'Uma delas é escolhida como conjuradora principal, sendo responsável pelo teste de Arcana e pela resolução final da magia. As demais bruxas realizam um teste de Arcana para prestar auxílio; cada sucesso obtido concede +1 dado ao teste de Arcana da conjuradora principal, ou outro benefício definido pela Narradora conforme a edição e a natureza do ritual. Todas as participantes devem estar envolvidas na conjuração e sujeitas às consequências do ritual.',
        'Caso a magia gere Paradoxo, ele normalmente recai sobre a conjuradora principal, mas a Narradora pode optar por distribuí-lo entre todas as participantes, especialmente em rituais longos, efeitos extremamente vulgares ou quando todas contribuíram igualmente para a alteração da realidade.'
      ],
      example: 'Uma bruxa com Forças ●●●● deseja invocar uma tempestade de relâmpagos, enquanto outra possui Primórdio ●●● para alimentar a magia com Quintessência. A primeira conduz o ritual e realiza o teste final de Arcana; a segunda realiza um teste de auxílio e, com 2 sucessos, concede +2 dados ao teste da conjuradora principal. O efeito final combina ambas as Esferas em uma única magia cooperativa.'
    }
  }
};

const wikiWillpowerGuide = {
  id: 'willpower',
  title: 'Força de Vontade (Willpower)',
  intro: 'Representa a determinação da personagem e pode ser usada de diversas formas, tanto de maneira passiva quanto ativa.',
  recovery: 'A Força de Vontade temporária é recuperada por meio de descanso, realização de objetivos importantes, interpretação consistente da Natureza ou Comportamento (Demeanor), dependendo da edição, ou recompensas concedidas pela Narradora. Já o valor permanente de Força de Vontade só aumenta com experiência. Na ficha, o preenchimento representa os pontos temporários e pode ser alterado livremente; as bordas mais escuras representam níveis permanentes ainda não adquiridos e só ficam disponíveis durante a edição por experiência.',
  uses: [
    ['Sucesso automático', 'Gastar 1 ponto temporário de Força de Vontade concede 1 sucesso automático em uma ação apropriada. Geralmente não pode ser usado em testes de dano ou Absorção, a critério da Narradora, e deve ser declarado antes da rolagem.'],
    ['Resistir a controle mental ou emocional', 'Pode ser exigido um teste de Força de Vontade para resistir a magias de Mente, Dominate de vampiros, Delirium de Garou, intimidação sobrenatural e efeitos semelhantes.'],
    ['Ignorar penalidades temporariamente', 'Em situações dramáticas, a Narradora pode permitir gastar um ponto para agir apesar de medo extremo, dor intensa, exaustão ou outras limitações narrativas.'],
    ['Manter concentração', 'Ajuda a continuar uma ação que normalmente seria interrompida, como sustentar uma magia sob pressão ou permanecer focado durante distrações intensas.'],
    ['Resistir ao Quiet', 'Em alguns casos, testes de Força de Vontade são utilizados para evitar ou superar episódios de Quiet causados pelo Paradoxo.'],
    ['Recuperar o controle', 'Também pode ser usada para recuperar a compostura após efeitos sobrenaturais que alterem emoções, ilusões ou comportamento.']
  ]
};

const wikiQuintessenceGuide = {
  id: 'quintessence',
  title: 'Quintessência',
  intro: 'É a energia primordial utilizada pelos magos para alimentar suas magias e realizar feitos extraordinários. Embora muitos efeitos possam ser conjurados sem seu uso, gastar Quintessência torna as magias mais eficientes e ajuda a contornar as limitações impostas pelo Consenso.',
  recovery: 'É obtida principalmente em Nodos (Nodes), locais de poder, por meio de Tass, a Quintessência cristalizada, de certos efeitos da Esfera Primórdio ou de outras fontes místicas definidas pela Narradora.',
  uses: [
    ['Reduzir a dificuldade da magia', 'Gastar 1 ponto pode reduzir a dificuldade do teste de Arcana em 1, até o mínimo permitido pela Narradora ou pelas regras da edição.'],
    ['Alimentar efeitos poderosos', 'Algumas magias exigem Quintessência para criar matéria, sustentar efeitos duradouros, produzir fenômenos permanentes ou realizar grandes rituais.'],
    ['Encantar objetos', 'É usada na criação de talismãs, maravilhas e outros itens mágicos permanentes ou semipermanentes.'],
    ['Canalizar energia', 'Pode ser transferida entre certos receptáculos, como Tass e Nodos, ou utilizada para abastecer outros efeitos mágicos, conforme permitido pela Narradora.'],
    ['Interagir com Primórdio', 'Muitas magias da Esfera Primórdio utilizam ou manipulam diretamente Quintessência, permitindo armazená-la, detectá-la, transferi-la ou refiná-la.']
  ]
};

const wikiTopics = [
  {
    id: 'identity',
    title: 'Identidade',
    intro: 'Dados que identificam a personagem e o contexto da crônica.',
    entries: [
      ['Nome', 'Nome da personagem. Também define o nome do arquivo salvo em snake_case.'],
      ['Crônica', 'Período e cenário em que a história acontece.'],
      ['Experiência e Freebies', 'Experiência compra níveis depois da criação. Durante a criação, os Freebies complementam os pontos iniciais. O botão de concluir só permite encerrar a criação depois que todos os pools e Freebies forem gastos.'],
      ['Imagem', 'Imagem quadrada da personagem, salva separadamente quando a ficha usa integrações externas.']
    ]
  },
  {
    id: 'health',
    title: 'Saúde',
    intro: 'Registra até sete caixas de dano, ordenadas automaticamente pela gravidade.',
    entries: [
      ['Contusão', 'Dano de socos, quedas leves, pauladas e cansaço extremo.'],
      ['Letal', 'Dano de facas, espadas, mordidas e tiros.'],
      ['Agravado', 'Dano de fogo sobrenatural, monstros, magia extremamente destrutiva e certas maldições.'],
      ['Penalidade', 'O nível atual de saúde informa a penalidade de dados e quando a personagem está incapacitada.']
    ]
  },
  {
    id: 'attributes',
    title: 'Atributos',
    intro: 'Capacidades fundamentais da personagem, divididas em Físicos, Sociais e Mentais.',
    groups: [
      {
        title: 'Físicos',
        paths: [
          ['attributes.strength', 'Força'], ['attributes.dexterity', 'Destreza'], ['attributes.stamina', 'Vigor']
        ]
      },
      {
        title: 'Sociais',
        paths: [
          ['attributes.charisma', 'Carisma'], ['attributes.manipulation', 'Manipulação'], ['attributes.appearance', 'Aparência']
        ]
      },
      {
        title: 'Mentais',
        paths: [
          ['attributes.perception', 'Percepção'], ['attributes.intelligence', 'Inteligência'], ['attributes.wits', 'Raciocínio']
        ]
      }
    ]
  },
  {
    id: 'abilities',
    title: 'Habilidades',
    intro: 'Competências aprendidas, organizadas em Talentos, Perícias e Conhecimentos.',
    groups: [
      {
        title: 'Talentos',
        paths: [
          ['abilities.alertness', 'Prontidão'], ['abilities.athletics', 'Esportes'], ['abilities.awareness', 'Consciência'],
          ['abilities.brawl', 'Briga'], ['abilities.empathy', 'Empatia'], ['abilities.expression', 'Expressão'],
          ['abilities.intimidation', 'Intimidação'], ['abilities.leadership', 'Liderança'], ['abilities.streetwise', 'Manha'],
          ['abilities.subterfuge', 'Lábia']
        ]
      },
      {
        title: 'Perícias',
        paths: [
          ['abilities.crafts', 'Ofícios'], ['abilities.drive', 'Condução'], ['abilities.etiquette', 'Etiqueta'],
          ['abilities.firearms', 'Armas de Fogo'], ['abilities.meditation', 'Meditação'], ['abilities.melee', 'Armas Brancas'],
          ['abilities.research', 'Pesquisa'], ['abilities.stealth', 'Furtividade'], ['abilities.survival', 'Sobrevivência'],
          ['abilities.technology', 'Tecnologia']
        ]
      },
      {
        title: 'Conhecimentos',
        paths: [
          ['abilities.academics', 'Acadêmicos'], ['abilities.computer', 'Computador'], ['abilities.cosmology', 'Cosmologia'],
          ['abilities.enigmas', 'Enigmas'], ['abilities.esoterica', 'Esotérica'], ['abilities.investigation', 'Investigação'],
          ['abilities.law', 'Direito'], ['abilities.medicine', 'Medicina'], ['abilities.occult', 'Ocultismo'],
          ['abilities.science', 'Ciência']
        ]
      }
    ]
  },
  {
    id: 'combat',
    title: 'Combate',
    intro: 'O combate segue quatro etapas principais.',
    combat: wikiCombatGuide
  },
  {
    id: 'spheres',
    title: 'Esferas',
    intro: 'Aspectos da realidade que a personagem consegue compreender e alterar com magia.',
    levelSummary: [
      'Detectar, perceber, analisar.',
      'Pequena manipulação.',
      'Mudanças significativas e práticas.',
      'Transformações profundas.',
      'Domínio quase ilimitado da Esfera.'
    ],
    guides: wikiSphereGuides
  },
  {
    id: 'spellcasting',
    title: 'Conjurar Magias',
    intro: 'Fluxo para determinar, testar e resolver um efeito mágico.',
    casting: wikiSpellcastingGuide
  },
  {
    id: 'reactions',
    title: 'Ações Reativas',
    intro: 'Reações (Reflexes) são ações instantâneas realizadas fora do turno normal de uma personagem em resposta a um evento.',
    entries: [
      ['Quando usar', 'Uma reação pode responder a acontecimentos como esquivar de um ataque, bloquear um golpe, sacar uma arma rapidamente ou lançar uma magia defensiva.'],
      ['Limite', 'Cada personagem pode realizar uma reação por rodada, desde que a situação permita e ela ainda seja capaz de agir. Depois de utilizá-la, só poderá reagir novamente na rodada seguinte.'],
      ['Resolução', 'A reação é resolvida imediatamente, antes da ação que a desencadeou ser concluída, seguindo as regras específicas da ação realizada, como teste de esquiva, bloqueio ou magia.'],
      ['Contramágica (Countermagic)', 'É o uso de magia para impedir, enfraquecer ou desfazer o efeito de outra magia. Quando uma personagem percebe um efeito mágico sendo lançado ou já ativo, ela pode reagir realizando um teste de Arcana e utilizando as Esferas apropriadas para compreender e neutralizar o efeito. Cada sucesso obtido reduz 1 sucesso da magia original ou 1 ponto do poder do efeito em vigor. Se a contramágica igualar ou superar esse valor, a magia é anulada ou dissipada; caso contrário, seu efeito pode apenas ser reduzido.']
    ]
  },
  {
    id: 'advantages',
    title: 'Vantagens',
    intro: 'Recursos místicos e internos usados pela personagem.',
    paths: [
      ['advantages.arcana', 'Arcana'], ['advantages.willpower', 'Força de Vontade'],
      ['advantages.quintessence', 'Quintessência'], ['advantages.paradox', 'Paradoxo']
    ],
    advantageGuides: [wikiWillpowerGuide, wikiQuintessenceGuide]
  },
  {
    id: 'backgrounds',
    title: 'Antecedentes',
    intro: 'Relações, posses e vantagens sociais definidas durante a criação.',
    paths: [
      ['backgrounds.allies', 'Aliados', 'Pessoas próximas dispostas a ajudar você ativamente quando necessário. ● um aliado modesto → ●●● alguns aliados úteis ou um aliado influente → ●●●●● aliados numerosos ou extremamente poderosos.'],
      ['backgrounds.backup', 'Apoio', 'Uma organização ou grupo ao qual você pode recorrer para conseguir ajuda operacional. ● ajuda pequena e ocasional → ●●● apoio consistente e especializado → ●●●●● grande estrutura capaz de mobilizar muitos recursos por você.'],
      ['backgrounds.contacts', 'Contatos', 'Pessoas que fornecem informações, rumores e acesso a determinados meios. ● poucos contatos locais → ●●● boa rede em vários círculos → ●●●●● extensa rede capaz de descobrir informações raras ou protegidas.'],
      ['backgrounds.spies', 'Espiões', 'Pessoas infiltradas que coletam informações secretamente para você. ● uma fonte infiltrada de baixo nível → ●●● pequena rede com bom acesso → ●●●●● extensa rede infiltrada até em círculos altamente restritos.'],
      ['backgrounds.fame', 'Fama', 'O quanto você é conhecida e reconhecida publicamente. ● conhecida em um pequeno meio → ●●● reconhecida regionalmente → ●●●●● figura de enorme notoriedade.'],
      ['backgrounds.influence', 'Influência', 'O poder social que você exerce sobre instituições, comunidades ou grupos. ● influência em um pequeno círculo → ●●● poder relevante sobre uma instituição ou região → ●●●●● influência capaz de afetar decisões de grande escala.'],
      ['backgrounds.wonder', 'Maravilha', 'Um objeto mágico capaz de produzir efeitos sobrenaturais ou armazenar poder. ● objeto com efeito pequeno ou limitado → ●●● artefato mágico bastante útil → ●●●●● relíquia excepcional com poderes extraordinários.'],
      ['backgrounds.mentor', 'Mentor', 'Uma pessoa mais experiente que ensina, aconselha e ocasionalmente auxilia você. ● mentor experiente, mas limitado → ●●● figura poderosa e respeitada → ●●●●● mestre extraordinário, com enorme conhecimento e influência.'],
      ['backgrounds.patron', 'Patrono', 'Uma pessoa ou entidade poderosa que protege, financia ou favorece você, geralmente esperando algo em troca. ● patrono de recursos modestos → ●●● protetor poderoso e influente → ●●●●● patrono de poder e alcance extraordinários.'],
      ['backgrounds.resources', 'Recursos', 'Sua riqueza pessoal e capacidade de conseguir dinheiro, propriedades e bens materiais. ● vida simples, mas estável → ●●● riqueza confortável e patrimônio significativo → ●●●●● enorme fortuna e acesso a bens excepcionais.'],
      ['backgrounds.sanctum', 'Refúgio', 'Também chamado de Santuário: um local seguro e preparado para estudo, descanso e práticas mágicas. ● refúgio pequeno e simples → ●●● santuário seguro e bem equipado → ●●●●● domínio vasto, extremamente protegido e profundamente ligado à magia.'],
      ['backgrounds.dream', 'Sonho', 'Sua conexão sobrenatural com sonhos, visões e o inconsciente, permitindo obter intuições e conhecimentos. ● pressentimentos vagos → ●●● sonhos reveladores relativamente confiáveis → ●●●●● visões profundas capazes de revelar verdades extraordinárias.'],
      ['backgrounds.pastLives', 'Vidas Passadas', 'Memórias e conhecimentos provenientes de encarnações anteriores. ● lembranças fragmentadas → ●●● memórias úteis e acessíveis → ●●●●● ligação excepcional com múltiplas vidas e conhecimentos antigos.']
    ],
    entries: [
      ['Biblioteca', 'Uma coleção de livros, registros e materiais úteis para pesquisas mundanas ou ocultas. ● pequena coleção especializada → ●●● biblioteca extensa e diversificada → ●●●●● acervo excepcional contendo conhecimentos extremamente raros.'],
      ['Aspirações', 'Coisas que a bruxa deseja a curto prazo.'],
      ['Obsessão / vício', 'Coisas que a bruxa anseia de forma compulsiva a longo prazo.']
    ]
  },
  {
    id: 'coven',
    title: 'Coven',
    intro: 'Dados compartilhados pelo grupo, normalmente mantidos em modo somente leitura.',
    entries: [
      ['Recursos', 'Reúne nome, Fama, Quintessência, Paradoxo e Óbolo dos Mortos do coven.'],
      ['Transferências', 'Duas Quintessências da personagem geram uma no coven; um Paradoxo da personagem gera dois no coven.'],
      ['Dispensa', 'Inventário compartilhado com 16 espaços, nomes, descrições e imagens. Um item também pode ser importado pelo ID do inventário geral: nome, descrição e todas as imagens são copiados para o coven, preservando o ID de origem, mas efeitos de Esfera não são armazenados no coven. Depois da cópia, alterações no inventário e na Dispensa são independentes. Itens podem ser excluídos durante a edição após confirmação.'],
      ['Usar item do inventário', 'Um item da Dispensa com ID de inventário pode ser usado uma única vez. Antes da confirmação, um resumo mostra todos os efeitos relidos do inventário. Cada Esfera que atender ao próprio nível mínimo recebe os pontos sem ultrapassar o máximo configurado; efeitos sem o requisito são ignorados sem bloquear os demais. Ao confirmar, o item é marcado como usado. O modal de detalhes informa esse estado mesmo no modo somente leitura.'],
      ['Salvamento da Dispensa', 'Criar, alterar, excluir ou consumir um item salva automaticamente o coven sem liberar o lock. A edição continua disponível até ser concluída ou atingir o limite de dez minutos.'],
      ['Edição', 'A edição sincronizada usa um bloqueio temporário de até dez minutos.']
    ]
  },
  {
    id: 'lineage',
    title: 'Linhagem',
    intro: 'Registra a herança mágica compartilhada entre personagens.',
    entries: [
      ['Esferas', 'A experiência acumulada pela linhagem determina os níveis disponíveis em cada Esfera.'],
      ['Membros', 'Cada membro registra personagem, crônica, estado de vida e contribuição de experiência.'],
      ['Morte e herança', 'Ao morrer, metade da experiência conquistada depois da criação pode passar para a linhagem.'],
      ['Bônus de criação', 'Uma nova personagem pode herdar níveis inteiros de Esferas compráveis pela experiência da linhagem.']
    ]
  }
];

let activeWikiTopicId = wikiTopics[0].id;
let activeWikiHighlightIndex = 0;
let pendingWikiHighlightEdge = null;

function normalizedWikiText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

function wikiTopicEntries(topic) {
  const described = (topic.paths || []).map(([path, label, description]) => (
    [label, description || fieldDescriptions[path] || '']
  ));
  const grouped = (topic.groups || []).flatMap(group => (
    group.paths.map(([path, label, description]) => [label, description || fieldDescriptions[path] || ''])
  ));
  return [...described, ...grouped, ...(topic.entries || [])];
}

function wikiTopicSearchText(topic) {
  const groupTitles = (topic.groups || []).map(group => group.title);
  const guides = (topic.guides || []).flatMap(guide => (
    [
      guide.title,
      guide.originalTitle,
      guide.summary,
      ...(guide.definition || []),
      ...(guide.examples || []).flat(),
      ...guide.levels
    ]
  ));
  const combat = topic.combat
    ? [
        topic.combat.initiative?.title,
        topic.combat.initiative?.text,
        ...topic.combat.steps.flatMap(step => [
          step.title,
          step.subtitle,
          ...(step.paragraphs || []),
          ...(step.items || []).flat(),
          ...(step.soak || []).flat(),
          step.magicProtectionIntro,
          ...(step.magicProtections || []).flat()
        ]),
        ...topic.combat.examples.flat()
      ]
    : [];
  const casting = topic.casting ? flattenWikiValues(topic.casting) : [];
  const advantageGuides = topic.advantageGuides ? flattenWikiValues(topic.advantageGuides) : [];
  return [
    topic.title,
    topic.intro,
    ...(topic.levelSummary || []),
    ...groupTitles,
    ...guides,
    ...combat,
    ...casting,
    ...advantageGuides,
    ...wikiTopicEntries(topic).flat()
  ].join(' ');
}

function flattenWikiValues(value) {
  if (Array.isArray(value)) return value.flatMap(flattenWikiValues);
  if (value && typeof value === 'object') return Object.values(value).flatMap(flattenWikiValues);
  return value == null ? [] : [String(value)];
}

function matchingWikiTopics(query) {
  const terms = normalizedWikiText(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return wikiTopics;
  return wikiTopics.filter(topic => {
    const searchable = normalizedWikiText(wikiTopicSearchText(topic));
    return terms.every(term => searchable.includes(term));
  });
}

function renderWikiMenu(topics) {
  const menu = document.getElementById('wikiTopicMenu');
  menu.replaceChildren();
  topics.forEach(topic => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `wiki-topic-button${topic.id === activeWikiTopicId ? ' is-active' : ''}`;
    button.dataset.wikiTopic = topic.id;
    button.setAttribute('aria-current', topic.id === activeWikiTopicId ? 'page' : 'false');
    button.textContent = topic.title;
    button.addEventListener('click', () => selectWikiTopic(topic.id));
    menu.append(button);
  });
}

function renderWikiTopic(topic, query = '') {
  const content = document.getElementById('wikiTopicContent');
  content.replaceChildren();
  const heading = document.createElement('h3');
  heading.textContent = topic.title;
  const intro = document.createElement('p');
  intro.className = 'wiki-topic-intro';
  intro.textContent = topic.intro;
  content.append(heading, intro);

  const appendEntries = (entries, groupTitle = '') => {
    if (!entries.length) return;
    if (groupTitle) {
      const groupHeading = document.createElement('h4');
      groupHeading.className = 'wiki-entry-group-title';
      groupHeading.textContent = groupTitle;
      content.append(groupHeading);
    }
    const list = document.createElement('dl');
    list.className = 'wiki-entry-list';
    entries.forEach(([label, description]) => {
      const term = document.createElement('dt');
      term.textContent = label;
      const detail = document.createElement('dd');
      detail.textContent = description;
      list.append(term, detail);
    });
    content.append(list);
  };

  if (topic.combat) {
    renderWikiCombat(content, topic.combat);
  }
  if (topic.casting) {
    renderWikiSpellcasting(content, topic.casting);
  }

  if (topic.levelSummary?.length) {
    const summarySection = document.createElement('section');
    summarySection.className = 'wiki-level-summary';
    const summaryHeading = document.createElement('h4');
    summaryHeading.className = 'wiki-entry-group-title';
    summaryHeading.textContent = 'Resumo por nível';
    summarySection.append(summaryHeading, createWikiLevelTable(topic.levelSummary, 'Escopo geral'));
    content.append(summarySection);
  }

  if (topic.guides?.length) {
    topic.guides.forEach(guide => {
      const section = document.createElement('section');
      section.className = 'wiki-sphere-guide';
      section.dataset.wikiSphere = guide.path;

      const groupHeading = document.createElement('h4');
      groupHeading.className = 'wiki-entry-group-title';
      groupHeading.textContent = guide.title;
      const originalTitle = document.createElement('span');
      originalTitle.className = 'wiki-sphere-original-title';
      originalTitle.textContent = guide.originalTitle;
      groupHeading.append(originalTitle);

      const summary = document.createElement('p');
      summary.className = 'wiki-sphere-summary';
      const summaryLabel = document.createElement('strong');
      summaryLabel.textContent = 'Resumo: ';
      summary.append(summaryLabel, document.createTextNode(guide.summary));

      section.append(groupHeading, summary);
      if (guide.definition) {
        const definition = document.createElement('p');
        definition.className = 'wiki-sphere-definition';
        const definitionTerm = document.createElement('strong');
        definitionTerm.textContent = `${guide.definition[0]}: `;
        definition.append(definitionTerm, document.createTextNode(guide.definition[1]));
        section.append(definition);
      }
      section.append(createWikiLevelTable(guide.levels, 'O que habilita'));
      if (guide.examples?.length) {
        const examplesHeading = document.createElement('h5');
        examplesHeading.className = 'wiki-sphere-examples-title';
        examplesHeading.textContent = 'Exemplos de efeitos';
        section.append(examplesHeading, createWikiExamplesTable(guide.examples));
      }
      content.append(section);
    });
  } else if (topic.groups?.length) {
    topic.groups.forEach(group => {
      const entries = group.paths.map(([path, label, description]) => (
        [label, description || fieldDescriptions[path] || '']
      ));
      appendEntries(entries, group.title);
    });
    appendEntries(topic.entries || []);
  } else {
    appendEntries(wikiTopicEntries(topic));
  }
  if (topic.advantageGuides?.length) {
    topic.advantageGuides.forEach(guide => renderWikiAdvantageGuide(content, guide));
  }
  highlightWikiMatches(content, query);
}

function renderWikiAdvantageGuide(content, guide) {
  const section = document.createElement('section');
  section.className = 'wiki-advantage-guide';
  section.dataset.wikiAdvantageGuide = guide.id;
  const heading = document.createElement('h4');
  heading.className = 'wiki-content-section-title';
  heading.textContent = guide.title;
  const intro = document.createElement('p');
  intro.textContent = guide.intro;
  const recovery = document.createElement('p');
  recovery.textContent = guide.recovery;
  section.append(
    heading,
    intro,
    recovery,
    createWikiSimpleTable(['Situação', 'Efeito'], guide.uses, 'wiki-advantage-table')
  );
  content.append(section);
}

function renderWikiCombat(content, combat) {
  if (combat.initiative) {
    const initiative = document.createElement('section');
    initiative.className = 'wiki-combat-initiative';
    const heading = document.createElement('h4');
    heading.textContent = combat.initiative.title;
    const paragraph = document.createElement('p');
    paragraph.textContent = combat.initiative.text;
    initiative.append(heading, paragraph);
    content.append(initiative);
  }
  const flow = document.createElement('ol');
  flow.className = 'wiki-combat-flow';
  combat.steps.forEach(step => {
    const item = document.createElement('li');
    const heading = document.createElement('h4');
    heading.textContent = step.title;
    const subtitle = document.createElement('p');
    subtitle.className = 'wiki-combat-step-subtitle';
    subtitle.textContent = step.subtitle;
    item.append(heading, subtitle);

    if (step.items?.length) {
      const list = document.createElement('ul');
      step.items.forEach(([term, description]) => {
        const listItem = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = `${term}: `;
        listItem.append(strong, document.createTextNode(description));
        list.append(listItem);
      });
      item.append(list);
    }
    if (step.soak?.length) item.append(createWikiSimpleTable(['Tipo de dano', 'Quem pode absorver'], step.soak, 'wiki-soak-table'));
    (step.paragraphs || []).forEach(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      item.append(paragraph);
    });
    if (step.magicProtections?.length) {
      const protectionHeading = document.createElement('h5');
      protectionHeading.className = 'wiki-combat-protection-title';
      protectionHeading.textContent = 'Proteção mágica';
      const protectionIntro = document.createElement('p');
      protectionIntro.textContent = step.magicProtectionIntro;
      item.append(
        protectionHeading,
        protectionIntro,
        createWikiSimpleTable(
          ['Tipo de proteção', 'Esferas comuns', 'Como funciona'],
          step.magicProtections,
          'wiki-magic-protection-table'
        )
      );
    }
    flow.append(item);
  });
  content.append(flow);

  const examplesHeading = document.createElement('h4');
  examplesHeading.className = 'wiki-combat-examples-title';
  examplesHeading.textContent = 'Exemplos';
  content.append(
    examplesHeading,
    createWikiSimpleTable(
      ['Exemplo', 'Teste de Ataque / Conjuração', 'Resultado do Ataque', 'Rolagem de Dano', 'Dano Potencial', 'Absorção', 'Dano Final'],
      combat.examples,
      'wiki-combat-examples-table'
    )
  );
}

function renderWikiSpellcasting(content, casting) {
  const flow = document.createElement('ol');
  flow.className = 'wiki-spellcasting-flow';
  casting.steps.forEach(step => {
    const item = document.createElement('li');
    const heading = document.createElement('h4');
    heading.textContent = step.title;
    item.append(heading);
    if (step.text) {
      const paragraph = document.createElement('p');
      paragraph.textContent = step.text;
      item.append(paragraph);
    }
    if (step.items) item.append(createWikiTextList(step.items));
    if (step.difficulties) {
      item.append(createWikiSimpleTable(['Dificuldade', 'Tipo de magia'], step.difficulties, 'wiki-spellcasting-table'));
    }
    flow.append(item);
  });
  content.append(flow);

  appendWikiSectionHeading(content, 'Resultado da Magia');
  content.append(createWikiSimpleTable(['Sucessos', 'Resultado'], casting.results, 'wiki-spellcasting-table'));
  content.append(createWikiNote(casting.resultNote));

  appendWikiSectionHeading(content, 'Geração de Paradoxo');
  const paradoxIntro = document.createElement('p');
  paradoxIntro.textContent = casting.paradoxIntro;
  content.append(paradoxIntro, createWikiSimpleTable(['Tipo de Magia', 'Paradoxo sugerido'], casting.paradox, 'wiki-spellcasting-table'));
  content.append(createWikiNote(casting.paradoxNote));

  appendWikiSectionHeading(content, 'Exemplo');
  const exampleTitle = document.createElement('h5');
  exampleTitle.className = 'wiki-spell-example-title';
  exampleTitle.textContent = casting.example.title;
  const exampleIntro = document.createElement('p');
  exampleIntro.textContent = casting.example.intro;
  content.append(exampleTitle, exampleIntro);

  appendWikiSubheading(content, 'Esferas necessárias');
  content.append(createWikiDefinitionList(casting.example.spheres));
  appendWikiSubheading(content, 'Conjuração');
  content.append(createWikiTextList(casting.example.casting));
  appendWikiSubheading(content, 'Resultado');
  content.append(createWikiTextList(casting.example.result));
  content.append(createWikiDefinitionList(casting.example.alternatives));
  appendWikiSubheading(content, 'Paradoxo');
  content.append(createWikiSimpleTable(['Situação', 'Paradoxo'], casting.example.paradox, 'wiki-spellcasting-table'));
  const paradoxResult = document.createElement('p');
  paradoxResult.textContent = casting.example.paradoxResult;
  content.append(paradoxResult);

  appendWikiSectionHeading(content, casting.combinedUse.title);
  casting.combinedUse.sections.forEach(section => {
    appendWikiSubheading(content, section.title);
    const paragraph = document.createElement('p');
    paragraph.className = 'wiki-combined-use-text';
    paragraph.textContent = section.text;
    content.append(paragraph);
  });
  const cooperative = casting.combinedUse.cooperativeMagic;
  appendWikiSubheading(content, cooperative.title);
  cooperative.paragraphs.forEach(text => {
    const paragraph = document.createElement('p');
    paragraph.className = 'wiki-combined-use-text';
    paragraph.textContent = text;
    content.append(paragraph);
  });
  const example = createWikiNote(cooperative.example);
  const exampleLabel = document.createElement('strong');
  exampleLabel.textContent = 'Exemplo: ';
  example.prepend(exampleLabel);
  content.append(example);
}

function appendWikiSectionHeading(content, text) {
  const heading = document.createElement('h4');
  heading.className = 'wiki-content-section-title';
  heading.textContent = text;
  content.append(heading);
}

function appendWikiSubheading(content, text) {
  const heading = document.createElement('h6');
  heading.className = 'wiki-content-subtitle';
  heading.textContent = text;
  content.append(heading);
}

function createWikiTextList(items) {
  const list = document.createElement('ul');
  list.className = 'wiki-content-list';
  items.forEach(text => {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  });
  return list;
}

function createWikiDefinitionList(entries) {
  const list = document.createElement('dl');
  list.className = 'wiki-content-definitions';
  entries.forEach(([term, definition]) => {
    const termElement = document.createElement('dt');
    termElement.textContent = term;
    const definitionElement = document.createElement('dd');
    definitionElement.textContent = definition;
    list.append(termElement, definitionElement);
  });
  return list;
}

function createWikiNote(text) {
  const note = document.createElement('blockquote');
  note.className = 'wiki-content-note';
  note.textContent = text;
  return note;
}

function createWikiSimpleTable(headers, rows, className) {
  const wrapper = document.createElement('div');
  wrapper.className = 'wiki-table-scroll';
  const table = document.createElement('table');
  table.className = className;
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  headers.forEach(label => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = label;
    headRow.append(cell);
  });
  head.append(headRow);
  const body = document.createElement('tbody');
  rows.forEach(values => {
    const row = document.createElement('tr');
    values.forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    });
    body.append(row);
  });
  table.append(head, body);
  wrapper.append(table);
  return wrapper;
}

function createWikiLevelTable(levels, descriptionHeading) {
  const table = document.createElement('table');
  table.className = 'wiki-level-table';
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Nível', descriptionHeading].forEach(label => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = label;
    headRow.append(cell);
  });
  head.append(headRow);
  const body = document.createElement('tbody');
  levels.forEach((description, index) => {
    const row = document.createElement('tr');
    const level = document.createElement('th');
    level.scope = 'row';
    level.setAttribute('aria-label', `Nível ${index + 1}`);
    level.textContent = '●'.repeat(index + 1);
    const detail = document.createElement('td');
    detail.textContent = description;
    row.append(level, detail);
    body.append(row);
  });
  table.append(head, body);
  return table;
}

function createWikiExamplesTable(examples) {
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'wiki-table-scroll';
  const table = document.createElement('table');
  table.className = 'wiki-examples-table';
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Efeito', 'Esferas mínimas', 'Exemplo'].forEach(label => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = label;
    headRow.append(cell);
  });
  head.append(headRow);
  const body = document.createElement('tbody');
  examples.forEach(([effect, requirements, example]) => {
    const row = document.createElement('tr');
    [effect, requirements, example].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    });
    body.append(row);
  });
  table.append(head, body);
  tableWrapper.append(table);
  return tableWrapper;
}

function normalizedCharacterMap(text) {
  let normalized = '';
  const starts = [];
  const ends = [];
  Array.from(text).forEach((character, index) => {
    const value = normalizedWikiText(character);
    Array.from(value).forEach(part => {
      normalized += part;
      starts.push(index);
      ends.push(index + character.length);
    });
  });
  return { normalized, starts, ends };
}

function highlightWikiMatches(root, query) {
  const terms = normalizedWikiText(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const map = normalizedCharacterMap(node.nodeValue);
    const ranges = [];
    terms.forEach(term => {
      let from = 0;
      let index;
      while ((index = map.normalized.indexOf(term, from)) !== -1) {
        ranges.push([map.starts[index], map.ends[index + term.length - 1]]);
        from = index + term.length;
      }
    });
    if (!ranges.length) return;
    const merged = ranges.sort((a, b) => a[0] - b[0]).reduce((result, current) => {
      const previous = result[result.length - 1];
      if (previous && current[0] <= previous[1]) previous[1] = Math.max(previous[1], current[1]);
      else result.push([...current]);
      return result;
    }, []);
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    merged.forEach(([start, end]) => {
      fragment.append(document.createTextNode(node.nodeValue.slice(cursor, start)));
      const mark = document.createElement('mark');
      mark.className = 'wiki-highlight';
      mark.textContent = node.nodeValue.slice(start, end);
      fragment.append(mark);
      cursor = end;
    });
    fragment.append(document.createTextNode(node.nodeValue.slice(cursor)));
    node.replaceWith(fragment);
  });
}

function refreshWiki() {
  const input = document.getElementById('wikiSearchInput');
  const query = input.value.trim();
  const topics = matchingWikiTopics(query);
  const empty = document.getElementById('wikiEmptyState');
  const layout = document.getElementById('wikiLayout');
  document.getElementById('clearWikiSearchBtn').hidden = !query;
  document.getElementById('previousWikiMatchBtn').disabled = !query || !topics.length;
  document.getElementById('nextWikiMatchBtn').disabled = !query || !topics.length;

  if (!topics.length) {
    empty.hidden = false;
    layout.hidden = true;
    document.getElementById('wikiSearchStatus').textContent = 'Nenhuma correspondência encontrada.';
    return;
  }
  empty.hidden = true;
  layout.hidden = false;
  if (!topics.some(topic => topic.id === activeWikiTopicId)) activeWikiTopicId = topics[0].id;
  renderWikiMenu(topics);
  renderWikiTopic(wikiTopics.find(topic => topic.id === activeWikiTopicId), query);
  activateWikiHighlight(pendingWikiHighlightEdge === 'last' ? -1 : activeWikiHighlightIndex);
  pendingWikiHighlightEdge = null;
}

function selectWikiTopic(topicId) {
  activeWikiTopicId = topicId;
  activeWikiHighlightIndex = 0;
  refreshWiki();
}

function activateWikiHighlight(index) {
  const highlights = Array.from(document.querySelectorAll('#wikiTopicContent .wiki-highlight'));
  const status = document.getElementById('wikiSearchStatus');
  highlights.forEach(highlight => highlight.classList.remove('is-current'));
  if (!highlights.length) {
    status.textContent = '';
    activeWikiHighlightIndex = 0;
    return;
  }
  activeWikiHighlightIndex = ((index % highlights.length) + highlights.length) % highlights.length;
  const current = highlights[activeWikiHighlightIndex];
  current.classList.add('is-current');
  current.scrollIntoView?.({ block: 'center', inline: 'nearest' });
  const topic = wikiTopics.find(item => item.id === activeWikiTopicId);
  status.textContent = `Correspondência ${activeWikiHighlightIndex + 1} de ${highlights.length} em ${topic.title}.`;
}

function navigateWikiMatch(direction) {
  const query = document.getElementById('wikiSearchInput').value.trim();
  const topics = matchingWikiTopics(query);
  if (!query || !topics.length) return;
  const highlights = document.querySelectorAll('#wikiTopicContent .wiki-highlight');
  const nextIndex = activeWikiHighlightIndex + direction;
  if (nextIndex >= 0 && nextIndex < highlights.length) {
    activateWikiHighlight(nextIndex);
    return;
  }
  const topicIndex = Math.max(0, topics.findIndex(topic => topic.id === activeWikiTopicId));
  const nextTopicIndex = (topicIndex + direction + topics.length) % topics.length;
  activeWikiTopicId = topics[nextTopicIndex].id;
  activeWikiHighlightIndex = 0;
  pendingWikiHighlightEdge = direction < 0 ? 'last' : 'first';
  refreshWiki();
}

function handleWikiSearchInput() {
  activeWikiHighlightIndex = 0;
  pendingWikiHighlightEdge = null;
  refreshWiki();
}

function openWikiModal() {
  const modal = document.getElementById('wikiModal');
  if (!modal) return;
  modal.hidden = false;
  refreshWiki();
  document.getElementById('wikiSearchInput').focus();
}

function closeWikiModal() {
  const modal = document.getElementById('wikiModal');
  if (modal) modal.hidden = true;
}

function clearWikiSearch() {
  const input = document.getElementById('wikiSearchInput');
  input.value = '';
  activeWikiHighlightIndex = 0;
  pendingWikiHighlightEdge = null;
  refreshWiki();
  input.focus();
}

function wikiTopicForLabel(label) {
  if (label.dataset.wikiTopicLink) return label.dataset.wikiTopicLink;
  const path = label.dataset.wikiPath || '';
  if (path.startsWith('attributes.')) return 'attributes';
  if (path.startsWith('abilities.')) return 'abilities';
  if (path.startsWith('spheres.')) return 'spheres';
  if (path.startsWith('advantages.')) return 'advantages';
  if (path.startsWith('backgrounds.')) return 'backgrounds';
  return '';
}

function openWikiFromLabel(label) {
  const topicId = wikiTopicForLabel(label);
  const modal = document.getElementById('wikiModal');
  if (!topicId || !modal) return;
  activeWikiTopicId = topicId;
  activeWikiHighlightIndex = 0;
  pendingWikiHighlightEdge = null;
  document.getElementById('wikiSearchInput').value = label.dataset.wikiQuery || label.textContent.trim();
  openWikiModal();
}

function enhanceWikiTopicLabels() {
  document.querySelectorAll('[data-wiki-path], [data-wiki-topic-link]').forEach(label => {
    const query = label.dataset.wikiQuery || label.textContent.trim();
    label.classList.add('wiki-label-link');
    label.tabIndex = 0;
    label.setAttribute('role', 'link');
    label.setAttribute('aria-label', `Abrir ${query} na wiki`);
  });
}

function isNestedWikiLabelControl(target, label) {
  return target !== label && Boolean(target.closest('input, textarea, select, button, a'));
}

function bindWiki() {
  enhanceWikiTopicLabels();
  document.getElementById('openWikiBtn')?.addEventListener('click', openWikiModal);
  document.getElementById('closeWikiModal')?.addEventListener('click', closeWikiModal);
  document.getElementById('wikiSearchInput')?.addEventListener('input', handleWikiSearchInput);
  document.getElementById('previousWikiMatchBtn')?.addEventListener('click', () => navigateWikiMatch(-1));
  document.getElementById('nextWikiMatchBtn')?.addEventListener('click', () => navigateWikiMatch(1));
  document.getElementById('clearWikiSearchBtn')?.addEventListener('click', clearWikiSearch);
  document.addEventListener('click', event => {
    const label = event.target.closest('[data-wiki-path], [data-wiki-topic-link]');
    if (!label || isNestedWikiLabelControl(event.target, label)) return;
    event.preventDefault();
    openWikiFromLabel(label);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const label = event.target.closest('[data-wiki-path], [data-wiki-topic-link]');
    if (!label || isNestedWikiLabelControl(event.target, label)) return;
    event.preventDefault();
    openWikiFromLabel(label);
  });
  if (document.getElementById('wikiPage')) refreshWiki();
}
