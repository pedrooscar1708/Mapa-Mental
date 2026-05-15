# 🚀 GitHub Pages - Como Acessar

## 🌐 URL da Sua Aplicação

**Acesse aqui:** https://pedrooscar1708.github.io/Mapa-Mental/

(Pode levar 1-2 minutos para ativar após o push)

---

## 📋 O que foi feito

✅ Refatoração completa da estrutura
✅ Código modular e limpo
✅ Dados separados em JSON
✅ Push para GitHub
✅ Configuração GitHub Pages
✅ Redirecionamento automático

---

## 🔄 Como atualizar no futuro

### Passo 1: Faça suas edições locais
Edite os arquivos em:
```
Mapa-Mental-repo/
├── src/data/mapa.json         ← Estrutura do mapa
├── src/data/documentos.json   ← Documentos
├── src/css/style.css          ← Estilos
└── src/js/mapa-mental.js      ← Lógica
```

### Passo 2: Adicione PDFs
Coloque seus PDFs em:
```
docs/
├── candlestick.pdf
├── fibonacci.pdf
└── seu-novo-pdf.pdf
```

**IMPORTANTE:** Se quer versionar os PDFs no GitHub, remova esta linha do `.gitignore`:
```
docs/*.pdf
```

### Passo 3: Faça push
```bash
cd Mapa-Mental-repo
git add .
git commit -m "Descrição do que mudou"
git push origin main
```

O GitHub Pages atualiza automaticamente! ⚡

---

## ⚙️ Configuração do GitHub Pages

✓ Branch: `main`
✓ Diretório: Raiz do repositório
✓ Redireciona para: `src/index.html`

---

## 🐛 Se não funcionar

### Erro: "Página não encontra os arquivos"
→ Verifique se os caminhos em `mapa.json` estão corretos

### Erro: "PDFs não abrem"
→ Coloque os PDFs na pasta `docs/` e use o nome sem extensão em `mapa.json`

### Erro: "Página branca"
→ Abra o DevTools (F12) → Console e procure por erros

---

## 📚 Links Úteis

- **Repository:** https://github.com/pedrooscar1708/Mapa-Mental
- **Live Site:** https://pedrooscar1708.github.io/Mapa-Mental/
- **README:** Leia `README.md` para mais detalhes

---

**Seu mapa mental está VIVO! 🎉**
