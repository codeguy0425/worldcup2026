// Quick node script to compute standings using the actual project logic
import { matches } from './src/data/matches.js';
import { teams } from './src/data/teams.js';
import { computeStandings } from './src/utils/standings.js';

// Get all unique groups
const groups = [...new Set(matches.filter(m => m.stage === 'group').map(m => m.group))].sort();

let totalEliminated = 0;
let totalAdvanced = 0;

for (const g of groups) {
  const st = computeStandings(g, matches);
  const eliminated = st.filter(s => s.status === 'eliminated').map(s => `${s.teamZh} (${s.pts}pts)`);
  const advanced = st.filter(s => s.status === 'advanced').map(s => `${s.teamZh} (${s.pts}pts)`);
  
  if (eliminated.length || advanced.length) {
    console.log(`\n${g}:`);
    if (advanced.length) {
      console.log(`  ✅ Advanced: ${advanced.join(', ')}`);
      totalAdvanced += advanced.length;
    }
    if (eliminated.length) {
      console.log(`  ❌ Eliminated: ${eliminated.join(', ')}`);
      totalEliminated += eliminated.length;
    }
    
    // Show full standings
    console.log(`  Full:`);
    for (const s of st) {
      const tag = s.status === 'advanced' ? ' (A)' : s.status === 'eliminated' ? ' (E)' : '';
      console.log(`    ${s.teamZh} ${s.pts}pts (${s.played}P, ${s.gf}GF, ${s.ga}GA, ${s.gd >= 0 ? '+' : ''}${s.gd}GD)${tag}`);
    }
  }
}

console.log(`\n\nTotal Advanced: ${totalAdvanced}`);
console.log(`Total Eliminated: ${totalEliminated}`);
