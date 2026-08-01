#!/usr/bin/env bash
#
# sync-references.sh — atualiza os repositórios de referência do Eminence SiteOps.
#
# Todos os repos são clonados de forma rasa (--depth 1) dentro de external/repos/,
# que está no .gitignore. Nada aqui é commitado e nenhum código externo é copiado
# para app/ ou src/. Apenas consulta de referência.
#
# Uso:
#   scripts/siteops/sync-references.sh            # clona os faltantes e faz fetch/update
#   scripts/siteops/sync-references.sh --prune    # remove diretórios fora da lista
#   scripts/siteops/sync-references.sh --check    # apenas reporta o estado, sem tocar
#   scripts/siteops/sync-references.sh --force    # refaz todos os clones do zero
#
# Saída: exit 0 se tudo ok; 1 se algum repo falhou ou está fora do esperado.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEST="$ROOT/external/repos"
LOG=""
MODE="${1:-}"

# Formato: "owner/repo" — o diretório local usa o último segmento do caminho.
# Categorias: ui | animacao | builders | analise | workflow
declare -a REPOS=(
  # UI base e componentes
  "shadcn-ui/ui"
  "shadcn/originui"
  "magicuidesign/magicui"
  "imskyleen/animate-ui"
  "birobirobiro/awesome-shadcn-ui"
  # Animação e experiência
  "motiondivision/motion"
  "darkroomengineering/lenis"
  "DavidHDev/react-bits"
  # Visual builders / referência de SiteOps
  "plasmicapp/plasmic"
  "prevwong/craft.js"
  "GrapesJS/grapesjs"
  "webstudio-is/webstudio"
  # Análise de sites, performance e SEO
  "GoogleChrome/lighthouse"
  "harlan-zw/unlighthouse"
  "sitespeedio/sitespeed.io"
  "microsoft/playwright"
  "garris/BackstopJS"
  "Visual-Regression-Tracker/Visual-Regression-Tracker"
  "pa11y/pa11y"
  "pa11y/pa11y-ci"
  "dequelabs/axe-core"
  "projectdiscovery/wappalyzergo"
  "puneetindersingh/open-seo-crawler"
  # Workflow Claude/agentes
  "thedotmack/claude-mem"
  "ccusage/ccusage"
  "github/spec-kit"
  "hesreallyhim/awesome-claude-code"
  "obra/superpowers"
)

dir_name() {
  local repo="$1"
  echo "$repo" | sed 's#.*/##'
}

if [ ! -d "$DEST" ]; then
  mkdir -p "$DEST"
fi

if ! grep -q "^/external/repos/" "$ROOT/.gitignore"; then
  echo "ERRO: external/repos/ não está no .gitignore. Abortando." >&2
  exit 1
fi

# --check: apenas reporta estado
if [ "$MODE" = "--check" ]; then
  for repo in "${REPOS[@]}"; do
    dir="$(dir_name "$repo")"
    if [ -d "$DEST/$dir/.git" ]; then
      local_head=$(git -C "$DEST/$dir" rev-parse --short HEAD 2>/dev/null || echo "?")
      echo "CLONADO  $repo  @ $local_head"
    else
      echo "FALTANDO $repo"
    fi
  done
  exit 0
fi

# --prune: remove dirs fora da lista (antes de clonar)
if [ "$MODE" = "--prune" ]; then
  for d in "$DEST"/*/; do
    [ -d "$d" ] || continue
    base="$(basename "$d")"
    keep=""
    for repo in "${REPOS[@]}"; do
      [ "$(dir_name "$repo")" = "$base" ] && keep=1
    done
    if [ -z "$keep" ]; then
      echo "removendo dir fora da lista: $base"
      rm -rf "$d"
    fi
  done
fi

fail=0

for repo in "${REPOS[@]}"; do
  dir="$(dir_name "$repo")"
  url="https://github.com/$repo.git"

  if [ "$MODE" = "--force" ] && [ -d "$DEST/$dir" ]; then
    echo "refazendo: $repo"
    rm -rf "$DEST/$dir"
  fi

  if [ ! -d "$DEST/$dir/.git" ]; then
    echo "clonando: $repo"
    if ! git clone --depth 1 --single-branch "$url" "$DEST/$dir" 2>"$DEST/$dir.clone.err"; then
      echo "FALHA ao clonar $repo (veja external/repos/$dir.clone.err)" >&2
      fail=1
    fi
    rm -f "$DEST/$dir.clone.err"
  else
    echo "atualizando: $repo"
    if ! git -C "$DEST/$dir" fetch --depth 1 origin >/dev/null 2>&1 \
      && ! git -C "$DEST/$dir" pull --ff-only origin >/dev/null 2>&1; then
      echo "FALHA ao atualizar $repo" >&2
      fail=1
    fi
  fi
done

echo
if [ "$fail" -eq 0 ]; then
  echo "OK — $(( ${#REPOS[@]} )) repos verificados em external/repos/"
else
  echo "Concluído com falhas. Confira as mensagens acima." >&2
fi

exit "$fail"
