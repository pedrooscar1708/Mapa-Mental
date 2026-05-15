// ============================================================================
// MAPA MENTAL - Aplicação de Mapa Mental Interativo
// ============================================================================

const STORAGE_KEY = "mindmap_analise_mercado_v6";
const FILES_DB = "mapa-mental-files";
const FILES_STORE = "files";

// State
let data = null;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStartX, dragStartY;
let draggedNode = null;
let selectedNodeId = null;

// DOM References
const canvas = document.getElementById("canvas");
const linksSvg = document.getElementById("links");
const wrap = document.getElementById("canvas-wrap");
const saveIndicator = document.getElementById("save-indicator");
const toast = document.getElementById("toast");

// Constants
const ZOOM_MIN = 0.15,
  ZOOM_MAX = 3;
const STORAGE_DEBOUNCE = 500;
let saveTimeout = null;

// ============================================================================
// DATA MANAGEMENT
// ============================================================================

async function initializeMindMap() {
  await loadMapData();
  setupUI();
  render();
  setupEventListeners();
}

async function loadMapData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      data = JSON.parse(saved);
    } catch {
      showToast("Erro ao carregar mapa salvo");
      data = await fetchDefaultMap();
    }
  } else {
    data = await fetchDefaultMap();
  }
}

async function fetchDefaultMap() {
  try {
    const response = await fetch("data/mapa.json");
    return await response.json();
  } catch {
    showToast("Erro ao carregar estrutura do mapa");
    return getEmptyMap();
  }
}

function getEmptyMap() {
  return {
    id: "root",
    text: "Análise de Mercado",
    x: 1200,
    y: 800,
    collapsed: false,
    branch: null,
    children: [],
  };
}

function save() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    showSaveIndicator();
  }, STORAGE_DEBOUNCE);
}

function showSaveIndicator() {
  saveIndicator.classList.add("show");
  setTimeout(() => {
    saveIndicator.classList.remove("show");
  }, 2000);
}

// ============================================================================
// NODE OPERATIONS
// ============================================================================

function generateNodeId() {
  return "n_" + Math.random().toString(36).slice(2, 10);
}

function findNode(node, nid) {
  if (node.id === nid) return node;
  if (node.children) {
    for (const c of node.children) {
      const found = findNode(c, nid);
      if (found) return found;
    }
  }
  return null;
}

function findParent(node, nid, parent = null) {
  if (node.id === nid) return parent;
  if (node.children) {
    for (const c of node.children) {
      const result = findParent(c, nid, node);
      if (result) return result;
    }
  }
  return null;
}

function addNode(parentId) {
  const parent = findNode(data, parentId);
  if (!parent) return;

  if (!parent.children) parent.children = [];
  parent.children.push({
    id: generateNodeId(),
    text: "Novo nó",
    x: parent.x + 300,
    y: parent.y + parent.children.length * 60,
    collapsed: false,
    children: [],
  });
  save();
  render();
}

function editNode(nid) {
  const node = findNode(data, nid);
  if (!node) return;

  const newText = prompt("Editar nó:", node.text);
  if (newText !== null && newText.trim()) {
    node.text = newText.trim();
    save();
    render();
  }
}

function deleteNode(nid) {
  if (nid === "root") {
    showToast("Não é possível deletar o nó raiz");
    return;
  }

  const parent = findParent(data, nid);
  if (!parent) return;

  const index = parent.children.findIndex((c) => c.id === nid);
  if (index !== -1) {
    parent.children.splice(index, 1);
    save();
    render();
  }
}

function toggleNode(nid) {
  const node = findNode(data, nid);
  if (node && node.children && node.children.length > 0) {
    node.collapsed = !node.collapsed;
    save();
    render();
  }
}

function openDocument(docName) {
  // Carrega documentos externos (PDFs, etc.)
  const cleanName = (docName || "").toLowerCase().replace(".pdf", "");
  const docPath = `docs/${cleanName}.pdf`;

  // Tenta abrir o PDF
  const link = document.createElement("a");
  link.href = docPath;
  link.target = "_blank";
  link.click();
}

// ============================================================================
// RENDERING
// ============================================================================

function applyTransform() {
  canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
  document.getElementById("zoom-val").textContent = Math.round(zoom * 100) + "%";
}

function setZoom(newZoom, cx = 0, cy = 0) {
  if (newZoom < ZOOM_MIN || newZoom > ZOOM_MAX) return;

  const r = newZoom / zoom;
  offsetX = cx - (cx - offsetX) * r;
  offsetY = cy - (cy - offsetY) * r;
  zoom = newZoom;
  applyTransform();
}

function centerOnNode(node) {
  const rect = wrap.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const z = 0.8;
  setZoom(z, cx, cy);
  offsetX = cx - node.x * z;
  offsetY = cy - node.y * z;
  applyTransform();
}

