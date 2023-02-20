var GlobalVars = {
    showCartCountF:()=>{}
};
export const getCartGlobalVarsF=()=>{
    return GlobalVars;
}
export const setCartGlobalVarsF=(globalVars)=>{
     GlobalVars = {GlobalVars,...globalVars};
}


