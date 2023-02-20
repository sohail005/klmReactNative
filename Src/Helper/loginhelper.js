var GlobalVars = {
    showSignOutF:()=>{}
};
export const getGlobalVarsF=()=>{
    return GlobalVars;
}
export const setGlobalVarsF=(globalVars)=>{
     GlobalVars = {GlobalVars,...globalVars};
}


