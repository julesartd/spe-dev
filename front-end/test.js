import {ApiClient} from "./utils/client.js";

ApiClient.get("products").then((response) => {
    console.log("GET response:", response);
});