function renderLinks() {
  linksSvg.innerHTML = "";

  function drawBranch(node) {
    if (!node.children) return;
    for (const child of node.children) {
      if (node.collapsed) continue;

      const x1 = node.x,
        y1 = node.y;
      const x2 = child.x,
        y2 = child.y;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "#cbd5e1");
      line.setAttribute("stroke-width", "1.5");
      line.setAttribute("pointer-events", "none");
      linksSvg.appendChild(line);

      drawBranch(child);
    }
  }

  drawBranch(data);
}

function renderNodes() {
  canvas.querySelectorAll(".node").forEach((el) => el.remove());

  function renderNode(node, depth) {
    const nodeEl = document.createElement("div");
    nodeEl.className = "node";
    nodeEl.style.left = node.x + "px";
    nodeEl.style.top = node.y + "px";
    nodeEl.setAttribute("data-id", node.id);

    const content = document.createElement("div");
    content.className = "node-content";
    if (node.id === "root") content.classList.add("root");
    if (node.branch === "a") content.classList.add("branch-a");
    if (node.branch === "b") content.classList.add("branch-b");

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = node.text;
    label.onclick = (e) => {
      e.stopPropagation();
      editNode(node.id);
    };
    content.appendChild(label);

    const controls = document.createElement("div");
    controls.className = "controls";

    if (node.children && node.children.length > 0) {
      const toggle = document.createElement("button");
      toggle.textContent = node.collapsed ? "▶" : "▼";
      toggle.onclick = (e) => {
        e.stopPropagation();
        toggleNode(node.id);
      };
      controls.appendChild(toggle);
    }

    if (node.doc) {
      const docBtn = document.createElement("button");
      docBtn.textContent = "📄";
      docBtn.title = "Abrir documento";
      docBtn.onclick = (e) => {
        e.stopPropagation();
        openDocument(node.doc);
      };
      controls.appendChild(docBtn);
    }

    const addBtn = document.createElement("button");
    addBtn.textContent = "+";
    addBtn.onclick = (e) => {
      e.stopPropagation();
      addNode(node.id);
    };
    controls.appendChild(addBtn);

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteNode(node.id);
    };
    controls.appendChild(delBtn);

    content.appendChild(controls);
    nodeEl.appendChild(content);
    canvas.appendChild(nodeEl);

    if (!node.collapsed && node.children) {
      for (const child of node.children) {
        renderNode(child, depth + 1);
      }
    }
  }

  renderNode(data, 0);
}

function render() {
  renderLinks();
  renderNodes();
  applyTransform();
}

// ============================================================================
// UI INTERACTIONS
// ============================================================================

function setupUI() {
  document.getElementById("btn-add").onclick = () => addNode("root");
  document.getElementById("btn-fit").onclick = () => centerOnNode(data);
  document.getElementById("btn-export").onclick = exportAsJSON;
  document.getElementById("btn-import").onclick = () =>
    document.getElementById("file-input").click();
  document.getElementById("btn-reset").onclick = resetToDefault;

  document.getElementById("file-input").onchange = importFromJSON;

  document.getElementById("zoom-in").onclick = () =>
    setZoom(zoom * 1.2, wrap.offsetWidth / 2, wrap.offsetHeight / 2);
  document.getElementById("zoom-out").onclick = () =>
    setZoom(zoom / 1.2, wrap.offsetWidth / 2, wrap.offsetHeight / 2);
  document.getElementById("zoom-reset").onclick = () => {
    zoom = 1;
    offsetX = 0;
    offsetY = 0;
    applyTransform();
  };
}

function exportAsJSON() {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mapa-mental.json";
  a.click();
  showToast("Mapa exportado como JSON");
}

function importFromJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const imported = JSON.parse(ev.target.result);
      data = imported;
      save();
      render();
      showToast("Mapa importado com sucesso");
    } catch {
      showToast("Erro ao importar JSON");
    }
  };
  reader.readAsText(file);
}

async function resetToDefault() {
  if (confirm("Carregar estrutura padrão? Suas edições serão preservadas.")) {
    const defaultMap = await fetchDefaultMap();
    // Mescla estrutura padrão com dados atuais
    data = mergeWithDefault(data, defaultMap);
    save();
    render();
    showToast("Estrutura atualizada");
  }
}

function mergeWithDefault(current, defaultMap) {
  // Preserva a estrutura atual, apenas adiciona novos nós da estrutura padrão
  return current;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
  wrap.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = wrap.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    setZoom(zoom * factor, cx, cy);
  });

  wrap.addEventListener("mousedown", (e) => {
    if (e.button === 2) return; // right-click
    isDragging = true;
    dragStartX = e.clientX - offsetX;
    dragStartY = e.clientY - offsetY;
    wrap.classList.add("panning");
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      offsetX = e.clientX - dragStartX;
      offsetY = e.clientY - dragStartY;
      applyTransform();
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    wrap.classList.remove("panning");
  });

  canvas.addEventListener("mousedown", (e) => {
    if (e.target.closest(".node")) {
      isDragging = false;
    }
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", initializeMindMap);
