# 🗺️ Mapa Mental - Análise de Mercado

Aplicação de mapa mental interativo para organizar conhecimento sobre análise técnica e trading.

## 📁 Estrutura do Projeto (Refatorada)

```
src/
├── index.html              # Arquivo principal (interface)
├── js/
│   └── mapa-mental.js      # Lógica da aplicação
├── css/
│   └── style.css           # Estilos
└── data/
    ├── mapa.json           # Estrutura do mapa (nós e conexões)
    └── documentos.json     # Referências aos PDFs

docs/                        # Pasta de documentos/PDFs
├── candlestick.pdf
├── fibonacci.pdf
├── vasco-mamede.pdf
├── john-murphy.pdf
├── gerenciamento-risco.pdf
├── trading-system.pdf
├── historia.pdf
├── volume.pdf
├── ifr.pdf
└── obv.pdf
```

## 🚀 Como Usar

### Abrir a Aplicação
1. Abra `src/index.html` no navegador
2. O mapa será carregado automaticamente

### Editar o Mapa
- **Clicar em um nó** → Edita o texto
- **Clique em "+"** → Adiciona nó filho
- **Clique em "✕"** → Remove o nó
- **Clique em "▼/▶"** → Expande/colapsa nó
- **Arrastar fundo** → Navega pelo mapa
- **Scroll** → Zoom in/out

### Gerenciar Documentos/PDFs

#### 1. **Adicionar um PDF**
- Coloque o arquivo na pasta `docs/`
- Exemplo: `docs/seu-documento.pdf`

#### 2. **Vincular um PDF a um Nó**
Edite `src/data/mapa.json` e adicione a propriedade `"doc"` a um nó:

```json
{
  "id": "seu-no",
  "text": "Seu Tópico",
  "doc": "seu-documento",
  "children": []
}
```

**Nota:** Use o nome do arquivo **sem a extensão** `.pdf`

#### 3. **Documentar o PDF**
Atualize `src/data/documentos.json`:

```json
{
  "id": "seu-documento",
  "nome": "Nome do Documento",
  "descricao": "Descrição breve",
  "arquivo": "seu-documento.pdf",
  "local": "docs"
}
```

## 💾 Salvamento e Exportação

- **Auto-save**: O mapa é salvo automaticamente no `localStorage`
- **Exportar JSON**: Clique em "Exportar" para baixar `mapa-mental.json`
- **Importar JSON**: Carregue um JSON anteriormente exportado

## 🎨 Customização

### Cores e Temas
Edite `src/css/style.css`:
```css
:root {
  --bg: #f7f8fa;           /* Fundo */
  --ink: #1f2937;          /* Texto */
  --accent: #2563eb;       /* Azul destaque */
  --branch-a: #2563eb;     /* Cor ramo A */
  --branch-b: #059669;     /* Cor ramo B */
}
```

### Estrutura Padrão do Mapa
Edite `src/data/mapa.json` para modificar nós, posições e estrutura.

## 📊 Funcionalidades

✅ Mapa mental interativo com drag-and-drop
✅ Zoom intuitivo com scroll
✅ Salvamento automático
✅ Importar/exportar JSON
✅ Suporte a documentos/PDFs vinculados
✅ Design responsivo
✅ Código limpo e modular

## 🔧 Estrutura Técnica

- **index.html**: Interface minimalista
- **mapa-mental.js**: Toda a lógica (dom, interações, render)
- **style.css**: Estilos completos e responsivos
- **mapa.json**: Dados puros (fácil editar)
- **documentos.json**: Metadados dos PDFs

## 🐛 Troubleshooting

### "Documento não abre"
- Verifique se o arquivo existe em `docs/`
- Verifique o nome em `mapa.json` (sem extensão `.pdf`)

### "Mapa não carrega"
- Abra o DevTools (F12) e verifique erros no Console
- Verifique se `data/mapa.json` está válido

### "Dados perdidos"
- Os dados estão salvos em `localStorage`
- Use "Exportar" para fazer backup em JSON

## 📝 Notas

- O projeto agora é **muito mais limpo** e fácil de manter
- Você pode editar `mapa.json` e `documentos.json` **sem risco de bugs**
- Os PDFs ficam organizados na pasta `docs/`
- O código JavaScript é modular e bem comentado

---

**Criado com ❤️ para análise de mercado**
