import{W as p,b as d,k as s,Y as l}from"./productsRTK-a63fa0hW.js";import{G as c}from"./GuestLayout-GHvEa_5n.js";import{I as u}from"./InputError-D5Ibqstj.js";import{I as f,T as x}from"./TextInput-N4FUUdvJ.js";import{P as w}from"./PrimaryButton-CkgU7nij.js";import"./Footer-D9FBcr4T.js";import"./Dropdown-DftF5NWu.js";import"./transition-GLrNVLI4.js";function I(){const{data:e,setData:a,post:t,processing:o,errors:i,reset:m}=p({password:""});d.useEffect(()=>()=>{m("password")},[]);const n=r=>{r.preventDefault(),t(route("password.confirm"))};return s.jsxs(c,{children:[s.jsx(l,{title:"Confirm Password"}),s.jsx("div",{className:"mb-4 text-sm text-gray-600",children:"This is a secure area of the application. Please confirm your password before continuing."}),s.jsxs("form",{onSubmit:n,children:[s.jsxs("div",{className:"mt-4",children:[s.jsx(f,{htmlFor:"password",value:"Password"}),s.jsx(x,{id:"password",type:"password",name:"password",value:e.password,className:"mt-1 block w-full",isFocused:!0,onChange:r=>a("password",r.target.value)}),s.jsx(u,{message:i.password,className:"mt-2"})]}),s.jsx("div",{className:"flex items-center justify-end mt-4",children:s.jsx(w,{className:"ms-4",disabled:o,children:"Confirm"})})]})]})}export{I as default};