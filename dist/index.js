import{fileURLToPath as U}from"url";import B from"path";var W=()=>U(import.meta.url),G=()=>B.dirname(W()),m=G();import ht from"cac";import R from"prompts";import w from"picocolors";var a=t=>{console.log(w.blue(t))},u=t=>{console.log(w.red(t))},y=t=>{console.log(w.green(t))},c=()=>{console.log()},h=t=>{console.log(t)};import L from"path";import{existsSync as ft}from"fs";import{lstatSync as K,readdirSync as V,promises as z,constants as J}from"fs";import q from"path";var P=(t,e)=>{let r=V(t);if(r.length>0){a(`The directory ${e} contains file that could conflict:`),c();for(let o of r)try{K(q.join(t,o)).isDirectory()?a(`  ${o}`):h(`  ${o}`)}catch{h(`  ${o}`)}return c(),a("Either try using a new directory name, or remove the files listed above."),c(),!1}return!0};async function x(t){try{return await z.access(t,J.W_OK),!0}catch{return!1}}import{statSync as Y,promises as k}from"fs";import p from"path";import H from"fast-glob";import{fileURLToPath as Q}from"url";import X from"cross-spawn";var I={"bun.lockb":"bun","pnpm-lock.yaml":"pnpm","yarn.lock":"yarn","package-lock.json":"npm","npm-shrinkwrap.json":"npm"},Z=t=>t instanceof URL?Q(t):t,tt={directory:"isDirectory",file:"isFile"},et=(t,e)=>e[tt[t]](),rt=(t,{cwd:e,type:r="file"})=>{e=Z(e);for(let o of t)try{let n=Y(p.resolve(e,o),{throwIfNoEntry:!1});if(!n)continue;if(et(r,n))return o}catch{}};function ot(t){let e=p.resolve(process.cwd())??"",{root:r}=p.parse(e),o=[t].flat(),n=p.resolve(r),i=s=>rt(o,s),f=[];for(;;){let s=i({cwd:e});if(s&&f.push(p.resolve(e,s)),e===n)break;e=p.dirname(e)}return f[0]}function E(){let t=ot(Object.keys(I)),e;return e=I[p.basename(t)],e}var nt=t=>t,T=async(t,e,{cwd:r,rename:o=nt}={})=>{let n=typeof t=="string"?[t]:t;if(n.length===0||!e)throw new TypeError("`src` and `dest` are required");let i=await H.async(n,{cwd:r,dot:!0,absolute:!1,stats:!1}),f=r?p.resolve(r,e):e;return Promise.all(i.map(async s=>{let l=p.dirname(s),F=o(p.basename(s)),_=r?p.resolve(r,s):s,j=p.join(f,l,F);return await k.mkdir(p.dirname(j),{recursive:!0}),k.copyFile(_,j)}))},$=async t=>{let e=[t==="yarn"?"":"install"];return new Promise((r,o)=>{X(t,e,{stdio:"inherit",env:{...process.env,ADBLOCK:"1",NODE_ENV:"development",DISABLE_OPENCOLLECTIVE:"1"}}).on("close",i=>{if(i!==0){o({command:`${t} ${e.join(" ")}`});return}r()})})};import O,{dirname as gt}from"path";import{mkdirSync as dt}from"fs";import D from"path";import{writeFile as it}from"fs/promises";import st from"node:os";import M from"picocolors";var S=async({appName:t,root:e,template:r,packageManager:o})=>{a(`Using ${o}`),c(),a(`Initializing project with template: ${r}
`);let n=D.join(m,r),i=["**"];r==="normal"&&i.push("!tailwind.config.js","!postcss.config.js"),await T(i,e,{cwd:n,rename(l){switch(l){case"gitignore":case"eslintrc.cjs":return`.${l}`;case"README-template.md":return"README.md";default:return l}}});let s={name:t,version:"1.0.0",private:!0,type:"module",scripts:{dev:"vite",build:"tsc && vite build",lint:"eslint --fix . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",preview:"vite preview",prepare:"husky"},dependencies:{axios:"^1.6.8",react:"^18.2.0","react-dom":"^18.2.0","react-router":"^6.22.3","react-router-dom":"^6.22.3"},devDependencies:{"@types/node":"^20.12.11","@types/react":"^18.2.66","@types/react-dom":"^18.2.22","@typescript-eslint/eslint-plugin":"^7.2.0","@typescript-eslint/parser":"^7.2.0","@vitejs/plugin-react":"^4.2.1",eslint:"^8.57.0","eslint-config-prettier":"^9.1.0","eslint-plugin-prettier":"^5.1.3","eslint-plugin-react-hooks":"^4.6.0","eslint-plugin-react-refresh":"^0.4.6",husky:"^9.0.11",prettier:"3.2.5",typescript:"^5.2.2",vite:"^5.2.0"}};r==="tailwind"&&(s.devDependencies={...s.devDependencies,autoprefixer:"^10.4.19",postcss:"^8.4.38","prettier-plugin-tailwindcss":"^0.5.14",tailwindcss:"^3.4.3"}),await it(D.join(e,"package.json"),JSON.stringify(s,null,2)+st.EOL),a(`
Installing dependencies:`);for(let l in s.dependencies)console.log(`- ${M.cyan(l)}`);a(`
Installing devDependencies:`);for(let l in s.devDependencies)console.log(`- ${M.cyan(l)}`);c(),await $(o)};import{execSync as g}from"child_process";import{rmSync as at}from"fs";import ct from"path";var pt=()=>{try{return g("git rev-parse --is-inside-work-tree",{stdio:"ignore"}),!0}catch{return!1}},lt=()=>{try{return g("hg --cwd . root",{stdio:"ignore"}),!0}catch{return!1}},mt=()=>{try{return g("git config init.defaultBranch",{stdio:"ignore"}),!0}catch{return!1}},N=t=>{let e=!1;try{return g("git --version",{stdio:"ignore"}),pt()||lt()?!1:(g("git init",{stdio:"ignore"}),mt()||g("git checkout -b main",{stdio:"ignore"}),g("git add -A",{stdio:"ignore"}),g('git commit -m "Initial commit from chaos"',{stdio:"ignore"}),!0)}catch{if(e)try{at(ct.join(t,".git"),{recursive:!0,force:!0})}catch{}return!1}};var C=async({projectPath:t,tailwind:e,packageManager:r})=>{let o=e?"tailwind":"normal",n=O.resolve(t);await x(gt(n))||(u("The application path is not writable, please check folder permissions and try again."),u("It is likely you do not have write permissions for this folder."),process.exit(1));let i=O.basename(n);dt(n,{recursive:!0});let f=process.cwd();y(`Creating a new vite app in ${n}.`),c(),process.chdir(n),await S({appName:i,root:n,template:o,packageManager:r}),N(n)&&(a("Initialized a git repository."),c()),y(`Project ${i} set up successfully`),c(),h("Inside that directory, you can run several commands:"),a(`  ${r} dev to start the development server.`),c(),a(`  ${r} build to build the App for production.`),c()};var A=t=>{u(`Command cancelled when setting ${t.name}`),process.exit(1)},ut=(t,e,r)=>{},yt=t=>{let e=L.resolve(t.trim()),r=L.basename(e);return ft(e)&&!P(e,r)&&process.exit(1),e};async function v(t,{tailwind:e}){let r={projectName:t,useTailwind:e};if(!t){let{project:i}=await R({type:"text",name:"project",message:"Your project name:",initial:"ViteReactTemplate"},{onCancel:A});r.projectName=i}if(!e){let{tailwind:i}=await R({type:"toggle",name:"tailwind",message:"Would you like to use tailwindcss?",initial:!0,active:"yes",inactive:"no"},{onCancel:A,onSubmit:ut});r.useTailwind=i}y("resolve config successfully!");let o=yt(r.projectName),n=E();try{await C({projectPath:o,packageManager:n,tailwind:r.useTailwind})}catch(i){console.log(i),u("crashed when downloading packages, please try again")}}var b=ht();b.command("chaos [projectName]","create project from template").option("-t, --tailwind","use tailwindcss").action(async(t,e)=>{await v(t,e)});b.help();b.parse();
//# sourceMappingURL=index.js.map