// #!/usr/bin/env node

// import { writeFileSync } from 'fs';
// import { createHighlighter } from 'shiki';
// import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

// /**
//  * Convert a Shiki JSON theme into the PrismTheme shape
//  */
// function convertShikiToPrism(shikiTheme) {
//   const prism = {
//     plain: {
//       color: shikiTheme.fg,
//       backgroundColor: shikiTheme.bg,
//     },
//     styles: [],
//   };

//   for (const rule of shikiTheme.settings) {
//     const { scope, settings } = rule;
//     if (!scope || !settings?.foreground) continue;

//     const scopes = Array.isArray(scope) ? scope : [scope];
//     for (const type of scopes) {
//       prism.styles.push({
//         types: [type],
//         style: {
//           color: settings.foreground,
//           ...(settings.fontStyle ? { fontStyle: settings.fontStyle } : {}),
//         },
//       });
//     }
//   }

//   return prism;
// }

// (async () => {
//   // Accept 'dark' or 'light' as first arg (default: dark)
//   const arg = process.argv[2] === 'light' ? 'light' : 'dark';
//   const shikiThemeName = `${arg}-plus`;
//   const outFile = `prism-theme-${arg}.json`;

//   const highlighter = await createHighlighter({
//     themes: [shikiThemeName],
//     langs: ['python'],
//     engine: createOnigurumaEngine(() => import('shiki/wasm')),
//   });

  

//   console.log(highlighter.codeToHtml(`def foo():\n  return 42`, { lang: 'python',
//      theme: shikiThemeName }))
//   const shikiTheme = highlighter.getTheme(shikiThemeName);
// //   const prismTheme = convertShikiToPrism(shikiTheme);

//   writeFileSync(outFile, JSON.stringify(shikiTheme, null, 2));
//   console.log(`✅ Generated ${outFile} using '${shikiThemeName}' theme`);
// })();