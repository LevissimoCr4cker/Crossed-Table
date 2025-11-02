
---

### 🇫🇷 **README.md (Français)**

```markdown
# Crossed Table - University Matcher 🎓

![Demo](demo.gif)

## 🚀 Fonctionnalités
- Pondération personnalisée par critères (0–5 étoiles)
- Graphique radar comparatif
- Classement avec indice composite
- Confiance statistique (IC 95%)
- Support pour université personnalisée

## 🛠 Stack Technique
- JavaScript Vanilla, Chart.js, Bootstrap
- Données : QS World University Rankings 2025 (normalisées)
- Déploiement : GitHub Pages

## 📊 Fonctionnement
1. L'utilisateur définit les poids des critères (0–5 étoiles)
2. Normalisation par Z-score
3. Similarité pondérée → score final
4. Bootstrap (1 000 échantillons) → intervalle de confiance à 95%

## 🔧 Lancer en local
```bash
git clone https://github.com/levissimocr4cker/Crossed-Table.git
cd Crossed-Table
open index.html
