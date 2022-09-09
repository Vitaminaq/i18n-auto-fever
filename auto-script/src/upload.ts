import glob from 'glob';
import jiti from 'jiti';
import path from 'node:path';
import { uploadSource } from './axios';
import { outputFile } from 'fs-extra';

const root = process.cwd();

const translateLanguages = ['en_US', 'zh_TW', 'zh_HK', 'ja_JP'];

export const upload = () => {
    return glob(`${root}/!(node_modules)/**/zh-CN.{ts,js,json}`, {}, async (err, files) => {
        if (err) throw Error('glob：查找文件失败');
    
        const pathMap = new Map();
        const map = new Map();
    
        const list = [];

        console.log(files, 'yyyyyyyyyyyyyyyyyyy');

        if (!files.length) return;
    
        files.forEach(async (filePath) => {
            let content;
            if (filePath.endsWith('.json')) {
                content = (await import(filePath)).default;
            } else {
                const arr = filePath.split('/ZH_CN');
                content = jiti(path.resolve(arr[0]))('./ZH_CN').default;
            }
            list.push(...Object.keys(content).filter(k =>
                !map.has(content[k]) || map.get(content[k]) !== k
            ).map(key => {
                map.set(content[key], key);
                return {
                    key,
                    ZH_CN: content[key]
                };
            }));
            pathMap.set(filePath, content);
        });
    
        const r = await uploadSource({ list, translate: true });
        if (r.code !== 0) return;
        const resultMap = new Map();
        r.data.forEach(i => {
            const { key, ZH_CN } = i;
            resultMap.set(`${key}${ZH_CN}`, i);
        });
    
        translateLanguages.forEach((lan) => pathMap.forEach((value, key) => {
            if (key.endsWith('.json')) {
                let obj = {};
                Object.keys(value).forEach(i => {
                    const mapKey = `${i}${value[i]}`;
                    obj[i] = resultMap.get(mapKey)[lan].value;
                });
                outputFile(path.resolve(key.replace('ZH_CN', lan)), `${JSON.stringify(obj, null, 4)}\n`);
            } else {
                let str = 'export default {\n';
                Object.keys(value).forEach((i) => {
                    const mapKey = `${i}${value[i]}`;
                    if (resultMap.has(mapKey)) {
                        str = `${str}\t${i}: "${resultMap.get(mapKey)[lan].value}",\n`
                    } else {
                        str = `${str}\t${i}: '\"\"',\n`
                    }
                });
                outputFile(path.resolve(key.replace('ZH_CN', lan)), `${str}}\n`);
            }
        }));
    });
}
