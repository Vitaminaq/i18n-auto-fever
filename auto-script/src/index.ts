import { upload } from './upload';

type Action = 'upload' | 'download';

export const run = async () => {
    const action: Action = process.argv.slice(2)[0] as Action;
    if (!action) return;
    switch(action) {
        case 'upload':
            await upload();
            break;
    }
}

export {
    upload
}