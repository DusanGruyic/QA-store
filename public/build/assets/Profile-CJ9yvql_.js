import{u as U,b as $,k as e,m as C}from"./productsRTK-a63fa0hW.js";import{H as O,F as T}from"./Footer-D9FBcr4T.js";import{a as R,u as k,s as z}from"./app-Bq6nXqsz.js";import{I as l}from"./InputError-D5Ibqstj.js";import{B as S}from"./button.esm-CyuHKLYo.js";import{I as i}from"./inputtext.esm-_Cm40c9v.js";import{F as E,a as B,b as n,D as c,g as G,c as H}from"./utils-D2bLMn8k.js";import"./Dropdown-DftF5NWu.js";import"./transition-GLrNVLI4.js";/* empty css            */import"./csstransition.esm-fEuSsQyL.js";function ae(){var p,_,u,h,b,j,f,y,g,N,v,w,F,I;const A=U();$.useState(!1);const{data:a,isLoading:Q}=R(localStorage.getItem("userId"),{refetchOnMountOrArgChange:!0}),{data:s,isLoading:V}=k(localStorage.getItem("userId"),{refetchOnMountOrArgChange:!0}),L=["Visa","MasterCard","American Express","Discover","JCB"],M=G(),P=H(),d={cardholder:((p=a==null?void 0:a.billing_info)==null?void 0:p.cardholder)||"",card_type:((_=a==null?void 0:a.billing_info)==null?void 0:_.card_type)||"",card_number:((u=a==null?void 0:a.billing_info)==null?void 0:u.card_number)||"",cvv:((h=a==null?void 0:a.billing_info)==null?void 0:h.cvv)||"",card_expiration_month:((b=a==null?void 0:a.billing_info)==null?void 0:b.card_expiration_date.split("/")[0])||"",card_expiration_year:`20${(j=a==null?void 0:a.billing_info)==null?void 0:j.card_expiration_date.split("/")[1]}`||"",first_name:((f=s==null?void 0:s.shipping_info)==null?void 0:f.first_name)||"",last_name:((y=s==null?void 0:s.shipping_info)==null?void 0:y.last_name)||"",email:((g=s==null?void 0:s.shipping_info)==null?void 0:g.email)||"",phone_number:((N=s==null?void 0:s.shipping_info)==null?void 0:N.phone_number)||"",street_and_number:((v=s==null?void 0:s.shipping_info)==null?void 0:v.street_and_number)||"",city:((w=s==null?void 0:s.shipping_info)==null?void 0:w.city)||"",postal_code:((F=s==null?void 0:s.shipping_info)==null?void 0:F.postal_code)||"",country:((I=s==null?void 0:s.shipping_info)==null?void 0:I.country)||""},x=async r=>{try{const o={...r,card_expiration_date:r.card_expiration_month&&r.card_expiration_year?`${r.card_expiration_month}/${r.card_expiration_year.replace("20","")}`:void 0};await C.put(`api/v1/customers/${localStorage.getItem("userId")}/billing-info`,o,{headers:{"Content-Type":"application/json"},withCredentials:!0});const t={first_name:r.first_name,last_name:r.last_name,email:r.email,phone_number:r.phone_number,street_and_number:r.street_and_number,city:r.city,postal_code:r.postal_code,country:r.country};await C.put(`api/v1/customers/${localStorage.getItem("userId")}/shipping-info`,t,{headers:{"Content-Type":"application/json"},withCredentials:!0}),A(z(4))}catch(o){console.error("Error submitting form:",o)}};return e.jsxs("div",{className:"fixed w-full",children:[e.jsx(O,{}),e.jsx("div",{className:"px-8 h-screen overflow-y-auto border-t-2 bg-gradient-to-br from-white to-gray-300",children:e.jsxs("div",{className:"flex h-full w-full",children:[e.jsx("div",{className:"flex border-2 border-gray-200 rounded shadow-2xl w-1/3 mx-4 p-4 h-fit my-4",children:e.jsx(E,{initialValues:d,onSubmit:x,enableReinitialize:!0,children:({handleChange:r,values:o})=>e.jsxs(B,{children:[e.jsx("h2",{className:"text-2xl font-bold text-primary",children:"Billing Information"}),["cardholder","card_type","card_number","cvv"].map(t=>e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:t,className:"text-400",children:t.replace(/_/g," ").replace(/\b\w/g,m=>m.toUpperCase())}),t==="card_type"?e.jsx(n,{as:c,id:t,value:o[t],options:L,onChange:m=>r({target:{name:t,value:m.value}}),placeholder:"Select Card type",className:"w-full text-center mt-2 border-1 border-gray-500"}):e.jsx(n,{as:i,id:t,name:t,value:o[t],placeholder:t==="card_number"?"****-****-****-****":t==="cvv"?"***":"",className:"w-full rounded pl-[14px] mt-1",onChange:r}),e.jsx(l,{message:null})]},t)),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"card_expiration_date",className:"text-400",children:"Expiration Date"}),e.jsxs("div",{className:"flex",children:[e.jsx(n,{as:c,id:"card_expiration_month",value:o.card_expiration_month,options:M,onChange:t=>r({target:{name:"card_expiration_month",value:t.value}}),placeholder:"Month",className:"w-fit border-1 border-gray-500"}),e.jsx(n,{as:c,id:"card_expiration_year",value:o.card_expiration_year,options:P,onChange:t=>r({target:{name:"card_expiration_year",value:t.value}}),placeholder:"Year",className:"w-fit ml-4 border-1 border-gray-500"})]})]}),e.jsx(S,{label:"Update",type:"submit",className:"bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl mt-4 border-1 border-indigo-400 w-full"})]})})}),e.jsx("div",{className:"flex border-2 border-gray-200 rounded shadow-2xl w-2/3 mx-4 p-4 h-fit my-4",children:e.jsx(E,{initialValues:d,onSubmit:x,enableReinitialize:!0,children:({handleChange:r,values:o})=>e.jsxs(B,{children:[e.jsx("h2",{className:"text-2xl font-bold text-primary",children:"Shipping Information"}),e.jsxs("div",{className:"flex",children:[" ",e.jsxs("div",{children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"first_name",className:"text-400",children:"First Name"}),e.jsx(n,{as:i,id:"first_name",name:"first_name",value:o.first_name,className:"w-full rounded pl-[14px]",onChange:r}),e.jsx(l,{message:null})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"last_name",className:"text-400",children:"Last Name"}),e.jsx(n,{as:i,id:"last_name",name:"last_name",value:o.last_name,className:"w-full rounded pl-[14px]",onChange:r}),e.jsx(l,{message:null})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"email",className:"text-400",children:"Email"}),e.jsx(n,{as:i,id:"email",name:"email",value:o.email,className:"w-full rounded pl-[14px]",onChange:r}),e.jsx(l,{message:null})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"phone_number",className:"text-400",children:"Phone Number"}),e.jsx(n,{as:i,id:"phone_number",name:"phone_number",value:o.phone_number,className:"w-full rounded pl-[14px]",onChange:r}),e.jsx(l,{message:null})]})]}),e.jsxs("div",{className:"ml-4",children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"street_and_number",className:"text-400",children:"Street Address"}),e.jsx(n,{as:i,id:"street_and_number",name:"street_and_number",value:o.street_and_number,className:"w-full rounded pl-[14px]",onChange:r}),e.jsx(l,{message:null})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"city",className:"text-400",children:"City"}),e.jsx(n,{as:i,id:"city",name:"city",value:o.city,className:"w-full rounded pl-[14px]",onChange:r}),e.jsx(l,{message:null})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"postal_code",className:"text-400",children:"Postal Code"}),e.jsx(n,{as:i,id:"postal_code",name:"postal_code",value:o.postal_code,className:"w-full rounded pl-[14px]",onChange:r}),e.jsx(l,{message:null})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"country",className:"text-400",children:"Country"}),e.jsx(n,{as:i,id:"country",name:"country",value:o.country,className:"w-full rounded pl-[14px]",onChange:r}),e.jsx(l,{message:null})]})]})]}),e.jsx(S,{label:"Update",type:"submit",className:"bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl mt-4 border-1 border-indigo-400 w-full"})]})})})]})}),e.jsx(T,{})]})}export{ae as default};
