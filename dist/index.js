import{fileURLToPath as z}from"url";import B from"path";var Y=()=>z(import.meta.url),H=()=>B.dirname(Y()),u=H();import{cac as xe}from"cac";import b from"prompts";import $ from"picocolors";var m=e=>{console.log($.blue(e))},c=e=>{console.log($.red(e))},E=e=>{console.log($.green(e))},f=()=>{console.log()},w=e=>{console.log(e)};import J from"path";import{existsSync as be}from"fs";import{lstatSync as Q,readdirSync as X,promises as Z,constants as ee}from"fs";import te from"path";var ie=["node_modules","favicon.ico"],S=e=>!e||typeof e!="string"?(c("An App name must be provided and it should be a string"),!1):e.length?e.match(/^\./)?(c("App name cannot start with a period"),!1):e.match(/^_/)?(c("App name cannot start with an underscore"),!1):e.trim()!==e?(c("name cannot contain leading or trailing spaces"),!1):(ie.forEach(function(t){if(e.toLowerCase()===t)return c(t+" is a blacklisted name"),!1}),/[~'!()*%&]/.test(e.split("/").slice(-1)[0])?(c(`name can no longer contain special characters ("~'!()*%&")`),!1):!0):(c("App name must be greate than zero"),!1),I=(e,t)=>{let i=X(e);if(i.length>0){m(`The directory ${t} contains file that could conflict:`),f();for(let n of i)try{Q(te.join(e,n)).isDirectory()?m(`  ${n}`):w(`  ${n}`)}catch{w(`  ${n}`)}return f(),m("Either try using a new directory name, or remove the files listed above."),f(),!1}return!0};async function M(e){try{return await Z.access(e,ee.W_OK),!0}catch{return!1}}import{statSync as ne,promises as F}from"fs";import l from"path";import oe from"fast-glob";import{fileURLToPath as re}from"url";import se from"cross-spawn";var L={"bun.lockb":"bun","pnpm-lock.yaml":"pnpm","yarn.lock":"yarn","package-lock.json":"npm","npm-shrinkwrap.json":"npm"},ae=e=>e instanceof URL?re(e):e,ce={directory:"isDirectory",file:"isFile"},le=(e,t)=>t[ce[e]](),pe=(e,{cwd:t,type:i="file"})=>{t=ae(t);for(let n of e)try{let o=ne(l.resolve(t,n),{throwIfNoEntry:!1});if(!o)continue;if(le(i,o))return n}catch{}};function me(e){let t=l.resolve(process.cwd())??"",{root:i}=l.parse(t),n=[e].flat(),o=l.resolve(i),a=r=>pe(n,r),s=[];for(;;){let r=a({cwd:t});if(r&&s.push(l.resolve(t,r)),t===o)break;t=l.dirname(t)}return s[0]}function O(){let e=me(Object.keys(L)),t;return t=L[l.basename(e)],t}var fe=e=>e,_=async(e,t,{cwd:i,rename:n=fe}={})=>{let o=typeof e=="string"?[e]:e;if(o.length===0||!t)throw new TypeError("`src` and `dest` are required");let a=await oe.async(o,{cwd:i,dot:!0,absolute:!1,stats:!1}),s=i?l.resolve(i,t):t;return Promise.all(a.map(async r=>{let d=l.dirname(r),g=n(l.basename(r)),p=i?l.resolve(i,r):r,h=l.join(s,d,g);return await F.mkdir(l.dirname(h),{recursive:!0}),F.copyFile(p,h)}))},R=async e=>{let t=[e==="yarn"?"":"install"];return new Promise((i,n)=>{let o=se(e,t,{stdio:"inherit",env:{...process.env,ADBLOCK:"1",NODE_ENV:"development",DISABLE_OPENCOLLECTIVE:"1"}});o.stdout?.on("data",a=>{console.log(a)}),o.on("close",a=>{if(a!==0){n({command:`${e} ${t.join(" ")}`});return}i()})})};import N,{dirname as we}from"path";import{mkdirSync as ve}from"fs";import v from"path";import de from"node:os";import G from"picocolors";import ge from"ora";import{Sema as ue}from"async-sema";import ye from"fast-glob";import{stat as he,writeFile as P,readFile as A}from"fs/promises";var W=async({appName:e,root:t,template:i,packageManager:n,alias:o})=>{m(`Using ${n}`),f(),m(`Initializing project with template: ${i}
`);let a=ge("Pulling template").start(),s=v.join(u,i),r=["**"];i==="normal"&&r.push("!tailwind.config.js","!postcss.config.js");try{await _(r,t,{cwd:s,rename(p){switch(p){case"gitignore":case"eslintrc.cjs":return`.${p}`;case"README-template.md":return"README.md";default:return p}}}),a.succeed("Succeed to pull template to local")}catch{a.fail("Fail to pull template to local, please try again!"),process.exit(1)}if(o!=="@/*"){let p=v.join(t,"tsconfig.json");await P(p,(await A(p,"utf8")).replace('"@/*"',`"${o}"`));let h=v.join(t,"vite.config.ts"),V=o.replace("/*","");await P(h,(await A(h,"utf8")).replace("@/",`${V}`));let T=await ye.async("**/*",{cwd:t,dot:!0,stats:!1,ignore:["tsconfig.json",".git/**/*"]}),C=new ue(8,{capacity:T.length});await Promise.all(T.map(async q=>{await C.acquire();let j=v.join(t,q);(await he(j)).isFile()&&await P(j,(await A(j,"utf8")).replace("@/",`${o.replace(/\*/g,"")}`)),C.release()}))}let g={name:e,version:"1.0.0",private:!0,type:"module",scripts:{dev:"vite",build:"tsc && vite build",lint:"eslint --fix . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",preview:"vite preview",prepare:"husky"},dependencies:{axios:"^1.7.2",react:"^18.3.1","react-dom":"^18.3.1","react-router":"^6.23.1","react-router-dom":"^6.23.1"},devDependencies:{"@types/node":"^20.12.13","@types/react":"^18.3.3","@types/react-dom":"^18.3.0","@typescript-eslint/eslint-plugin":"^7.11.0","@typescript-eslint/parser":"^7.11.0","@vitejs/plugin-react":"^4.3.0",eslint:"^8.57.0","eslint-config-prettier":"^9.1.0","eslint-plugin-prettier":"^5.1.3","eslint-plugin-react-hooks":"^4.6.2","eslint-plugin-react-refresh":"^0.4.7",husky:"^9.0.11",prettier:"3.2.5",typescript:"^5.4.5",vite:"^5.2.12"}};i==="tailwind"&&(g.devDependencies={...g.devDependencies,autoprefixer:"^10.4.19",postcss:"^8.4.38","prettier-plugin-tailwindcss":"^0.5.14",tailwindcss:"^3.4.3"}),await P(v.join(t,"package.json"),JSON.stringify(g,null,2)+de.EOL),m(`
Installing dependencies:`);for(let p in g.dependencies)console.log(`- ${G.cyan(p)}`);m(`
Installing devDependencies:`);for(let p in g.devDependencies)console.log(`- ${G.cyan(p)}`);f(),await R(n)};var U=async({projectPath:e,useTailwind:t,packageManager:i,initGit:n,alias:o})=>{let a=t?"tailwind":"normal",s=N.resolve(e);await M(we(s))||(c("The application path is not writable, please check folder permissions and try again."),c("It is likely you do not have write permissions for this folder."),process.exit(1));let r=N.basename(s);ve(s,{recursive:!0});let d=process.cwd();E(`Creating a new vite app in ${s}.`),f(),process.chdir(s),await W({appName:r,root:s,template:a,packageManager:i,alias:o}),E(`Project ${r} set up successfully`),f(),w("Inside that directory, you can run several commands:"),m(`  ${i} dev to start the development server.`),f(),m(`  ${i} build to build the App for production.`),f()};var k=e=>{c(`Command cancelled when setting ${e.name}`),process.exit(1)},ke=e=>{let t=J.resolve(e.trim()),i=J.basename(t);return be(t)&&!I(t,i)&&process.exit(1),t};async function D(e,{tailwind:t}){let i={projectName:e,useTailwind:t,initGit:!0,alias:"@/*"};if(!e){let{project:d}=await b({type:"text",name:"project",message:"Your project name:",initial:"ViteReactTemplate"},{onCancel:k});i.projectName=d}if(S(i.projectName)||process.exit(1),!t){let{tailwind:d}=await b({type:"toggle",name:"tailwind",message:"Would you like to use tailwindcss?",initial:!0,active:"yes",inactive:"no"},{onCancel:k});i.useTailwind=d}let{useAlias:n}=await b({type:"toggle",name:"useAlias",message:"Would you like to use import alias?",initial:!0,active:"yes",inactive:"no"},{onCancel:k}),o=/^[^*"]+\/\*\s*$/;if(n){let{alias:d}=await b({type:"text",name:"alias",message:"What import alias do you want:",initial:"@/*",validate:g=>o.test(g)?!0:"Import alias must follow the pattern <prefix>/*"},{onCancel:k});i.alias=d}let{initGit:a}=await b({type:"toggle",name:"initGit",message:"Would you like to init a git repo?",initial:!0,active:"yes",inactive:"no"},{onCancel:k});i.initGit=a;let s=ke(i.projectName),r=O();try{await U({...i,packageManager:r,projectPath:s})}catch(d){console.log(d),c("crashed when downloading packages, please try again")}}var K={name:"chaos-template-cli",version:"1.2.0",description:"",main:"src/cli.ts",scripts:{start:"tsup src/cli.ts --watch",build:"tsup-node --minify",test:"echo 'no test specified'",prepare:"husky"},bin:{chaos:"dist/index.js"},keywords:[],author:"chaosspace",type:"module",license:"ISC",dependencies:{"async-sema":"^3.1.1",cac:"^6.7.14","cross-spawn":"^7.0.3","fast-glob":"^3.3.2","locate-path":"^7.2.0",ora:"^8.0.1",picocolors:"^1.0.0",prompts:"^2.4.2",tsup:"^8.0.2"},devDependencies:{"@types/cross-spawn":"^6.0.6","@types/node":"^20.12.10","@types/prompts":"^2.4.9",husky:"^9.0.11",typescript:"^5.4.5"}};var x=xe();x.version(K.version);x.command("[projectName]","create project from template").option("-t, --tailwind","use tailwindcss").action(async(e,t)=>{await D(e,t)});x.help();x.parse();
