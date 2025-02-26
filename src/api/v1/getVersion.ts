import {Router} from "express";
import {APP_VERSION} from "@/config/config";


export default (router: Router) => {
    router.get("/version", (req, res) => {
        return res.status(200).json({
            version: APP_VERSION
        });
    });
};
