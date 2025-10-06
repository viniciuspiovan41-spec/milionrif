# Pix do Milhão

Uma plataforma de ebooks com sistema de sorteios e prêmios.

## Características

- Interface responsiva otimizada para mobile
- Sistema de seleção de cupons com limites por CPF
- Cálculo automático de preços
- Design moderno com tema escuro
- Integração com sistema de pagamentos

## Tecnologias

- HTML5
- CSS3 (com variáveis CSS e design responsivo)
- JavaScript (ES6+)
- Design mobile-first

## Como executar

### Desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

## Estrutura do projeto

```
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── images/             # Imagens e assets
├── package.json        # Configurações do projeto
├── netlify.toml        # Configurações de deploy
└── README.md           # Documentação
```

## Deploy

O projeto está configurado para deploy automático no Netlify. Qualquer push para a branch principal irá disparar um novo deploy.

## Funcionalidades

- ✅ Seleção de cupons (5, 10, 15, 20, 50, 100)
- ✅ Arredondamento automático para múltiplos de 5
- ✅ Progressão automática (20→50→100)
- ✅ Cálculo dinâmico de preços
- ✅ Interface responsiva
- ✅ Feedback visual para interações

## Suporte

Para suporte técnico, entre em contato através dos canais oficiais do Pix do Milhão.