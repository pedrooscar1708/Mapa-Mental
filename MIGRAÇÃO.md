# 📋 Guia de Migração - Nova Estrutura

## O que mudou?

### ❌ Antes (Problema)
- Tudo em **um arquivo gigante** (~270KB)
- PDFs **embutidos como HTML** → Impossível editar o mapa sem bugs
- Código misturado com dados
- Difícil de manter e customizar

### ✅ Agora (Solução)
- Código organizado em **módulos**
- Dados separados em **arquivos JSON**
- PDFs na **pasta `docs/`** (simples referência)
- Código **limpo e fácil de entender**

---

## 📦 Arquivos Criados

```
src/
├── index.html                  ← Abra isto no navegador
├── js/mapa-mental.js           ← Lógica (só editar se souber JS)
├── css/style.css               ← Estilos (cores, layout)
└── data/
    ├── mapa.json              ← EDITE AQUI: estrutura do mapa
    └── documentos.json        ← EDITE AQUI: metadados dos PDFs

docs/                           ← Coloque seus PDFs aqui
├── candlestick.pdf
├── fibonacci.pdf
└── ... (seus PDFs)
```

---

## 🔄 Como Migrar Seus PDFs

### Passo 1: Copie os PDFs
Coloque todos seus PDFs na pasta `docs/`:
```
docs/
├── seu-pdf-1.pdf
├── seu-pdf-2.pdf
└── seu-documento.pdf
```

### Passo 2: Atualize `mapa.json`
Para cada nó que deve ter um PDF, adicione `"doc"`:

```json
{
  "id": "seu-no",
  "text": "Nome do Tópico",
  "doc": "seu-documento",
  "children": []
}
```

**Importante:** use o nome **sem extensão** `.pdf`

### Passo 3: Atualize `documentos.json`
Registre seus PDFs para referência:

```json
{
  "id": "seu-documento",
  "nome": "Título do PDF",
  "descricao": "O que é sobre",
  "arquivo": "seu-documento.pdf",
  "local": "docs"
}
```

---

## 🎯 Exemplo Prático

### Situação: Você tem `trabalho-macd.pdf` que quer vincular ao nó MACD

**1. Coloque o arquivo:**
```
docs/trabalho-macd.pdf
```

**2. Edite `mapa.json`:**
Procure pelo nó MACD e adicione `"doc"`:
```json
{
  "id": "macd",
  "text": "MACD",
  "x": 2400,
  "y": 740,
  "doc": "trabalho-macd",
  "children": []
}
```

**3. Edite `documentos.json`:**
Adicione na lista:
```json
{
  "id": "trabalho-macd",
  "nome": "Trabalho MACD",
  "descricao": "Análise do indicador MACD",
  "arquivo": "trabalho-macd.pdf",
  "local": "docs"
}
```

**4. Pronto!** Abra o mapa e clique no botão 📄 do nó MACD

---

## ⚠️ Evite Erros

### ❌ NÃO FAÇA:
```json
"doc": "trabalho-macd.pdf"  // ← SEM extensão!
"doc": "Trabalho MACD"      // ← Use ID, não nome
```

### ✅ FAÇA:
```json
"doc": "trabalho-macd"  // ← Apenas o ID/nome
```

---

## 🧹 Limpeza Final

Se não precisar mais:
- Delete `Mapa-Mental-original.html` (arquivo antigo)
- Delete os arquivos temporários (`temp-*.txt`)

---

## 📚 Documentação

Veja `README.md` para:
- Como usar a aplicação
- Customizar cores e temas
- Troubleshooting
- Estrutura técnica

---

## ✨ Benefícios da Nova Estrutura

✅ **Editar dados** sem risco de quebrar o código
✅ **Adicionar PDFs** facilmente na pasta `docs/`
✅ **Código limpo** e organizado
✅ **Fácil manutenção** para você ou outra pessoa
✅ **Sem dependências** de bibliotecas complexas
✅ **Rápido** - carrega em millisegundos

---

**Aproveite a nova estrutura limpa! 🚀**
