import { upload } from './upload';
import { loadUserConfig, defineConfig, type UserConfig } from "./utils";
import { init } from './init';

type Action = 'upload' | 'download' | "init";

export const run = async () => {
    const action: Action = process.argv.slice(2)[0] as Action;
    if (!action) return;

    await loadUserConfig();

    switch(action) {
        case 'upload':
            await upload();
            break;
        case "init":
            await init();
            break;
    }
}

export {
    upload,
    defineConfig,
    UserConfig
}