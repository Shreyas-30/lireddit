export const isServer = () => typeof window === "undefined";
//window is "active" when on browser
//this was used by passing it to pause option in useMeQuery in NavBar
//to not run the me query on window side when ssr is true for index
//as we are not storing cookie on backend beacuse of which
//the me query will alwayas be null when SSRed
