import {BrowserCacheLocation} from "@azure/msal-browser";
import {Configuration} from "@azure/msal-browser/dist/config/Configuration";

export const msalConfig: Configuration = {
    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID!,
        authority: process.env.REACT_APP_AUTHORITY_URL!,
        redirectUri: process.env.REACT_APP_REDIRECT_URL!,
        postLogoutRedirectUri: process.env.REACT_APP_REDIRECT_URL!
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: ["openid", "api://4d21c4b6-c697-4e8e-b48f-6d4f197c6ec8/digicore"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
