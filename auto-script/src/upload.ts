import glob from 'glob';
import jiti from 'jiti';
import path from 'node:path';
import { flattenObject } from './utils';
import { uploadSource } from './axios';
import { outputFile } from 'fs-extra';

const translateLanguages = ['en_US', 'zh_TW', 'zh_HK', 'ja_JP'];
// const _require = jiti(process.cwd(), { interopDefault: true });

export const upload = () => {
    return glob(`!(node_modules)/**/zh-CN.{ts,js,json}`, {}, async (err, files) => {
        if (err) throw Error('glob：查找文件失败');

        if (!files.length) return;
    
        const pathMap = new Map();
        const map = new Map();
    
        const list = [];
    
        files.forEach(async (filePath) => {
            const arr = filePath.split('/zh-CN');
            let content = jiti(path.resolve(arr[0]))('./zh-CN');
            if (!content) return;
            content = content.default || content;
            content = flattenObject(content);

            list.push(...Object.keys(content).filter(k =>
                !map.has(content[k]) || map.get(content[k]) !== k
            ).map(key => {
                map.set(content[key], key);
                return {
                    key,
                    zh_CN: content[key]
                };
            }));
            pathMap.set(filePath, content);
        });

        console.log(list, 'mmmmmmmmmmmmmmmmmmmmmmm');
    
        const r = await uploadSource({ list, translate: true });
        if (r.code !== 0) return;
        const resultMap = new Map();
        r.data.forEach(i => {
            const { key, ZH_CN } = i;
            resultMap.set(`${key}${ZH_CN}`, i);
        });

        console.log(r, resultMap);
    
        translateLanguages.forEach((lan) => pathMap.forEach((value, key) => {
            if (key.endsWith('.json')) {
                let obj = {};
                Object.keys(value).forEach(i => {
                    const mapKey = `${i}${value[i]}`;
                    obj[i] = resultMap.get(mapKey)[lan].value;
                });
                outputFile(path.resolve(key.replace('zh_CN', lan)), `${JSON.stringify(obj, null, 4)}\n`);
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
