import{fileURLToPath as B}from"url";import W from"path";var G=()=>B(import.meta.url),J=()=>W.dirname(G()),m=J();import ve from"cac";import R from"prompts";import v from"picocolors";var a=e=>{console.log(v.blue(e))},u=e=>{console.log(v.red(e))},y=e=>{console.log(v.green(e))},c=()=>{console.log()},h=e=>{console.log(e)};import L from"path";import{existsSync as ue}from"fs";import{lstatSync as K,readdirSync as V,promises as z,constants as q}from"fs";import Y from"path";var k=(e,t)=>{let r=V(e);if(r.length>0){a(`The directory ${t} contains file that could conflict:`),c();for(let o of r)try{K(Y.join(e,o)).isDirectory()?a(`  ${o}`):h(`  ${o}`)}catch{h(`  ${o}`)}return c(),a("Either try using a new directory name, or remove the files listed above."),c(),!1}return!0};async function x(e){try{return await z.access(e,q.W_OK),!0}catch{return!1}}import{statSync as H,promises as P}from"fs";import p from"path";import Q from"fast-glob";import{fileURLToPath as X}from"url";import Z from"cross-spawn";var I={"bun.lockb":"bun","pnpm-lock.yaml":"pnpm","yarn.lock":"yarn","package-lock.json":"npm","npm-shrinkwrap.json":"npm"},ee=e=>e instanceof URL?X(e):e,te={directory:"isDirectory",file:"isFile"},re=(e,t)=>t[te[e]](),oe=(e,{cwd:t,type:r="file"})=>{t=ee(t);for(let o of e)try{let n=H(p.resolve(t,o),{throwIfNoEntry:!1});if(!n)continue;if(re(r,n))return o}catch{}};function ne(e){let t=p.resolve(process.cwd())??"",{root:r}=p.parse(t),o=[e].flat(),n=p.resolve(r),i=s=>oe(o,s),f=[];for(;;){let s=i({cwd:t});if(s&&f.push(p.resolve(t,s)),t===n)break;t=p.dirname(t)}return f[0]}function E(){let e=ne(Object.keys(I)),t;return t=I[p.basename(e)],t}var ie=e=>e,$=async(e,t,{cwd:r,rename:o=ie}={})=>{let n=typeof e=="string"?[e]:e;if(n.length===0||!t)throw new TypeError("`src` and `dest` are required");let i=await Q.async(n,{cwd:r,dot:!0,absolute:!1,stats:!1}),f=r?p.resolve(r,t):t;return Promise.all(i.map(async s=>{let l=p.dirname(s),_=o(p.basename(s)),U=r?p.resolve(r,s):s,j=p.join(f,l,_);return await P.mkdir(p.dirname(j),{recursive:!0}),P.copyFile(U,j)}))},D=async e=>{let t=[e==="yarn"?"":"install"];return new Promise((r,o)=>{Z(e,t,{stdio:"inherit",env:{...process.env,ADBLOCK:"1",NODE_ENV:"development",DISABLE_OPENCOLLECTIVE:"1"}}).on("close",i=>{if(i!==0){o({command:`${e} ${t.join(" ")}`});return}r()})})};import C,{dirname as ge}from"path";import{mkdirSync as fe}from"fs";import S from"path";import{writeFile as se}from"fs/promises";import ae from"node:os";import T from"picocolors";var M=async({appName:e,root:t,template:r,packageManager:o})=>{a(`Using ${o}`),c(),a(`Initializing project with template: ${r}
`);let n=S.join(m,r),i=["**"];r==="normal"&&i.push("!tailwind.config.js","!postcss.config.js"),await $(i,t,{cwd:n,rename(l){switch(l){case"gitignore":case"eslintrc.cjs":return`.${l}`;case"README-template.md":return"README.md";default:return l}}});let s={name:e,version:"1.0.0",private:!0,type:"module",scripts:{dev:"vite",build:"tsc && vite build",lint:"eslint --fix . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",preview:"vite preview",prepare:"husky"},dependencies:{axios:"^1.6.8",react:"^18.2.0","react-dom":"^18.2.0","react-router":"^6.22.3","react-router-dom":"^6.22.3"},devDependencies:{"@types/node":"^20.12.11","@types/react":"^18.2.66","@types/react-dom":"^18.2.22","@typescript-eslint/eslint-plugin":"^7.2.0","@typescript-eslint/parser":"^7.2.0","@vitejs/plugin-react":"^4.2.1",eslint:"^8.57.0","eslint-config-prettier":"^9.1.0","eslint-plugin-prettier":"^5.1.3","eslint-plugin-react-hooks":"^4.6.0","eslint-plugin-react-refresh":"^0.4.6",husky:"^9.0.11",prettier:"3.2.5",typescript:"^5.2.2",vite:"^5.2.0"}};r==="tailwind"&&(s.devDependencies={...s.devDependencies,autoprefixer:"^10.4.19",postcss:"^8.4.38","prettier-plugin-tailwindcss":"^0.5.14",tailwindcss:"^3.4.3"}),await se(S.join(t,"package.json"),JSON.stringify(s,null,2)+ae.EOL),a(`
Installing dependencies:`);for(let l in s.dependencies)console.log(`- ${T.cyan(l)}`);a(`
Installing devDependencies:`);for(let l in s.devDependencies)console.log(`- ${T.cyan(l)}`);c(),await D(o)};import{execSync as d}from"child_process";import{rmSync as ce}from"fs";import pe from"path";var le=()=>{try{return d("git rev-parse --is-inside-work-tree",{stdio:"ignore"}),!0}catch{return!1}},me=()=>{try{return d("hg --cwd . root",{stdio:"ignore"}),!0}catch{return!1}},de=()=>{try{return d("git config init.defaultBranch",{stdio:"ignore"}),!0}catch{return!1}},N=e=>{let t=!1;try{return d("git --version",{stdio:"ignore"}),le()||me()?!1:(d("git init",{stdio:"ignore"}),de()||d("git checkout -b main",{stdio:"ignore"}),d("git add -A",{stdio:"ignore"}),d('git commit -m "Initial commit from chaos"',{stdio:"ignore"}),!0)}catch{if(t)try{ce(pe.join(e,".git"),{recursive:!0,force:!0})}catch{}return!1}};var O=async({projectPath:e,tailwind:t,packageManager:r})=>{let o=t?"tailwind":"normal",n=C.resolve(e);await x(ge(n))||(u("The application path is not writable, please check folder permissions and try again."),u("It is likely you do not have write permissions for this folder."),process.exit(1));let i=C.basename(n);fe(n,{recursive:!0});let f=process.cwd();y(`Creating a new vite app in ${n}.`),c(),process.chdir(n),await M({appName:i,root:n,template:o,packageManager:r}),N(n)&&(a("Initialized a git repository."),c()),y(`Project ${i} set up successfully`),c(),h("Inside that directory, you can run several commands:"),a(`  ${r} dev to start the development server.`),c(),a(`  ${r} build to build the App for production.`),c(),process.chdir(`./${i}`)};var A=e=>{u(`Command cancelled when setting ${e.name}`),process.exit(1)},ye=(e,t,r)=>{},he=e=>{let t=L.resolve(e.trim()),r=L.basename(t);return ue(t)&&!k(t,r)&&process.exit(1),t};async function b(e,{tailwind:t}){let r={projectName:e,useTailwind:t};if(!e){let{project:i}=await R({type:"text",name:"project",message:"Your project name:",initial:"ViteReactTemplate"},{onCancel:A});r.projectName=i}if(!t){let{tailwind:i}=await R({type:"toggle",name:"tailwind",message:"Would you like to use tailwindcss?",initial:!0,active:"yes",inactive:"no"},{onCancel:A,onSubmit:ye});r.useTailwind=i}y("resolve config successfully!");let o=he(r.projectName),n=E();try{await O({projectPath:o,packageManager:n,tailwind:r.useTailwind})}catch(i){console.log(i),u("crashed when downloading packages, please try again")}}var F={name:"chaos-template-cli",version:"1.0.6",description:"",main:"src/cli.ts",scripts:{start:"tsup src/cli.ts --watch",build:"tsup-node --minify"},bin:{chaos:"dist/index.js"},keywords:[],author:"chaosspace",type:"module",license:"ISC",dependencies:{cac:"^6.7.14","cross-spawn":"^7.0.3","fast-glob":"^3.3.2","locate-path":"^7.2.0",ora:"^8.0.1",picocolors:"^1.0.0",prompts:"^2.4.2",tsup:"^8.0.2"},devDependencies:{"@types/cross-spawn":"^6.0.6","@types/node":"^20.12.10","@types/prompts":"^2.4.9",typescript:"^5.4.5"}};var w=ve();w.version(F.version);w.command("chaos [projectName]","create project from template").option("-t, --tailwind","use tailwindcss").action(async(e,t)=>{await b(e,t)});w.help();w.parse();
//# sourceMappingURL=index.js.map