#!/usr/bin/env node
/**
 * Estimate when the next Claude model in each family ships.
 *
 * The release data and the forecasting model both live in claude-models.html,
 * between sentinel comments. This script lifts those two blocks out and runs
 * them in a VM rather than keeping a second copy, so the page and the CLI
 * cannot disagree about either the data or the maths.
 *
 * Usage:
 *   node scripts/predict-releases.js                 # table for today
 *   node scripts/predict-releases.js --json          # machine-readable
 *   node scripts/predict-releases.js --date 2026-06-01   # forecast as of a past date
 *   node scripts/predict-releases.js --weeks 12      # widen the "upcoming" window
 *
 * Backtesting: --date makes the model answerable. Point it at a date just
 * before a known release and see how close the estimate lands.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PAGE = path.join(__dirname, '..', 'claude-models.html');

function extract(source, name) {
  const begin = `// ===== ${name}:begin =====`;
  const end = `// ===== ${name}:end =====`;
  const from = source.indexOf(begin);
  const to = source.indexOf(end);
  if (from === -1 || to === -1) {
    throw new Error(`Could not find the "${name}" block in ${path.basename(PAGE)}. ` +
      `It is delimited by "${begin}" / "${end}" — did the sentinels get renamed?`);
  }
  return source.slice(from + begin.length, to);
}

function load() {
  const html = fs.readFileSync(PAGE, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    extract(html, 'release-data') +
    extract(html, 'forecast') +
    '\nglobalThis.__exports = { modelData, ReleaseForecast };',
    sandbox,
    { filename: 'claude-models.html' }
  );
  return sandbox.__exports;
}

function parseArgs(argv) {
  const opts = { json: false, date: null, weeks: 6, backtest: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const valueOf = inline => (inline !== undefined ? inline : argv[++i]);
    const [flag, inline] = arg.includes('=') ? arg.split(/=(.*)/s) : [arg, undefined];

    if (flag === '--json') opts.json = true;
    else if (flag === '--backtest') opts.backtest = true;
    else if (flag === '--date') opts.date = valueOf(inline);
    else if (flag === '--weeks') opts.weeks = Number(valueOf(inline));
    else if (flag === '--help' || flag === '-h') opts.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (opts.date && !/^\d{4}-\d{2}-\d{2}$/.test(opts.date)) {
    throw new Error(`--date expects YYYY-MM-DD, got "${opts.date}"`);
  }
  if (!Number.isFinite(opts.weeks) || opts.weeks <= 0) {
    throw new Error('--weeks expects a positive number');
  }
  return opts;
}

const HELP = `Estimate upcoming Claude model releases.

  --json            emit JSON instead of a table
  --date <ISO>      forecast as of a given day (default: today)
  --weeks <n>       horizon for the "upcoming" section (default: 6)
  --backtest        replay every past release and score the model against it
  -h, --help        this message
`;

const BOLD = s => `\x1b[1m${s}\x1b[0m`;
const DIM = s => `\x1b[2m${s}\x1b[0m`;
const RED = s => `\x1b[31m${s}\x1b[0m`;

function fmt(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

function table(forecast, freshness, weeks) {
  const horizon = weeks * 7;
  const lines = [];

  lines.push('');
  lines.push(BOLD(`Claude release forecast — as of ${fmt(forecast.asOf)}`));
  lines.push(DIM(`Ship cadence ${forecast.shipCadence}d between releases · lineup baseline ${forecast.baselineGap}d between a family's own releases`));
  lines.push('');

  const cols = [
    ['FAMILY', 10], ['LAST SHIPPED', 26], ['ESTIMATE', 15], ['WHEN', 14],
    ['CYCLE', 8], ['CONF', 8]
  ];
  lines.push(DIM(cols.map(([label, width]) => label.padEnd(width)).join('')));

  forecast.families.forEach(f => {
    const when = f.overdue ? RED(`${f.overdueBy}d overdue`.padEnd(14)) : `in ${f.daysFromNow}d`.padEnd(14);
    lines.push(
      f.name.padEnd(10) +
      `${f.lastVersion} (${f.daysSince}d)`.padEnd(26) +
      fmt(f.predictedDate).padEnd(15) +
      when +
      `${f.gapDays}d`.padEnd(8) +
      f.confidence.padEnd(8)
    );
    lines.push(DIM(
      ''.padEnd(10) +
      `window ${fmt(f.windowStart)} – ${fmt(f.windowEnd)} · ` +
      (f.sampleSize === 0
        ? 'no prior gaps, baseline only'
        : f.baselineWeight === 0
        ? `${f.sampleSize} prior gaps, weighted ${f.ownEwma}d, own history only`
        : `${f.sampleSize} prior gap, weighted ${f.ownEwma}d, ${f.baselineWeight}% baseline`)
    ));
  });

  const soon = forecast.families.filter(f => f.overdue || f.daysFromNow <= horizon);
  lines.push('');
  lines.push(BOLD(`Next ${weeks} weeks`));
  if (soon.length === 0) {
    lines.push(DIM('  nothing estimated to land in this window'));
  } else {
    soon.forEach(f => {
      lines.push(`  ${f.overdue ? RED('due now') : fmt(f.predictedDate)}  ${f.label}  ${DIM(`(${f.confidence} confidence)`)}`);
    });
  }

  const n = freshness.newest, a = freshness.average;
  lines.push('');
  lines.push(BOLD('Lineup freshness'));
  lines.push(`  newest release   ${n.percent}% of cycle  ${n.zone.padEnd(8)} ${DIM(`${n.version}, ${n.daysSince}d into its family's ~${n.cycleDays}d cycle`)}`);
  lines.push(`  lineup average   ${a.percent}% of cycle  ${a.zone.padEnd(8)} ${DIM(`${a.ageDays}d avg age across ${freshness.modelCount} families vs ${a.cycleDays}d cycle`)}`);
  lines.push(DIM(`  oldest: ${a.oldestVersion}, untouched for ${a.oldestDays}d`));
  lines.push('');
  lines.push(DIM('Estimates only. Anthropic publishes no release schedule.'));
  lines.push('');

  return lines.join('\n');
}

function backtestTable(bt) {
  const lines = [''];
  lines.push(BOLD('Backtest — every release forecast from the day before it shipped'));
  lines.push('');
  lines.push(DIM('ACTUAL        VERSION                   PREDICTED     ERROR      WINDOW   N'));
  bt.results.forEach(r => {
    const err = `${r.errorDays > 0 ? '+' : ''}${r.errorDays}d`;
    lines.push(
      fmt(r.actual).padEnd(14) +
      r.version.replace('Claude ', '').padEnd(26) +
      fmt(r.predicted).padEnd(14) +
      (Math.abs(r.errorDays) > 60 ? RED(err.padEnd(11)) : err.padEnd(11)) +
      (r.inWindow ? 'hit'.padEnd(9) : DIM('miss'.padEnd(9))) +
      String(r.sampleSize)
    );
  });

  const s = bt.summary;
  lines.push('');
  lines.push(`  ${s.count} forecasts · median absolute error ${BOLD(s.medianAbsErrorDays + 'd')} · mean ${s.meanAbsErrorDays}d`);
  lines.push(`  mature regime (≥2 prior gaps, ${s.matureCount} forecasts): median ${BOLD(s.matureMedianAbsErrorDays + 'd')}`);
  lines.push(`  mean signed error ${s.meanSignedErrorDays > 0 ? '+' : ''}${s.meanSignedErrorDays}d ${DIM(s.meanSignedErrorDays > 0 ? '(model runs late — it lags an accelerating cadence)' : '(model runs early)')}`);
  lines.push(`  actual date landed inside the estimate window ${s.hitRate}% of the time`);
  lines.push(DIM(`  excluding ${s.overdueCalls} "due now" calls, which trivially contain the next day: ${s.datedHitRate}%`));
  lines.push('');
  return lines.join('\n');
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err.message + '\n\n' + HELP);
    process.exit(1);
  }
  if (opts.help) {
    console.log(HELP);
    return;
  }

  const { modelData, ReleaseForecast } = load();

  if (opts.backtest) {
    const bt = ReleaseForecast.backtest(modelData);
    console.log(opts.json ? JSON.stringify(bt, null, 2) : backtestTable(bt));
    return;
  }

  const forecast = ReleaseForecast.forecastAll(modelData, opts.date || undefined);
  const freshness = ReleaseForecast.fleetFreshness(modelData, opts.date || undefined);

  if (opts.json) {
    console.log(JSON.stringify({ forecast, freshness }, null, 2));
  } else {
    console.log(table(forecast, freshness, opts.weeks));
  }
}

main();
