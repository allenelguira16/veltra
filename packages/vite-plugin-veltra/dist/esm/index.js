import{transformAsync as o}from"@babel/core";import a from"@babel/preset-typescript";import s from"@babel/preset-veltra";const m=()=>({name:"vite-plugin-veltra",enforce:"pre",async transform(t,r){if(/\.(tsx?|jsx?)$/.test(r)){const e=await o(t,{filename:r,sourceMaps:!0,presets:[s,a]});if(e?.code)return{code:e.code,map:e.map}}}});export{m as default};
//# sourceMappingURL=index.js.map
